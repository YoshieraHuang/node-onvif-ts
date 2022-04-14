import { EventEmitter } from 'events';
import { OnvifServiceEvents } from './service-events';
import { OnvifServiceMedia } from './service-media';
import { OnvifServicePtz, ContinuousMoveParams, StopParams } from './service-ptz';
import { OnvifServiceDevice } from './service-device';
import { OnvifHttpAuth } from './http-auth';
import { IncomingHttpHeaders } from 'http';
import { Result } from './soap';

export interface Information {
    Manufacturer: string;
    Model: string;
    FirmwareVersion: string;
    SerialNumber: string;
    HardwareId: string;
}

export class OnvifDevice extends EventEmitter{
    address = '';
    services: Services;
    private xaddr = '';
    private user = '';
    private pass = '';
    private oxaddr: URL;
    private keepAddr = false;
    private lastResponse: any = null; // for debug
    private timeDiff = 0;
    private information: Information = null;
    private profileList: Profile[] = [];
    private currentProfile: Profile | null = null;
    private ptzMoving = false;

    constructor(configs: OnvifDeviceConfigs) {
        super();

        if (('xaddr' in configs) && (configs.xaddr)) {
            this.xaddr = configs.xaddr;
            const ourl = new URL(this.xaddr);
            this.address = ourl.hostname;
        } else if (('address' in configs) && (configs.address)) {
            this.keepAddr = true;
            this.address = configs.address;
            this.xaddr = 'http://' + this.address + '/onvif/device_service';
        }

        this.user = configs.user || '';
        this.pass = configs.pass || '';
        this.oxaddr = new URL(this.xaddr);
        if (this.user) {
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        }

        this.services = {
            device: new OnvifServiceDevice({xaddr: this.xaddr, user: this.user, pass: this.pass}),
            events: null,
            media: null,
            ptz: null
        };
    }

    getInformation() {
        if (this.information) {
            return this.information;
        }
        return null;
    }

    getCurrentProfile() {
        if (this.currentProfile) {
            return this.currentProfile;
        }
        return null;
    }

    getProfileList(): Profile[] {
        return this.profileList;
    }

    changeProfile(index: number | string): Profile | null {
        if (typeof(index) === 'number') {
            try{
                const p = this.profileList[index];
                if (p) {
                    this.currentProfile = p;
                    return p;
                }
                return null;
            } catch(e) {
                return null;
            }
        }

        const newProfiles = this.profileList.filter((v) => v.token === index);
        if (newProfiles.length === 0) {
            return null;
        }
        this.currentProfile = newProfiles[0];
        return this.currentProfile;
    }

    getUdpStreamUrl(): string {
        if (!this.currentProfile) {
            return '';
        }
        const url = this.currentProfile.stream?.udp;
        return url ? url : '';
    }

    async init() {
        await this.getSystemDateAndTime();
        await this.getCapabilities();
        await this.getDeviceInformation();
        await this.mediaGetProfiles();
        await this.mediaGetStreamUri();
        await this.mediaGetSnapshotUri();
        return this.getInformation();
    }

