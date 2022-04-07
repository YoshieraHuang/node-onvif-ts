import { requestCommand, Result } from './soap';
import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';

export class OnvifServiceDevice extends OnvifServiceBase{
    constructor(configs: OnvifServiceBaseConfigs) {
        super(configs);
        this.namespaceAttrList = [
            'xmlns:tds="http://www.onvif.org/ver10/device/wsdl"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"'
        ];
    }

    getTimeDiff() {
        return this.timeDiff;
    }

    private fixTimeDiff(date: Date) {
      if (date) {
        const deviceTime = date.getTime();
        const myTime = (new Date()).getTime();
        this.timeDiff = deviceTime - myTime;
      }
    }

    getCapabilities(): Promise<Result> {
        let soapBody = '';
        soapBody += '<tds:GetCapabilities>';
        soapBody += '  <tds:Category>All</tds:Category>';
        soapBody += '</tds:GetCapabilities>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCapabilities', soap);
    }

    getWsdlUrl(): Promise<Result> {
        const soapBody = '<tds:GetWsdlUrl/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetWsdlUrl', soap);
    }

    getDiscoveryMode(): Promise<Result> {
        const soapBody = '<tds:GetDiscoveryMode/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetDiscoveryMode', soap);
    }

    getScopes(): Promise<Result> {
        const soapBody = '<tds:GetScopes/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetScopes', soap);
    }

    setScopes(params: {Scopes: string[]}): Promise<Result> {
        let soapBody = '<tds:SetScopes>';
        params.Scopes.forEach((s) => {
            soapBody += '<tds:Scopes>' + s + '</tds:Scopes>';
        });
        soapBody += '</tds:SetScopes>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetScopes', soap);
    }

    addScopes(params: {Scopes: string[]}): Promise<Result> {
        let soapBody = '<tds:AddScopes>';
        params.Scopes.forEach((s) => {
            soapBody += '<tds:ScopeItem>' + s + '</tds:ScopeItem>';
        });
        soapBody += '</tds:AddScopes>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddScopes', soap);
    }

    removeScopes(params: {Scopes: string[]}): Promise<Result> {
        let soapBody = '<tds:RemoveScopes>';
        params.Scopes.forEach((s) => {
            soapBody += '<tds:ScopeItem>' + s + '</tds:ScopeItem>';
        });
        soapBody += '</tds:RemoveScopes>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemoveScopes', soap);
    }

    getHostname(): Promise<Result> {
        const soapBody = '<tds:GetHostname/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetHostname', soap);
    }

    setHostname(params: {Name: string}): Promise<Result> {
        let soapBody = '<tds:SetHostname>';
        soapBody += '<tds:Name>' + params.Name + '</tds:Name>';
        soapBody += '</tds:SetHostname>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetHostname', soap);
    }

    getDNS(): Promise<Result> {
        const soapBody = '<tds:GetDNS/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetDNS', soap).then((result) => {
            const di = result.data.DNSInformation;
            if(!di.SearchDomain) {
                di.SearchDomain = [];
            } else if(!Array.isArray(di.SearchDomain)) {
                di.SearchDomain = [di.SearchDomain];
            }
            if(!di.DNSManual) {
                di.DNSManual = [];
            } else if(!Array.isArray(di.DNSManual)) {
                di.DNSManual = [di.DNSManual];
            }
            return result;
        });
    }

    setDNS(params: SetDNSParams): Promise<Result> {
        let soapBody = '<tds:SetDNS>';
        if (params.FromDHCP) {
            soapBody += `<tds:FromDHCP>${params.FromDHCP}</tds:FromDHCP>`;
        }

        if (params.SearchDomain) {
            params.SearchDomain.forEach((s) => {
                soapBody += `<tds:SearchDomain>${s}</tds:SearchDomain>`;
            });
        }

        if (params.DNSManual) {
            soapBody += '<tds:DNSManual>';
            params.DNSManual.forEach((o) => {
                soapBody += `<tt:Type>${o.Type}</tt:Type>`;
                if(o.Type === 'IPv4') {
                    soapBody += '<tt:IPv4Address>' + o.IPv4Address + '</tt:IPv4Address>';
                } else {
                    soapBody += '<tt:IPv6Address>' + o.IPv6Address + '</tt:IPv6Address>';
                }
            });
            soapBody += '</tds:DNSManual>';
        }

        soapBody += '</tds:SetDNS>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetDNS', soap);
    }

    getNetworkInterfaces(): Promise<Result> {
        const soapBody = '<tds:GetNetworkInterfaces/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetNetworkInterfaces', soap);
    }

    getNetworkProtocols(): Promise<Result> {
        const soapBody = '<tds:GetNetworkProtocols/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetNetworkProtocols', soap);
    }

    setNetworkProtocols(params: SetNetworkProtocolsParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tds:SetNetworkProtocols>';
		params.NetworkProtocols.forEach((o) => {
			soapBody += '<tds:NetworkProtocols>';
            soapBody += `<tt:Name>${o.Name}</tt:Name>`;

            if ('Enabled' in o) {
                soapBody += `<tt:Enabled>${o.Enabled}</tt:Enabled>`;
            }

            if ('Port' in o) {
                soapBody += `<tt:Port>${o.Port}</tt:Port>`;
            }

			soapBody += '</tds:NetworkProtocols>';
		});
		soapBody += '</tds:SetNetworkProtocols>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetNetworkProtocols', soap);
    }

    getNetworkDefaultGateway(): Promise<Result> {
        const soapBody = '<tds:GetNetworkDefaultGateway/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetNetworkDefaultGateway', soap);
    }

    setNetworkDefaultGateway(params: SetNetworkDefaultGatewayParams): Promise<Result> {
        let soapBody = '<tds:SetNetworkDefaultGateway>';
        params.NetworkGateway.forEach((o) => {
            if('IPv4Address' in o) {
                soapBody += `<tds:IPv4Address>${o.IPv4Address}</tds:IPv4Address>`;
            } else if ('IPv6Address' in o) {
                soapBody += `<tds:IPv6Address>${o.IPv6Address}</tds:IPv6Address>`;
            }
        });
        soapBody += '</tds:SetNetworkDefaultGateway>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetNetworkDefaultGateway', soap);
    }

    getDeviceInformation(): Promise<Result> {
        const soapBody = '<tds:GetDeviceInformation/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetDeviceInformation', soap);
    }

    getSystemDateAndTime(): Promise<Result> {
        const soapBody = '<tds:GetSystemDateAndTime/>';
        return new Promise<Result>((resolve, reject) => {
          const soap = this.createRequestSoap(soapBody, true);
          requestCommand(this.oxaddr, 'GetSystemDateAndTime', soap)
          .then((result) => {
            const parsed = parseGetSystemDateAndTime(result.converted);
            this.fixTimeDiff(parsed?.date);
            return resolve(result);
          })
          .catch((error) => {
            const newSoap = this.createRequestSoap(soapBody);
            requestCommand(this.oxaddr, 'GetSystemDateAndTime', newSoap)
            .then((result) => {
              const parsed = parseGetSystemDateAndTime(result.converted);
              this.fixTimeDiff(parsed?.date);
              return resolve(result);
            })
            .catch((err) => reject(err));
          });
        })
    }

    setSystemDateAndTime(params: SetSystemDateAndTimeParams): Promise<Result> {
        if (!params.TimeZone.match(/^[A-Z]{3}\-?\d{1,2}([A-Z]{3,4})?$/)) {
            return Promise.reject(new Error('The "TimeZone" property must be a string representing a time zone which is defined in POSIX 1003.1.'));
        }
        let soapBody = '';
		soapBody += '<tds:SetSystemDateAndTime>';
		soapBody += '<tds:DateTimeType>' + params.DateTimeType + '</tds:DateTimeType>';
		soapBody += '<tds:DaylightSavings>' + params.DaylightSavings + '</tds:DaylightSavings>';
		if(params.TimeZone) {
			soapBody += '<tds:TimeZone>';
			soapBody +=   '<tt:TZ>' + params.TimeZone + '</tt:TZ>';
			soapBody += '</tds:TimeZone>';
		}
		if(params.UTCDateTime) {
			const dt = params.UTCDateTime;
			soapBody += '<tds:UTCDateTime>';
			soapBody +=   '<tt:Time>';
			soapBody +=     '<tt:Hour>' + dt.getUTCHours() + '</tt:Hour>';
			soapBody +=     '<tt:Minute>' + dt.getUTCMinutes() + '</tt:Minute>';
			soapBody +=     '<tt:Second>' + dt.getUTCSeconds() + '</tt:Second>';
			soapBody +=   '</tt:Time>';
			soapBody +=   '<tt:Date>';
			soapBody +=     '<tt:Year>' + dt.getUTCFullYear() + '</tt:Year>';
			soapBody +=     '<tt:Month>' + (dt.getUTCMonth() + 1) + '</tt:Month>';
			soapBody +=     '<tt:Day>' + dt.getUTCDate() + '</tt:Day>';
			soapBody +=   '</tt:Date>';
			soapBody += '</tds:UTCDateTime>';
		}
        soapBody += '</tds:SetSystemDateAndTime>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetSystemDateAndTime', soap);
    }

    reboot(): Promise<Result> {
        const soapBody = '<tds:SytemReboot/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SystemReboot', soap);
    }

    getUsers(): Promise<Result> {
        const soapBody = '<tds:GetUsers/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetUsers', soap).then((result) => {
            const d = result.data?.GetUsersResponse?.User;
            if (d && !Array.isArray(d)) {
                result.data.GetUsersResponse.User = [d];
            }
            return result;
        });
    }

    createUser(params: CreateUserParams): Promise<Result> {
        let soapBody = '<tds:CreateUsers>';
        params.User.forEach((u) => {
            soapBody += '<tds:User>';
			soapBody += `<tt:Username>${u.Username}</tt:Username>`;
			soapBody += `<tt:Password>${u.Password}</tt:Password>`;
			soapBody += `<tt:UserLevel>${u.UserLevel}</tt:UserLevel>`;
			soapBody += '</tds:User>';
        });
        soapBody += '</tds:CreateUsers>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'CreateUsers', soap);
    }

    deleteUser(params: DeleteUserParams): Promise<Result> {
        let soapBody = '<tds:DeleteUsers>';
        params.User.forEach((u) => {
			soapBody += `<tds:Username>${u.Username}</tds:Username>`;
        });
        soapBody += '</tds:DeleteUsers>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'DeleteUsers', soap);
    }

    setUser(params: SetUserParams): Promise<Result> {
        let soapBody = '<tds:SetUser>';
        params.User.forEach((u) => {
            soapBody += '<tds:User>';
            soapBody += `<tt:Username>${u.Username}</tt:Username>`;
            if (u.Password) {
                soapBody += `<tt:Password>${u.Password}</tt:Password>`;
            }
            soapBody += `<tt:UserLevel>${u.UserLevel}<tt:UserLevel>`;
			soapBody += '</tds:User>';
        });
        soapBody += '</tds:SetUser>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetUser', soap);
    }

    getRelayOutputs(): Promise<Result> {
        const soapBody = '<tds:GetRelayOutputs/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetRelayOutputs', soap);
    }

    getNTP(): Promise<Result> {
        const soapBody = '<tds:GetNTP/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetNTP', soap);
    }

    setNTP(params: SetNTPParams): Promise<Result> {
        let soapBody = '<tds:SetNTP>';
        soapBody += `<tds:FromDHCP>${params.FromDHCP}</tds:FromDHCP>`;
        if (params.NTPManual) {
            const manual = params.NTPManual;
            soapBody += '<tds:NTPManual>';
            soapBody += `<tt:Type>${manual.Type}</tt:Type>`;
            if (manual.Type === 'IPv4') {
                soapBody += `<tt:IPv4Address>${manual.IPv4Address}</tt:IPv4Address>`;
            } else if (manual.Type === 'IPv6') {
                soapBody += `<tt:IPv6Address>${manual.IPv6Address}</tt:IPv6Address>`;
            } else {
                soapBody += `<tt:DNS>${manual.DNS}</tt:DNS>`;
            }
            soapBody += '</tds:NTPManual>';
        }
        soapBody += '</tds:SetNTP>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetNTP', soap);
    }

    getDynamicDNS(): Promise<Result> {
        const soapBody = '<tds:GetDynamicDNS/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetDynamicDNS', soap);
    }

    getZeroConfiguration(): Promise<Result> {
        const soapBody = '<tds:GetZeroConfiguration/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetZeroConfiguration', soap);
    }

    getIPAddressFilter(): Promise<Result> {
        const soapBody = '<tds:GetIPAddressFilter/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetIPAddressFilter', soap);
    }

    setIPAddressFilter(params: SetIPAddressFilterParams): Promise<Result> {
        params.IPv4Address.forEach((e) => {
            if (!e.Address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                return Promise.reject(new Error('The "Address" property was invalid as a IPv4 address.'));
            }
        });

        let soapBody = '';
		soapBody += '<tds:SetIPAddressFilter>';
		soapBody += '<tds:IPAddressFilter>';
		soapBody += '<tt:Type>' + params.Type + '</tt:Type>';
		params.IPv4Address.forEach((o) => {
			soapBody += '<tt:IPv4Address>';
			soapBody += '<tt:Address>' + o.Address + '</tt:Address>';
			soapBody += '<tt:PrefixLength>' + o.PrefixLength + '</tt:PrefixLength>';
			soapBody += '</tt:IPv4Address>';
		});
		soapBody += '</tds:IPAddressFilter>';
		soapBody += '</tds:SetIPAddressFilter>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetIPAddressFilter', soap);
    }

    getServices(params: {IncludeCapability: boolean}): Promise<Result> {
        let soapBody = '';
		soapBody += '<tds:GetServices>';
		soapBody += '<tds:IncludeCapability>' + params.IncludeCapability + '</tds:IncludeCapability>';
		soapBody += '</tds:GetServices>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetServices', soap);
    }

    getServiceCapabilities(): Promise<Result> {
        const soapBody = '<tds:GetServiceCapabilities/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetServiceCapabilities', soap);
    }
}

