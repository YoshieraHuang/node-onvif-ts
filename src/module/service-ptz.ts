import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
import { Result, requestCommand } from './soap';
import { ConfigurationTokenParams, ProfileTokenParams } from './service-media';

export class OnvifServicePtz extends OnvifServiceBase {
    constructor(configs: OnvifServicePtzConfigs) {
        const {xaddr, user, pass, timeDiff} = configs;
        super({xaddr, user, pass});

        this.timeDiff = timeDiff;
        this.namespaceAttrList = [
            'xmlns:ter="http://www.onvif.org/ver10/error"',
            'xmlns:xs="http://www.w3.org/2001/XMLSchema"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"',
            'xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl"'
        ];
    }

    getNodes(): Promise<Result> {
        const soapBody = '<tptz:GetNodes />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetNodes', soap).then((result) => {
            const d = result.data?.GetNodesResponse?.PTZNode;
            if (d && !Array.isArray(d)) {
                result.data.GetNodesResponse.PTZNode = [d];
            }
            return result;
        });
    }

    getNode(params: NodeTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GetNode>';
		soapBody +=   '<tptz:NodeToken>' + params.NodeToken + '</tptz:NodeToken>';
		soapBody += '</tptz:GetNode>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetNode', soap);
    }

    getConfigurations(): Promise<Result> {
        const soapBody = '<tptz:GetConfigurations />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetConfigurations', soap).then((result) => {
            const d = result.data?.GetConfigurationsResponse?.PTZConfiguration;
            if (d && !Array.isArray(d)) {
                result.data.GetConfigurationsResponse.PTZConfiguration = [d];
            }
            return result;
        });
    }

    getConfiguration(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GetConfiguration>';
		soapBody +=   '<tptz:PTZConfigurationToken>' + params.ConfigurationToken + '</tptz:PTZConfigurationToken>';
		soapBody += '</tptz:GetConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetConfiguration', soap);
    }

    getCompatibleConfigurations(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GetCompatibleConfigurations>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		soapBody += '</tptz:GetCompatibleConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleConfigurations', soap);
    }

    getConfigurationOptions(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GetConfigurationOptions>';
		soapBody +=   '<tptz:ConfigurationToken>' + params.ConfigurationToken + '</tptz:ConfigurationToken>';
		soapBody += '</tptz:GetConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetConfigurationOptions', soap);
    }

    setConfiguration(params: SetPTZConfigurationParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<tptz:SetConfiguration>';
        soapBody += '<tptz:PTZConfiguration token = "' + params.ConfigurationToken + '"';
        if (typeof params.MoveRamp === 'number')
            soapBody += ' MoveRamp = "' + params.MoveRamp + '"';
        if (typeof params.PresetRamp === 'number')
            soapBody += ' PresetRamp = "' + params.PresetRamp + '"';
        if (typeof params.PresetTourRamp === 'number')
            soapBody += ' PresetTourRamp = "' + params.PresetTourRamp + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:NodeToken>' + params.NodeToken + '</tt:NodeToken>';
        if (params.DefaultAbsolutePantTiltPositionSpace)
            soapBody += '<tt:DefaultAbsolutePantTiltPositionSpace>' + params.DefaultAbsolutePantTiltPositionSpace + '</tt:DefaultAbsolutePantTiltPositionSpace>';
        if (params.DefaultAbsoluteZoomPositionSpace)
            soapBody += '<tt:DefaultAbsoluteZoomPositionSpace>' + params.DefaultAbsoluteZoomPositionSpace + '</tt:DefaultAbsoluteZoomPositionSpace>';
        if (params.DefaultRelativePanTiltTranslationSpace)
            soapBody += '<tt:DefaultRelativePanTiltTranslationSpace>' + params.DefaultRelativePanTiltTranslationSpace + '</tt:DefaultRelativePanTiltTranslationSpace>';
        if (params.DefaultRelativeZoomTranslationSpace)
            soapBody += '<tt:DefaultRelativeZoomTranslationSpace>' + params.DefaultRelativeZoomTranslationSpace + '</tt:DefaultRelativeZoomTranslationSpace>';
        if (params.DefaultContinuousPanTiltVelocitySpace)
            soapBody += '<tt:DefaultContinuousPanTiltVelocitySpace>' + params.DefaultContinuousPanTiltVelocitySpace + '</tt:DefaultContinuousPanTiltVelocitySpace>';
        if (params.DefaultContinuousZoomVelocitySpace)
            soapBody += '<tt:DefaultContinuousZoomVelocitySpace>' + params.DefaultContinuousZoomVelocitySpace + '</tt:DefaultContinuousZoomVelocitySpace>';
        if (params.DefaultPTZSpeed) {
            soapBody += '<tt:DefaultPTZSpeed>'
            if (params.DefaultPTZSpeed.PanTilt) {
                soapBody += '<tt:PanTilt';
                if (params.DefaultPTZSpeed.PanTilt.space) {
                    soapBody += ' space = "' + params.DefaultPTZSpeed.PanTilt.space + '"';
                }
                soapBody += ' x = "' + params.DefaultPTZSpeed.PanTilt.x + '"';
                soapBody += ' y = "' + params.DefaultPTZSpeed.PanTilt.y + '"';
                soapBody += '></tt:PanTilt>';
            }
            if (params.DefaultPTZSpeed.Zoom) {
                soapBody += '<tt:Zoom';
                if (params.DefaultPTZSpeed.Zoom.space) {
                    soapBody += ' space = "' + params.DefaultPTZSpeed.Zoom.space + '"';
                }
                soapBody += ' x = "' + params.DefaultPTZSpeed.Zoom.x + '"';
                soapBody += '></tt:Zoom>';
            }
            soapBody += '</tt:DefaultPTZSpeed>'
        }
        if (params.DefaultPTZTimeout)
            soapBody += '<tt:DefaultPTZTimeout>' + params.DefaultPTZTimeout + '</tt:DefaultPTZTimeout>';
        if (params.PanTiltLimits) {
            soapBody += '<tt:PanTiltLimits>'
            soapBody += '<tt:Range>'
            soapBody += '<tt:URI>' + params.PanTiltLimits.Range.URI + '</tt:URI>';
            soapBody += '<tt:XRange>'
            soapBody += '<tt:Min>' + (typeof params.PanTiltLimits.Range.XRange.Min === 'number' ? params.PanTiltLimits.Range.XRange.Min : '-INF') + '</tt:Min>';
            soapBody += '<tt:Max>' + (typeof params.PanTiltLimits.Range.XRange.Max === 'number' ? params.PanTiltLimits.Range.XRange.Max : '+INF') + '</tt:Max>';
            soapBody += '</tt:XRange>'
            soapBody += '<tt:YRange>'
            soapBody += '<tt:Min>' + (typeof params.PanTiltLimits.Range.YRange.Min === 'number' ? params.PanTiltLimits.Range.YRange.Min : '-INF') + '</tt:Min>';
            soapBody += '<tt:Max>' + (typeof params.PanTiltLimits.Range.YRange.Max === 'number' ? params.PanTiltLimits.Range.YRange.Max : '+INF') + '</tt:Max>';
            soapBody += '</tt:YRange>'
            soapBody += '</tt:Range>'
            soapBody += '</tt:PanTiltLimits>'
        }
        if (params.ZoomLimits) {
            soapBody += '<tt:ZoomLimits>'
            soapBody += '<tt:Range>'
            soapBody += '<tt:URI>' + params.ZoomLimits.Range.URI + '</tt:URI>';
            soapBody += '<tt:XRange>'
            soapBody += '<tt:Min>' + (typeof params.ZoomLimits.Range.XRange.Min === 'number' ? params.ZoomLimits.Range.XRange.Min : '-INF') + '</tt:Min>';
            soapBody += '<tt:Max>' + (typeof params.ZoomLimits.Range.XRange.Max === 'number' ? params.ZoomLimits.Range.XRange.Max : '+INF') + '</tt:Max>';
            soapBody += '</tt:XRange>'
            soapBody += '</tt:Range>'
            soapBody += '</tt:ZoomLimits>'
        }
        if (params.Extension) {
            soapBody += '<tt:Extension>'
            if (params.Extension.PTControlDirection) {
                soapBody += '<tt:PTControlDirection>'
                if (params.Extension.PTControlDirection.EFlip) {
                    soapBody += '<tt:EFlip>'
                    soapBody += '<tt:Mode>' + params.Extension.PTControlDirection.EFlip.Mode + '</tt:Mode>';
                    soapBody += '</tt:EFlip>'
                }
                if (params.Extension.PTControlDirection.Reverse) {
                    soapBody += '<tt:Reverse>'
                    soapBody += '<tt:Mode>' + params.Extension.PTControlDirection.Reverse.Mode + '</tt:Mode>';
                    soapBody += '</tt:Reverse>'
                }
                soapBody += '</tt:PTControlDirection>'
            }
            soapBody += '</tt:Extension>'
        }
        soapBody += '</tptz:PTZConfiguration>';
        soapBody += '<tptz:ForcePersistence>true</tptz:ForcePersistence>';
        soapBody += '</tptz:SetConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetConfiguration', soap);
    }

    getStatus(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<tptz:GetStatus>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:GetStatus>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetStatus', soap);
    }

    continuousMove(params: ContinuousMoveParams) {
        let soapBody = '';
		soapBody += '<tptz:ContinuousMove>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		soapBody +=   '<tptz:Velocity>';
		if(params.Velocity.x && params.Velocity.y) {
      soapBody +=     '<tt:PanTilt x="' + params.Velocity.x + '" y="' + params.Velocity.y + '"></tt:PanTilt>';
    }
		if(params.Velocity.z) {
			soapBody +=     '<tt:Zoom x="' + params.Velocity.z + '"></tt:Zoom>';
		}
		soapBody +=   '</tptz:Velocity>';
		if(params.Timeout) {
			soapBody += '<tptz:Timeout>PT' + params.Timeout + 'S</tptz:Timeout>';
		}
		soapBody += '</tptz:ContinuousMove>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'ContinuousMove', soap);
    }

    absoluteMove(params: AbsoluteMoveParams) {
        let soapBody = '';
		soapBody += '<tptz:AbsoluteMove>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';

		soapBody +=   '<tptz:Position>';
		soapBody +=     '<tt:PanTilt x="' + params.Position.x + '" y="' + params.Position.y + '" />';
		soapBody +=     '<tt:Zoom x="' + params.Position.z + '"/>';
		soapBody +=   '</tptz:Position>';

		if(params.Speed) {
			soapBody +=   '<tptz:Speed>';
      if (params.Speed.x && params.Speed.y) {
        soapBody +=     '<tt:PanTilt x="' + params.Speed.x + '" y="' + params.Speed.y + '" />';
      }
      if (params.Speed.z) {
        soapBody +=     '<tt:Zoom x="' + params.Speed.z + '"/>';
      }
			soapBody +=   '</tptz:Speed>';
		}

        soapBody += '</tptz:AbsoluteMove>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AbsoluteMove', soap);
    }

    relativeMove(params: RelativeMoveParams) {
        let soapBody = '';
		soapBody += '<tptz:RelativeMove>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';

		soapBody +=   '<tptz:Translation>';
		soapBody +=     '<tt:PanTilt x="' + params.Translation.x + '" y="' + params.Translation.y + '" />';
		soapBody +=     '<tt:Zoom x="' + params.Translation.z + '"/>';
		soapBody +=   '</tptz:Translation>';

		if(params.Speed) {
			soapBody +=   '<tptz:Speed>';
      if (params.Speed.x && params.Speed.y) {
        soapBody +=     '<tt:PanTilt x="' + params.Speed.x + '" y="' + params.Speed.y + '" />';
      }
      if (params.Speed.z) {
        soapBody +=     '<tt:Zoom x="' + params.Speed.z + '"/>';
      }
			soapBody +=   '</tptz:Speed>';
		}

        soapBody += '</tptz:RelativeMove>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RelativeMove', soap);
    }

    stop(params: StopParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:Stop>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		if(params.PanTilt) {
			soapBody += '<tptz:PanTilt>' + params.PanTilt + '</tptz:PanTilt>';
		}
		if(params.Zoom) {
			soapBody += '<tptz:Zoom>' + params.Zoom + '</tptz:Zoom>';
		}
        soapBody += '</tptz:Stop>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'Stop', soap);
    }

    gotoHomePosition(params: GotoHomePositionParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GotoHomePosition>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		if(params.Speed) {
			soapBody += '<tptz:Speed>' + params.Speed + '</tptz:Speed>';
		}
        soapBody += '</tptz:GotoHomePosition>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GotoHomePosition', soap);
    }

    setHomePosition(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:SetHomePosition>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:SetHomePosition>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetHomePosition', soap);
    }

    setPreset(params: SetPresetParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:SetPreset>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		if('PresetToken' in params) {
			soapBody += '<tptz:PresetToken>' + params.PresetToken + '</tptz:PresetToken>';
		}
		if('PresetName' in params) {
			soapBody +=   '<tptz:PresetName>' + params.PresetName + '</tptz:PresetName>';
		}
        soapBody += '</tptz:SetPreset>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetPreset', soap);
    }

    getPresets(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GetPresets>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:GetPresets>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetPresets', soap);
    }

    gotoPreset(params: GotoPresetParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:GotoPreset>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		soapBody +=   '<tptz:PresetToken>' + params.PresetToken + '</tptz:PresetToken>';
		if(params.Speed) {
			soapBody +=   '<tptz:Speed>';
      if (params.Speed.x && params.Speed.y) {
        soapBody +=     '<tt:PanTilt x="' + params.Speed.x + '" y="' + params.Speed.y + '" />';
      }
      if (params.Speed.z) {
        soapBody +=     '<tt:Zoom x="' + params.Speed.z + '"/>';
      }
			soapBody +=   '</tptz:Speed>';
		}
        soapBody += '</tptz:GotoPreset>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GotoPreset', soap);
    }

    removePreset(params: RemovePresetParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<tptz:RemovePreset>';
		soapBody +=   '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
		soapBody +=   '<tptz:PresetToken>' + params.PresetToken + '</tptz:PresetToken>';
        soapBody += '</tptz:RemovePreset>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemovePreset', soap);
    }
}