    fetchSnapshot(): Promise<Snapshot> {
        if (!this.currentProfile) {
            return Promise.reject(new Error('No media profile is selected'));
        }

        if (!this.currentProfile.snapshot) {
            return Promise.reject(new Error('The device does not support snaphost or you have not authorized by the device'));
        }

        return new Promise((resolve, reject) => {
            const ourl = new URL(this.currentProfile.snapshot);
            const options = {
                protocol: ourl.protocol,
                auth: this.user + ':' + this.pass,
                hostname: ourl.hostname,
                port: ourl.port || 80,
                path: ourl.pathname + ourl.search,
                method: 'GET',
            };
            const req = (new OnvifHttpAuth()).request(options, (res) => {
                const bufferList: Uint8Array[] = [];
                res.on('data', (buf: Uint8Array) => {
                    bufferList.push(buf);
                });
                res.on('end', () => {
                    if(res.statusCode === 200) {
                        const buffer = Buffer.concat(bufferList);
                        let ct = res.headers['content-type'];
                        if (!ct) {
                            ct = 'image/jpeg';
                        }
                        if (ct.match(/image\//)) {
                            resolve({headers: res.headers, body: buffer});
                        } else if (ct.match(/^text\//)) {
                            reject(new Error(buffer.toString()));
                        } else {
                            reject(new Error('Unexpected data:' + ct));
                        }
                    }
                });
                req.on('error', (error) => {
                    reject(error);
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.end();
        });
    }

    async ptzMove(params: PtzMoveParams): Promise<void> {
        if (!this.currentProfile) {
            return Promise.reject(new Error('No media profile is selected'));
        }

        if (!this.services.ptz) {
            return Promise.reject(new Error('The device does not support PTZ'));
        }

        const x = params.speed.x || 0;
        const y = params.speed.y || 0;
        const z = params.speed.z || 0;

        const timeout = params.timeout || 1;
        const p: ContinuousMoveParams = {
            ProfileToken: this.currentProfile.token,
            Velocity: { x, y, z},
            Timeout: timeout,
        };

        this.ptzMoving = true;
        await this.services.ptz.continuousMove(p);
        return;
    }

    async ptzStop(): Promise<void> {
        if (!this.currentProfile) {
            return Promise.reject(new Error('No media profile is selected'));
        }

        if (!this.services.ptz) {
            return Promise.reject(new Error('The device does not support PTZ'));
        }

        this.ptzMoving = false;
        const p: StopParams = {
            ProfileToken: this.currentProfile.token,
            PanTilt: true,
            Zoom: true,
        };

        await this.services.ptz.stop(p);
        return;
    }

    setAuth(user: string, pass: string) {
        this.user = user || '';
        this.pass = pass || '';
        if (this.user) {
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        }
        this.services.device?.setAuth(user, pass);
        this.services.events?.setAuth(user, pass);
        this.services.media?.setAuth(user, pass);
        this.services.ptz?.setAuth(user, pass);
    }

    private async getSystemDateAndTime(): Promise<void> {
        try {
            await this.services.device.getSystemDateAndTime();
            this.timeDiff = this.services.device.getTimeDiff();
        } catch (e) {
            return;
        }
    }

    private async getCapabilities() {
        let res: Result;
        try {
            res = await this.services.device.getCapabilities();
        } catch (e) {
            throw new Error('Failed to initialize the device: ' + e.toString());
        }

        this.lastResponse = res;
        const c = res.data?.GetCapabilitiesResponse?.Capabilities;
        if (!c) {
            throw new Error('Failed to initialize the device: No capabilities were found.');
        }

        const eventsXaddr = c.Events?.XAddr;
        if (eventsXaddr) {
            this.services.events = new OnvifServiceEvents({
                xaddr: this.getXaddr(eventsXaddr),
                timeDiff: this.timeDiff,
                user: this.user,
                pass: this.pass,
            });
        }

        const mediaXaddr = c.Media?.XAddr;
        if (mediaXaddr) {
            this.services.media = new OnvifServiceMedia({
                xaddr: this.getXaddr(mediaXaddr),
                timeDiff: this.timeDiff,
                user: this.user,
                pass: this.pass,
            });
        }

        const ptzXaddr = c.PTZ?.XAddr;
        if (ptzXaddr) {
            this.services.ptz = new OnvifServicePtz({
                xaddr: this.getXaddr(ptzXaddr),
                timeDiff: this.timeDiff,
                user: this.user,
                pass: this.pass,
            });
        }
    }

    private async getDeviceInformation() {
        try {
            const res = await this.services.device.getDeviceInformation();
            this.information = res.data?.GetDeviceInformationResponse as Information;
        } catch (e) {
            throw new Error('Failed to initialize the device: ' + e.toString());
        }
    }

    private async mediaGetProfiles() {
        try {
            const res = await this.services.media.getProfiles();
            this.lastResponse = res;
            const rawProfiles = res.data?.GetProfilesResponse?.Profiles as any[] | any;
            if (!rawProfiles) {
                throw new Error('Failed to initialize the device: The targeted device does not have any media profiles.');
            }
            const profiles: any[] = [].concat(rawProfiles);
            profiles.forEach((p) => {
                const profile: Profile = {
					token: p.$?.token || '',
                    name: p.Name || '',
                    snapshot: '',
                    video: {
                        source: null,
                        encoder: null,
                    },
                    audio: {
                        source: null,
                        encoder: null,
                    },
                    stream: {
                        udp: '',
                        http: '',
                        rtsp: '',
                    },
                    ptz: {
                        range: {
                            x: {min: 0, max: 0},
                            y: {min: 0, max: 0},
                            z: {min: 0, max: 0},
                        }
                    }
                };

                if (p.VideoSourceConfiguration) {
                    profile.video.source ={
                        token: p.VideoSourceConfiguration.$?.token || '',
                        name: p.VideoSourceConfiguration.Name || '',
                        bounds: {
                            width: parseInt(p.VideoSourceConfiguration.Bounds.$.width, 10),
                            height: parseInt(p.VideoSourceConfiguration.Bounds.$.height, 10),
                            x: parseInt(p.VideoSourceConfiguration.Bounds.$.x, 10),
                            y: parseInt(p.VideoSourceConfiguration.Bounds.$.y, 10)
                        }
                    };
                }

                if (p.VideoEncoderConfiguration) {
					profile.video.encoder = {
						token: p.VideoEncoderConfiguration.$?.token,
						name: p.VideoEncoderConfiguration.Name,
						resolution: {
							width: parseInt(p.VideoEncoderConfiguration.Resolution.Width, 10),
							height: parseInt(p.VideoEncoderConfiguration.Resolution.Height, 10),
						},
						quality: parseInt(p.VideoEncoderConfiguration.Quality, 10),
						framerate: parseInt(p.VideoEncoderConfiguration.RateControl.FrameRateLimit, 10),
						bitrate: parseInt(p.VideoEncoderConfiguration.RateControl.BitrateLimit, 10),
						encoding: p.VideoEncoderConfiguration.Encoding
					};
                }

                if (p.AudioSourceConfiguration) {
                    profile.audio.source = {
						token: p.AudioSourceConfiguration.$?.token || '',
						name: p.AudioSourceConfiguration.Name || '',
					};
                }

                if (p.AudioEncoderConfiguration) {
					profile.audio.encoder = {
						token: p.AudioEncoderConfiguration.$?.token || '',
						name: p.AudioEncoderConfiguration.Name,
						bitrate: parseInt(p.AudioEncoderConfiguration.Bitrate, 10),
						samplerate: parseInt(p.AudioEncoderConfiguration.SampleRate, 10),
						encoding: p.AudioEncoderConfiguration.Encoding
					};
                }

                if (p.PTZConfiguration) {
					try {
						const r = p.PTZConfiguration.PanTiltLimits.Range;
						const xr = r.XRange;
						const x = profile.ptz.range.x;
						x.min = parseFloat(xr.Min);
						x.max = parseFloat(xr.Max);
					} catch (e) { }
					try {
						const r = p.PTZConfiguration.PanTiltLimits.Range;
						const yr = r.YRange;
						const y = profile.ptz.range.y;
						y.min = parseFloat(yr.Min);
						y.max = parseFloat(yr.Max);
					} catch (e) { }
					try {
						const r = p.PTZConfiguration.ZoomLimits.Range;
						const zr = r.XRange;
						const z = profile.ptz.range.z;
						z.min = parseFloat(zr.Min);
						z.max = parseFloat(zr.Max);
					} catch (e) { }
                }

                this.profileList.push(profile);
                if (!this.currentProfile) {
                    this.currentProfile = profile;
                }
            });
        } catch (e) {
            throw new Error('Failed to initialize the device: ' + e.toString());
        }
    }

    private async mediaGetStreamUri() {
        const protocolList: ('UDP' | 'HTTP' | 'RTSP')[] = ['UDP', 'HTTP', 'RTSP'];
        let index = 0;
        for (const profile of this.profileList) {
            if(!profile) {
                ++index;
                continue;
            }

            for (const protocol of protocolList) {
                const params = {
                    ProfileToken: profile.token,
                    Protocol: protocol
                };
                try {
                    const res = await this.services.media.getStreamUri(params);
                    this.lastResponse = res;
                    let uri = res.data.GetStreamUriResponse.MediaUri.Uri as string;
                    uri = this.getUri(uri);
                    switch(protocol) {
                        case 'HTTP':
                            this.profileList[index].stream.http = uri;
                            break;
                        case 'RTSP':
                            this.profileList[index].stream.rtsp = uri;
                            break;
                        case 'UDP':
                            this.profileList[index].stream.udp = uri;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            ++index;
        }
    }

    private async mediaGetSnapshotUri() {
        let index = 0;
        for (const profile of this.profileList) {
            if (!profile) {
                ++index;
                continue;
            }
            try {
                const params = { ProfileToken: profile.token};
                const result = await this.services.media.getSnapshotUri(params);
                this.lastResponse = result;
                let snapshotUri = result.data.GetSnapshotUriResponse.MediaUri.Uri;
                snapshotUri = this.getSnapshotUri(snapshotUri);
                this.profileList[index].snapshot = snapshotUri;
            } catch (e) {
                console.log(e);
            }
            ++index;
        }
    }

    private getXaddr(directXaddr: string) {
        if(!this.keepAddr) {
            return directXaddr;
        }

        const address = new URL(directXaddr);
        const path = address.pathname + address.search;
        const xaddr = 'http://' + this.address + path;
        return xaddr;
    }

    private getUri(directUri: string | {'_': string}) {
        let directuri = '';
        if (typeof(directUri) === 'object' && directUri._) {
            directuri = directUri._;
        } else if (typeof(directUri) === 'string') {
            directuri = directUri;
        }
        if (!this.keepAddr) return directuri;
        const base = new URL('http://' + this.address);
        const parts = new URL(directuri);
        base.pathname = base.pathname === '/' ? parts.pathname : base.pathname + parts.pathname;
        base.search = parts.search;
        return base.href;
    }

    private getSnapshotUri(directUri: string | {'_': string}) {
        let directuri = '';
        if (typeof(directUri) === 'object' && directUri._) {
            directuri = directUri._;
        } else if (typeof(directUri) === 'string') {
            directuri = directUri;
        }
        if (!this.keepAddr) return directuri;
        const base = new URL('http://' + this.address);
        const parts = new URL(directuri);
        base.protocol = parts.protocol;
        base.pathname = base.pathname === '/' ? parts.pathname : base.pathname + parts.pathname;
        base.search = parts.search;
        return base.href;
    }
}

export interface Snapshot {
    headers: IncomingHttpHeaders;
    body: Buffer;
}

export type OnvifDeviceConfigs = ({ xaddr: string} | {address: string}) & {
    user?: string;
    pass?: string;
};

export interface Profile {
    name: string;
    token: string;
    stream: { udp: string, http: string, rtsp: string };
    snapshot: string;
    video: {source: VideoSource, encoder: VideoEncoder};
    audio: {source: AudioSource, encoder: AudioEncoder};
    ptz: { range : {
        x: {min: number, max: number},
        y: {min: number, max: number},
        z: {min: number, max: number},
    }};
}

export interface VideoSource {
    token: string;
    name: string;
    bounds: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
}

export interface VideoEncoder {
    token: string;
    name: string;
    resolution: {
        width: number,
        height: number,
    };
    quality: number;
    framerate: number;
    bitrate: number;
    encoding: string;
}

export interface AudioSource {
    token: string;
    name: string;
}

export interface AudioEncoder {
    token: string;
    name: string;
    bitrate: number;
    samplerate: number;
    encoding: string;
}

export interface PtzMoveParams {
    speed: {x: number, y: number, z:number};
    timeout?: number;
}

interface Services {
    device: OnvifServiceDevice | null;
    events: OnvifServiceEvents | null;
    media: OnvifServiceMedia | null;
    ptz: OnvifServicePtz | null;
}
