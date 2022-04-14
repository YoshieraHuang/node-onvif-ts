import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
import { Result, requestCommand } from './soap';

export class OnvifServiceMedia extends OnvifServiceBase {
    constructor(configs: OnvifServiceMediaConfigs) {
        const {xaddr, user, pass, timeDiff} = configs;
        super({xaddr, user, pass});

        this.timeDiff = timeDiff;
        this.namespaceAttrList = [
            'xmlns:trt="http://www.onvif.org/ver10/media/wsdl"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"'
        ];
    }

    getStreamUri(params: GetStreamUriParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetStreamUri>';
		soapBody +=   '<trt:StreamSetup>';
		soapBody +=     '<tt:Stream>RTP-Unicast</tt:Stream>';
		soapBody +=     '<tt:Transport>';
		soapBody +=       '<tt:Protocol>' + params.Protocol + '</tt:Protocol>';
		soapBody +=     '</tt:Transport>';
		soapBody +=   '</trt:StreamSetup>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetStreamUri>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetStreamUri', soap);
    }

    getVideoEncoderConfigurations(): Promise<Result> {
        const soapBody = '<trt:GetVideoEncoderConfigurations/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoEncoderConfigurations', soap);
    }

    getVideoEncoderConfiguration(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetVideoEncoderConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetVideoEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoEncoderConfiguration', soap);
    }

    addVideoEncoderConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:AddVideoEncoderConfiguration>';
		soapBody +=   '<trt:ProfileToken>' + params['ProfileToken'] + '</trt:ProfileToken>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddVideoEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddVideoEncoderConfiguration', soap);
    }
  
    getCompatibleVideoEncoderConfigurations(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleVideoEncoderConfigurations>';
    soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleVideoEncoderConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleVideoEncoderConfigurations', soap);
    }

    getVideoEncoderConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetVideoEncoderConfigurationOptions>';
		if (params.ProfileToken) {
			soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		}
		if (params.ConfigurationToken) {
			soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		}
		soapBody += '</trt:GetVideoEncoderConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoEncoderConfigurationOptions', soap);
    }

    removeVideoEncoderConfiguration(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:RemoveVideoEncoderConfiguration>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:RemoveVideoEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemoveVideoEncoderConfiguration', soap);
    }

    setVideoEncoderConfiguration(params: SetVideoEncoderConfigurationParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<trt:SetVideoEncoderConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += ' GuaranteedFrameRate = "false">';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:Encoding>' + params.Encoding + '</tt:Encoding>';
        soapBody += '<tt:Resolution>';
        soapBody += '<tt:Width>' + params.Resolution.Width + '</tt:Width>';
        soapBody += '<tt:Height>' + params.Resolution.Height + '</tt:Height>';
        soapBody += '</tt:Resolution>';
        soapBody += '<tt:Quality>' + params.Quality + '</tt:Quality>';
        if (params.RateControl) {
          soapBody += '<tt:RateControl>';
          soapBody += '<tt:FrameRateLimit>' + params.RateControl.FrameRateLimit + '</tt:FrameRateLimit>';
          soapBody += '<tt:EncodingInterval>' + params.RateControl.EncodingInterval + '</tt:EncodingInterval>';
          soapBody += '<tt:BitrateLimit>' + params.RateControl.BitrateLimit + '</tt:BitrateLimit>';
          soapBody += '</tt:RateControl>';
        }
        if ('MPEG4' in params) {
            soapBody += '<tt:MPEG4>';
            soapBody += '<tt:GovLength>' + params.MPEG4.GovLength + '</tt:GovLength>';
            soapBody += '<tt:Mpeg4Profile>';
            soapBody += params.MPEG4.Mpeg4Profile;
            soapBody += '</tt:Mpeg4Profile>';
            soapBody += '</tt:MPEG4>';
        }
        if ('H264' in params) {
            soapBody += '<tt:H264>';
            soapBody += '<tt:GovLength>' + params.H264.GovLength + '</tt:GovLength>';
            soapBody += '<tt:H264Profile>';
            soapBody += params.H264.H264Profile;
            soapBody += '</tt:H264Profile>';
            soapBody += '</tt:H264>';
        }
        soapBody += '<tt:Multicast>';
        soapBody += '<tt:Address>';
        soapBody += '<tt:Type>IPv4</tt:Type>';
        soapBody += '<tt:IPv4Address>0.0.0.0</tt:IPv4Address>';
        soapBody += '<tt:IPv6Address></tt:IPv6Address>';
        soapBody += '</tt:Address>';
        soapBody += '<tt:Port>0</tt:Port>';
        soapBody += '<tt:TTL>5</tt:TTL>';
        soapBody += '<tt:AutoStart>false</tt:AutoStart>';
        soapBody += '</tt:Multicast>';
        soapBody += '<tt:SessionTimeout>PT60S</tt:SessionTimeout>';
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetVideoEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetVideoEncoderConfiguration', soap);
    }

    getGuaranteedNumberOfVideoEncoderInstances(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetGuaranteedNumberOfVideoEncoderInstances>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetGuaranteedNumberOfVideoEncoderInstances>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetGuaranteedNumberOfVideoEncoderInstances', soap);
    }

    getProfiles(): Promise<Result> {
        const soapBody = '<trt:GetProfiles/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetProfiles', soap);
    }

    getProfile(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetProfile>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetProfile>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetProfile', soap);
    }

    createProfile(params: CreateProfileParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:CreateProfile>';
        soapBody +=   '<trt:Name>' + params.Name + '</trt:Name>';
		if (params.Token) {
			soapBody +=   '<trt:Token>' + params.Token + '</trt:Token>';
		}
		soapBody += '</trt:CreateProfile>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'CreateProfile', soap);
    }

    deleteProfile(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:DeleteProfile>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:DeleteProfile>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'DeleteProfile', soap);
    }

    getVideoSources(): Promise<Result> {
        const soapBody = '<trt:GetVideoSources/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSources', soap);
    }

    getVideoSourceConfiguration(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetVideoSourceConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetVideoSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSourceConfiguration', soap);
    }


    getVideoSourceConfigurations(): Promise<Result> {
        const soapBody = '<trt:GetVideoSourceConfigurations/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSourceConfigurations', soap);
    }

    addVideoSourceConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:AddVideoSourceConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddVideoSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddVideoSourceConfiguration', soap);
    }

    getCompatibleVideoSourceConfigurations(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleVideoSourceConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleVideoSourceConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleVideoSourceConfigurations', soap);
    }

    getVideoSourceConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<trt:GetVideoSourceConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
        soapBody += '</trt:GetVideoSourceConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSourceConfigurationOptions', soap);
    }

    removeVideoSourceConfiguration(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:RemoveVideoSourceConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:RemoveVideoSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemoveVideoSourceConfiguration', soap);
    }

    setVideoSourceConfiguration(params: SetVideoSourceConfigurationParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<trt:SetVideoSourceConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:SourceToken>' + params.SourceToken + '</tt:SourceToken>';
        soapBody += '<tt:Bounds';
        soapBody += ' x = "' + params.Bounds.x + '"';
        soapBody += ' y = "' + params.Bounds.y + '"';
        soapBody += ' width = "' + params.Bounds.width + '"';
        soapBody += ' height = "' + params.Bounds.height + '"';
        soapBody += '></tt:Bounds>';
        if (params.Extension) {
            soapBody += '<tt:Extension>';
            if (params.Extension.Rotate) {
                soapBody += '<tt:Rotate>';
                soapBody += '<tt:Mode>' + params.Extension.Rotate.Mode + '</tt:Mode>';
                if (typeof params.Extension.Rotate.Degree === 'number') {
                    soapBody += '<tt:Degree>' + params.Extension.Rotate.Degree + '</tt:Degree>';
                }
                soapBody += '</tt:Rotate>';
            }
            if (params.Extension.Extension) {
                soapBody += '<tt:Extension>';
                if (params.Extension.Extension.LensDescription) {
                    soapBody += '<tt:LensDescription';
                    if (typeof params.Extension.Extension.LensDescription.FocalLength === 'number')
                        soapBody += ' FocalLength = "' + params.Extension.Extension.LensDescription.FocalLength + '"';
                    soapBody += '>';
                    soapBody += '<tt:Offset';
                    if (typeof params.Extension.Extension.LensDescription.Offset.x === 'number')
                        soapBody += ' x = "' + params.Extension.Extension.LensDescription.Offset.x + '"';
                    if (typeof params.Extension.Extension.LensDescription.Offset.y === 'number')
                        soapBody += ' y = "' + params.Extension.Extension.LensDescription.Offset.y + '"';
                    soapBody += '></tt:Offset>';
                    soapBody += '<tt:Projection>';
                    soapBody += '<tt:Angle>' + params.Extension.Extension.LensDescription.Projection.Angle + '</tt:Angle>';
                    soapBody += '<tt:Radius>' + params.Extension.Extension.LensDescription.Projection.Radius + '</tt:Radius>';
                    if (typeof params.Extension.Extension.LensDescription.Projection.Transmittance === 'number') {
                        soapBody += '<tt:Transmittance>' + params.Extension.Extension.LensDescription.Projection.Transmittance + '</tt:Transmittance>';
                    }
                    soapBody += '</tt:Projection>';
                    soapBody += '<tt:XFactor>' + params.Extension.Extension.LensDescription.XFactor + '</tt:XFactor>';
                    soapBody += '</tt:LensDescription>';
                }
                if (params.Extension.Extension.SceneOrientation) {
                    soapBody += '<tt:SceneOrientation>';
                    soapBody += '<tt:Mode>' + params.Extension.Extension.SceneOrientation.Mode + '</tt:Mode>';
                    if (params.Extension.Extension.SceneOrientation.Orientation) {
                        soapBody += '<tt:Orientation>' + params.Extension.Extension.SceneOrientation.Orientation + '</tt:Orientation>';
                    }
                    soapBody += '</tt:SceneOrientation>';
                }
                soapBody += '</tt:Extension>';
            }
            soapBody += '</tt:Extension>';
        }
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetVideoSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetVideoSourceConfiguration', soap);
    }

    getMetadataConfiguration(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetMetadataConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetMetadataConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetMetadataConfiguration', soap);
    }

    getMetadataConfigurations(): Promise<Result> {
        const soapBody = '<trt:GetMetadataConfigurations/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetMetadataConfigurations', soap);
    }

    addMetadataConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:AddMetadataConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddMetadataConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddMetadataConfiguration', soap);
    }

    getCompatibleMetadataConfigurations(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleMetadataConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleMetadataConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleMetadataConfigurations', soap);
    }

    getMetadataConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetMetadataConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
		soapBody += '</trt:GetMetadataConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetMetadataConfigurationOptions', soap);
    }

    removeMetadataConfiguration(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:RemoveMetadataConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:RemoveMetadataConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemoveMetadataConfiguration', soap);
    }

    setMetadataConfiguration(params: SetMetadataConfigurationParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<trt:SetMetadataConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        if (params.CompressionType)
            soapBody += ' CompressionType = "' + params.CompressionType + '"';
        if (typeof params.GeoLocation === 'boolean')
            soapBody += ' GeoLocation = "' + params.GeoLocation + '"';
        if (typeof params.ShapePolygon === 'boolean')
            soapBody += ' ShapePolygon = "' + params.ShapePolygon + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        if (params.PTZStatus) {
            soapBody += '<tt:PTZStatus>';
            soapBody += '<tt:Status>' + params.PTZStatus.Status + '</tt:Status>';
            soapBody += '<tt:Position>' + params.PTZStatus.Position + '</tt:Position>';
            soapBody += '</tt:PTZStatus>';
        }
        if (typeof params.Analytics === 'boolean')
            soapBody += '<tt:Analytics>' + params.Analytics + '</tt:Analytics>';
        soapBody += '<tt:Multicast>';
        soapBody += '<tt:Address>';
        soapBody += '<tt:Type>IPv4</tt:Type>';
        soapBody += '<tt:IPv4Address>0.0.0.0</tt:IPv4Address>';
        soapBody += '<tt:IPv6Address></tt:IPv6Address>';
        soapBody += '</tt:Address>';
        soapBody += '<tt:Port>0</tt:Port>';
        soapBody += '<tt:TTL>5</tt:TTL>';
        soapBody += '<tt:AutoStart>false</tt:AutoStart>';
        soapBody += '</tt:Multicast>';
        soapBody += '<tt:SessionTimeout>PT60S</tt:SessionTimeout>';
        if (params.AnalyticsEngineConfiguration) {
            soapBody += '<tt:AnalyticsEngineConfiguration>';
            if (params.AnalyticsEngineConfiguration.AnalyticsModule) {
                soapBody += '<tt:AnalyticsModule>';
                params.AnalyticsEngineConfiguration.AnalyticsModule.forEach(o => {
                    soapBody += '<tt:Name>' + o.Name + '</tt:Name>';
                    soapBody += '<tt:Type>' + o.Type + '</tt:Type>';
                    soapBody += '<tt:Parameters>';
                    o.Parameters.SimpleItem.forEach(si => {
                        soapBody += '<tt:SimpleItem Name = "' + si.Name + '"';
                        soapBody += ' Value = "' + si.Value + '"';
                        soapBody += '></tt:SimpleItem>';
                    });
                    o.Parameters.ElementItem.forEach(ei => {
                        soapBody += '<tt:ElementItem Name = "' + ei.Name + '"';
                        soapBody += '></tt:ElementItem>';
                    });
                    soapBody += '</tt:Parameters>';
                });
                soapBody += '</tt:AnalyticsModule>';
            }
            soapBody += '</tt:AnalyticsEngineConfiguration>';
        }
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetMetadataConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetMetadataConfiguration', soap);
    }

    getAudioSources(): Promise<Result> {
        const soapBody = '<trt:GetAudioSources/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSources', soap);
    }

    getAudioSourceConfiguration(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetAudioSourceConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetAudioSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSourceConfiguration', soap);
    }

    getAudioSourceConfigurations(): Promise<Result> {
        const soapBody = '<trt:GetAudioSourceConfigurations/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSourceConfigurations', soap);
    }

    addAudioSourceConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:AddAudioSourceConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddAudioSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddAudioSourceConfiguration', soap);
    }

    getCompatibleAudioSourceConfigurations(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleAudioSourceConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleAudioSourceConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleAudioSourceConfigurations', soap);
    }

    getAudioSourceConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetAudioSourceConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
		soapBody += '</trt:GetAudioSourceConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSourceConfigurationOptions', soap);
    }

    removeAudioSourceConfiguration(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:RemoveAudioSourceConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:RemoveAudioSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemoveAudioSourceConfiguration', soap);
    }

    setAudioSourceConfiguration(params: SetAudioSourceConfigurationParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<trt:SetAudioSourceConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:SourceToken>' + params.SourceToken + '</tt:SourceToken>';
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetAudioSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetAudioSourceConfiguration', soap);
    }

    getAudioEncoderConfiguration(params: ConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetAudioEncoderConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetAudioEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioEncoderConfiguration', soap);
    }

    getAudioEncoderConfigurations(): Promise<Result> {
        const soapBody = '<trt:GetAudioEncoderConfigurations/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioEncoderConfigurations', soap);
    }

    addAudioEncoderConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:AddAudioEncoderConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddAudioEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddAudioEncoderConfiguration', soap);
    }

    getCompatibleAudioEncoderConfigurations(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleAudioEncoderConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleAudioEncoderConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleAudioEncoderConfigurations', soap);
    }

    getAudioEncoderConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetAudioEncoderConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
		soapBody += '</trt:GetAudioEncoderConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioEncoderConfigurationOptions', soap);
    }

    removeAudioEncoderConfiguration(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:RemoveAudioEncoderConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:RemoveAudioEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemoveAudioEncoderConfiguration', soap);
    }

    setAudioEncoderConfiguration(params: SetAudioEncoderConfigurationParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<trt:SetAudioEncoderConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:Encoding>' + params.Encoding + '</tt:Encoding>';
        soapBody += '<tt:Bitrate>' + params.Bitrate + '</tt:Bitrate>';
        soapBody += '<tt:SampleRate>' + params.SampleRate + '</tt:SampleRate>';
        soapBody += '<tt:Multicast>';
        soapBody += '<tt:Address>';
        soapBody += '<tt:Type>IPv4</tt:Type>';
        soapBody += '<tt:IPv4Address>0.0.0.0</tt:IPv4Address>';
        soapBody += '<tt:IPv6Address></tt:IPv6Address>';
        soapBody += '</tt:Address>';
        soapBody += '<tt:Port>0</tt:Port>';
        soapBody += '<tt:TTL>5</tt:TTL>';
        soapBody += '<tt:AutoStart>false</tt:AutoStart>';
        soapBody += '</tt:Multicast>';
        soapBody += '<tt:SessionTimeout>PT60S</tt:SessionTimeout>';
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetAudioEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'SetAudioEncoderConfiguration', soap);
    }

    startMulticastStreaming(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:StartMulticastStreaming>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:StartMulticastStreaming>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'StartMulticastStreaming', soap);
    }

    stopMulticastStreaming(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:StopMulticastStreaming>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:StopMulticastStreaming>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'StopMulticastStreaming', soap);
    }

    getSnapshotUri(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:GetSnapshotUri>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetSnapshotUri>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetSnapshotUri', soap);
    }

    addPTZConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:AddPTZConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddPTZConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddPTZConfiguration', soap);
    }

    removePTZConfiguration(params: ProfileTokenParams): Promise<Result> {
        let soapBody = '';
		soapBody += '<trt:RemovePTZConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:RemovePTZConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'RemovePTZConfiguration', soap);
    }
}