export type IPAddress = {Type: 'IPv4', IPv4Address: string} | {Type: 'IPv6', IPv6Address: string};

export interface SetIPAddressFilterParams {
    Type: 'Allow' | 'Deny';
    IPv4Address: {Address: string, PrefixLength: number}[];
}

export interface SetNTPParams {
    FromDHCP: boolean;
    NTPManual?: IPAddress | {Type: 'DNS', DNS: string};
}
export interface SetUserParams {
    User: {Username: string, Password?: string, UserLevel: 'Administrator' | 'Operator' | 'User' | 'Anonymous' }[];
}

export interface DeleteUserParams {
    User: {Username: string}[];
}

export interface CreateUserParams {
    User: {Username: string, Password: string, UserLevel: 'Administrator' | 'Operator' | 'User' | 'Anonymous' }[];
}

export interface SetSystemDateAndTimeParams {
    DateTimeType: 'NTP' | 'Manual';
    DaylightSavings: boolean;
    TimeZone?: string;
    UTCDateTime?: Date;
}

export interface SetNetworkDefaultGatewayParams {
    NetworkGateway: ({IPv4Address?: string} | {IPv6Address?: string})[];
}

// Name is required. Enabled and Port are both optional but required at least one of them
export type NetworkProtocol = { Name: 'HTTP' | 'HTTPS' | 'RTSP' } & ({Enabled: boolean} | {Port: number});
export interface SetNetworkProtocolsParams {
    NetworkProtocols: NetworkProtocol[];
}

export interface SetDNSParams {
    FromDHCP?: boolean;
    SearchDomain?: string[];
    DNSManual?: IPAddress[];
}

function parseGetSystemDateAndTime(s: any) {
    const s2 = s.Body?.GetSystemDateAndTimeResponse?.SystemDateAndTime;
	if(!s2) {return null;}

	const type = s2.DateTimeType || '';
	let dst = null;
	if(s2.DaylightSavings) {
		dst = s2.DaylightSavings === 'true';
	}
	const tz = s2.TimeZone?.TZ || '';
	let date = null;
	if(s2.UTCDateTime) {
		const udt = s2.UTCDateTime;
		const t = udt.Time;
		const d = udt.Date;
		if(t && d && t.Hour && t.Minute && t.Second && d.Year && d.Month && d.Day) {
			date = new Date();
			date.setUTCFullYear(parseInt(d.Year, 10));
			date.setUTCMonth(parseInt(d.Month, 10) - 1);
			date.setUTCDate(parseInt(d.Day, 10));
			date.setUTCHours(parseInt(t.Hour, 10));
			date.setUTCMinutes(parseInt(t.Minute, 10));
			date.setUTCSeconds(parseInt(t.Second, 10));
		}
	}
	return { type, dst, tz, date };
}
