import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
import { Command, requestCommand } from './soap';

export class OnvifServiceMedia extends OnvifServiceBase {
    constructor(configs: OnvifServiceMediaConfigs) {
        const {xaddr, user, pass, timeDiff} = configs;
        super({xaddr, user, pass});

        this.timeDiff = timeDiff;
        this.namespaceAttrList = [
            'xmlns:wsa="http://www.w3.org/2005/08/addressing"',
            'xmlns:tev="http://www.onvif.org/ver10/events/wsdl"'
        ];
    }

    getStreamUri(params: GetStreamUriParams): Promise<Command> {
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

    getVideoEncoderConfigurations(): Promise<Command> {
        const soapBody = '<trt:GetVideoEncoderConfigurations />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoEncoderConfigurations', soap);
    }

    getVideoEncoderConfiguration(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetVideoEncoderConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetVideoEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoEncoderConfiguration', soap);
    }

    getCompatibleVideoEncoderConfigurations(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleVideoEncoderConfigurations>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetCompatibleVideoEncoderConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'CompatibleVideoEncoderConfigurations', soap);
    }

    getVideoEncoderConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetVideoEncoderConfigurationOptions>';
		if(params.ProfileToken) {
			soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		}
		if(params.ConfigurationToken) {
			soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		}
		soapBody += '</trt:GetVideoEncoderConfigurationOptions>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'VideoEncoderConfigurationOptions', soap);
    }

    getGuaranteedNumberOfVideoEncoderInstances(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetGuaranteedNumberOfVideoEncoderInstances>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetGuaranteedNumberOfVideoEncoderInstances>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GuaranteedNumberOfVideoEncoderInstances', soap);
    }

    getProfiles(): Promise<Command> {
        const soapBody = '<trt:GetProfiles />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetProfiles', soap);
    }

    getProfile(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetProfile>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetProfile>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetProfile', soap);
    }

    createProfile(params: CreateProfileParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:CreateProfile>';
        soapBody +=   '<trt:Name>' + params.Name + '</trt:Name>';
		if(params.Token) {
			soapBody +=   '<trt:Token>' + params.Token + '</trt:Token>';
		}
		soapBody += '</trt:CreateProfile>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'CreateProfile', soap);
    }

    deleteProfile(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:DeleteProfile>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:DeleteProfile>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'DeleteProfile', soap);
    }

    getVideoSources(): Promise<Command> {
        const soapBody = '<trt:GetVideoSources />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSources', soap);
    }

    getVideoSourceConfiguration(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetVideoSourceConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetVideoSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSourceConfiguration', soap);
    }


    getVideoSourceConfigurations(): Promise<Command> {
        const soapBody = '<trt:GetVideoSourceConfigurations />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetVideoSourceConfigurations', soap);
    }

    addVideoSourceConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:AddVideoSourceConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddVideoSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddVideoSourceConfiguration', soap);
    }

    getCompatibleVideoSourceConfigurations(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleVideoSourceConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleVideoSourceConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleVideoSourceConfigurations', soap);
    }

    getVideoSourceConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Command> {
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

    getMetadataConfiguration(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetMetadataConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetMetadataConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetMetadataConfiguration', soap);
    }

    getMetadataConfigurations(): Promise<Command> {
        const soapBody = '<trt:GetMetadataConfigurations />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetMetadataConfigurations', soap);
    }

    addMetadataConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:AddMetadataConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddMetadataConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddMetadataConfiguration', soap);
    }

    getCompatibleMetadataConfigurations(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleMetadataConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleMetadataConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleMetadataConfigurations', soap);
    }

    getMetadataConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Command> {
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

    getAudioSources(): Promise<Command> {
        const soapBody = '<trt:GetAudioSources />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSources', soap);
    }

    getAudioSourceConfiguration(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetAudioSourceConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetAudioSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSourceConfiguration', soap);
    }

    getAudioSourceConfigurations(): Promise<Command> {
        const soapBody = '<trt:GetAudioSourceConfigurations />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioSourceConfigurations', soap);
    }

    addAudioSourceConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:AddAudioSourceConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddAudioSourceConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddAudioSourceConfiguration', soap);
    }

    getCompatibleAudioSourceConfigurations(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleAudioSourceConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleAudioSourceConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleAudioSourceConfigurations', soap);
    }

    getAudioSourceConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Command> {
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

    getAudioEncoderConfiguration(params: ConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetAudioEncoderConfiguration>';
		soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:GetAudioEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioEncoderConfiguration', soap);
    }

    getAudioEncoderConfigurations(): Promise<Command> {
        const soapBody = '<trt:GetAudioEncoderConfigurations />';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetAudioEncoderConfigurations', soap);
    }

    addAudioEncoderConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:AddAudioEncoderConfiguration>';
        soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody +=   '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
		soapBody += '</trt:AddAudioEncoderConfiguration>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'AddAudioEncoderConfiguration', soap);
    }

    getCompatibleAudioEncoderConfigurations(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetCompatibleAudioEncoderConfigurations>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetCompatibleAudioEncoderConfigurations>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetCompatibleAudioEncoderConfigurations', soap);
    }

    getAudioEncoderConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Command> {
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

    startMulticastStreaming(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:StartMulticastStreaming>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:StartMulticastStreaming>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'StartMulticastStreaming', soap);
    }

    stopMulticastStreaming(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:StopMulticastStreaming>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:StopMulticastStreaming>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'StopMulticastStreaming', soap);
    }

    GetSnapshotUri(params: ProfileTokenParams): Promise<Command> {
        let soapBody = '';
		soapBody += '<trt:GetSnapshotUri>';
		soapBody +=   '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
		soapBody += '</trt:GetSnapshotUri>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetSnapshotUri', soap);
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