export interface OnvifServiceMediaConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}

export interface ConfigurationTokenParams {
    ConfigurationToken: string;
}

export interface ProfileAndConfigurationTokenOptionalParams {
    ProfileToken?: string;
    ConfigurationToken?: string;
}

export interface GetStreamUriParams {
    ProfileToken: string;
    Protocol: 'UDP' | 'HTTP' | 'RTSP';
}

export interface ProfileTokenParams {
    ProfileToken: string;
}

export interface CreateProfileParams {
    Name: string;
    Token?: string;
}

export interface ProfileAndConfigurationTokenParams {
    ProfileToken: string;
    ConfigurationToken: string;
}

export type Config = {
    Name: string;
    Type: string;
    Parameters: {
      SimpleItem?: {
        Name: string;
        Value: number | boolean | string;
      }[];
      ElementItem?: {
        Name: string;
      }[];
      Position: boolean;
    }
}

export type SetVideoEncoderConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    Encoding: 'JPEG' | 'MPEG4' | 'H264';
    Resolution: {
      Width: number;
      Height: number;
    }
    Quality: number;
    RateControl?: {
      FrameRateLimit: number;
      EncodingInterval: number;
      BitrateLimit: number;
    }
} & (
  {
    MPEG4: {
      GovLength: number;
      Mpeg4Profile: 'SP' | 'ASP';
    }
  } | {
    H264: {
      GovLength: number;
      H264Profile: 'Baseline' | 'Main' | 'Extended' | 'High';
    }
  }
);