export interface OnvifServicePtzConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}

export interface NodeTokenParams {
    NodeToken: string;
}

export interface ContinuousMoveParams {
    ProfileToken: string;
    Velocity: {x?: number, y?: number, z?: number}
    Timeout?: number;
}

export interface AbsoluteMoveParams {
    ProfileToken: string;
    Position: {x: number, y: number, z: number}
    Speed?: {x?: number, y?: number, z?: number}
}

export interface RelativeMoveParams {
    ProfileToken: string;
    Translation: {x: number, y: number, z: number}
    Speed?: {x?: number, y?: number, z?: number}
}

export interface StopParams {
    ProfileToken: string;
    PanTilt?: boolean;
    Zoom?: boolean;
}

export interface GotoHomePositionParams {
    ProfileToken: string;
    Speed?: number;
}

export type SetPresetParams = { ProfileToken: string } & (
    { PresetToken: string} | { PresetName: string}
);

export interface GotoPresetParams {
    ProfileToken: string;
    PresetToken: string;
    Speed?: {x: number, y: number, z: number}
}

export interface RemovePresetParams {
    ProfileToken: string;
    PresetToken: string;
}

export type SetPTZConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    MoveRamp?: number;
    PresetRamp?: number;
    PresetTourRamp?: number;
    NodeToken: string;
    DefaultAbsolutePantTiltPositionSpace?: string;
    DefaultAbsoluteZoomPositionSpace?: string;
    DefaultRelativePanTiltTranslationSpace?: string;
    DefaultRelativeZoomTranslationSpace?: string;
    DefaultContinuousPanTiltVelocitySpace?: string;
    DefaultContinuousZoomVelocitySpace?: string;
    DefaultPTZSpeed?: {
      PanTilt?: {
        space?: string;
        x: number;
        y: number;
      }
      Zoom?: {
        x: number;
        space?: string;
      }
    }
    DefaultPTZTimeout?: string;
    PanTiltLimits?: {
      Range: {
        URI: string;
        XRange: {
          Min?: number;
          Max?: number;
        }
        YRange: {
          Min?: number;
          Max?: number;
        }
      }
    }
    ZoomLimits?: {
      Range: {
        URI: string;
        XRange: {
          Min?: number;
          Max?: number;
        }
      }
    }
    Extension?: {
      PTControlDirection?: {
        EFlip?: {
          Mode: 'OFF' | 'ON' | 'Extended'
        }
        Reverse?: {
          Mode: 'OFF' | 'ON' | 'AUTO' | 'Extended'
        }
      }
    }
}
