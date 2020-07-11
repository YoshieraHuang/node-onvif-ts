import { createSocket, Socket } from 'dgram';
import { randomBytes } from 'crypto';
import { parse } from './module/soap';

const DISCOVERY_RETRY_MAX = 3;
const DISCOVERY_WAIT = 3000;
const DISCOVERY_INTERVAL = 150;
const MULTICAST_ADDRESS = '239.255.255.250';
const PORT = 3702;
let discoveryIntervalTimer: NodeJS.Timeout = null;
let discoveryWaitTimer: NodeJS.Timeout = null;
let udp: Socket = null;
let devices: {[key: string]: Probe} = {};

export interface Probe {
    urn: string;
    name: string;
    hardware: string;
    location: string;
    types: string[];
    xaddrs: string[];
    scopes: string[];
}

export function startDiscovery(callback: (probe: Probe, error?: any) => void) {
    startProbe().then((list) => {
        const execCallback = () => {
            const d = list.shift();
            if (d) {
                callback(d);
                setTimeout(() => {
                    execCallback();
                }, 100);
            }
        };
        execCallback();
    }).catch((error) => {
        callback(null, error);
    });
}

export function startProbe(): Promise<Probe[]> {
    return new Promise((resolve, reject) => {
        devices = {};
        udp = createSocket('udp4');
        udp.once('error', (error) => {
            console.log(error);
            reject(error);
        });

        udp.on('message', (buf) => {
            parse(buf.toString()).then((res) => {
                let urn: string;
                let xaddrs: string[] = [];
                let scopes: string[] = [];
                let types: string[] = [];
                try {
                    const probeMatch = res.Body.ProbeMatches.ProbeMatch;
                    urn = probeMatch.EndpointReference.Address;
                    xaddrs = probeMatch.XAddrs.split(/\s+/);

                    if(typeof(probeMatch.Scopes) === 'string') {
                        scopes = probeMatch.Scopes.split(/\s+/);
                    } else if(typeof(probeMatch.Scopes) === 'object' && typeof(probeMatch.Scopes._) === 'string') {
                        scopes = probeMatch.Scopes._.split(/\s+/);
                    }

                    // modified to support Pelco cameras
                    if(typeof(probeMatch.Types) === 'string') {
                        types = probeMatch.Types.split(/\s+/);
                    } else if(typeof(probeMatch.Types) === 'object' && typeof(probeMatch.Types._) === 'string') {
                        types = probeMatch.Types._.split(/\s+/);
                    }
                } catch(e) {
                    return;
                }

                if(urn && xaddrs.length > 0 && scopes.length > 0) {
					if(!devices[urn]) {
						let name = '';
						let hardware = '';
						let location = '';
						scopes.forEach((s) => {
							if(s.indexOf('onvif://www.onvif.org/hardware/') === 0) {
								hardware = s.split('/').pop();
							} else if(s.indexOf('onvif://www.onvif.org/location/') === 0) {
								location = s.split('/').pop();
							} else if(s.indexOf('onvif://www.onvif.org/name/') === 0) {
								name = s.split('/').pop();
								name = name.replace(/_/g, ' ');
							}
						});
						const probe = {
							urn,
							name,
							hardware,
							location,
							types,
							xaddrs,
							scopes
						};
						devices[urn] = probe;
					}
				}
			}).catch((error) => {
                // Do nothing.
                console.log(error);
			});
        });

        udp.bind(() => {
            udp.removeAllListeners('error');
            sendProbe().catch((e) => { reject(e); });
            discoveryIntervalTimer = setTimeout(() => {
				stopProbe().then(() => {
					resolve(Object.values(devices));
				}).catch((err: any) => {
					reject(err);
				});
			}, DISCOVERY_WAIT);
        });
    });
}

function sendProbe() {
    let soapTmpl = '';
	soapTmpl += '<?xml version="1.0" encoding="UTF-8"?>';
	soapTmpl += '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing">';
	soapTmpl += '  <s:Header>';
	soapTmpl += '    <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</a:Action>';
	soapTmpl += '    <a:MessageID>uuid:__uuid__</a:MessageID>';
	soapTmpl += '    <a:ReplyTo>';
	soapTmpl += '      <a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address>';
	soapTmpl += '    </a:ReplyTo>';
	soapTmpl += '    <a:To s:mustUnderstand="1">urn:schemas-xmlsoap-org:ws:2005:04:discovery</a:To>';
	soapTmpl += '  </s:Header>';
	soapTmpl += '  <s:Body>';
	soapTmpl += '    <Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery">';
	soapTmpl += '      <d:Types xmlns:d="http://schemas.xmlsoap.org/ws/2005/04/discovery" xmlns:dp0="http://www.onvif.org/ver10/network/wsdl">dp0:__type__</d:Types>';
	soapTmpl += '    </Probe>';
	soapTmpl += '  </s:Body>';
	soapTmpl += '</s:Envelope>';
	soapTmpl = soapTmpl.replace(/\>\s+\</g, '><');
    soapTmpl = soapTmpl.replace(/\s+/, ' ');

    const soapSet = ['NetworkVideoTransmitter', 'Device', 'NetworkVideoDisplay'].map((type) => {
        let s = soapTmpl;
        s = s.replace('__type__', type);
        s = s.replace('__uuid__', createUuidV4());
        return s;
    });

    const soapList: string[] = [];
    Array(DISCOVERY_RETRY_MAX).fill(0).forEach(() => {
        soapSet.forEach((s) => {
            soapList.push(s);
        });
    });

    return new Promise((resolve, reject) => {
		if (!udp) {
			reject(new Error('No UDP connection is available. The init() method might not be called yet.'));
		}
		const send = () => {
			const soap = soapList.shift();
			if(soap) {
				const buf = Buffer.from(soap, 'utf8');
				udp.send(buf, 0, buf.length, PORT, MULTICAST_ADDRESS, () => {
					discoveryIntervalTimer = setTimeout(() => {
						send();
					}, DISCOVERY_INTERVAL);
				});
			} else {
				resolve();
			}
		};
		send();
	});
}

function createUuidV4() {
    const clist = randomBytes(16).toString('hex').toLowerCase().split('');
	clist[12] = '4';
	// tslint:disable-next-line: no-bitwise
	clist[16] = (parseInt(clist[16], 16) & 3 | 8).toString(16);
	const m = clist.join('').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})/);
	const uuid = [m[1], m[2], m[3], m[4], m[5]].join('-');
	// uuid = uuid;
	return uuid;
}

export function stopDiscovery() {
    return stopProbe();
}

function stopProbe() {
    if (discoveryIntervalTimer !== null) {
        clearTimeout(discoveryIntervalTimer);
        discoveryIntervalTimer = null;
    }

    if (discoveryWaitTimer !== null) {
        clearTimeout(discoveryWaitTimer);
        discoveryWaitTimer = null;
    }

    return new Promise((resolve) => {
        if (udp) {
            udp.close(() => {
                udp.unref();
                udp = null;
                resolve();
            });
        } else {
            resolve();
        }
    });
}