export interface SetVideoSourceConfigurationParams {
    ConfigurationToken: string;
    Name: string;
    ViewMode?: ViewModeEnumerator;
    SourceToken: string;
    Bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
    Extension?: {
      Rotate?: {
        Mode: 'OFF' | 'ON' | 'AUTO';
        Degree?: number;
      }
      Extension?: {
        LensDescription?: {
          FocalLength?: number;
          Offset: {
            x?: number;
            y?: number;
          }
          Projection: {
            Angle: number;
            Radius: number;
            Transmittance?: number;
          }
          XFactor: number;
        }
        SceneOrientation?: {
          Mode: 'MANUAL' | 'AUTO';
          Orientation?: string;
        }
      }
    }
}

export enum ViewModeEnumerator {
    Fisheye = 'Fisheye',
    Panorama360 = '360Panorama',
    Panorama180 = '180Panorama',
    Quad = 'Quad',
    Original = 'Original',
    LeftHalf = 'LeftHalf',
    RightHalf = 'RightHalf',
    Dewarp = 'Dewarp',
}

export type SetMetadataConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    CompressionType?: 'None' | 'GZIP' | 'EXI';
    GeoLocation?: boolean;
    ShapePolygon?: boolean;
    PTZStatus?: {
      Status: boolean;
      Position: boolean;
    }
    Analytics?: boolean;
    AnalyticsEngineConfiguration?: {
      AnalyticsModule?: Config[];
    }
}

export type SetAudioSourceConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    SourceToken: string;
}

export type SetAudioEncoderConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    Encoding: 'G711' | 'G726' | 'AAC';
    Bitrate: number;
    SampleRate: number;
}
