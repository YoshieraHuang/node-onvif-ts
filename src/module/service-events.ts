import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
import { requestCommand } from './soap';

export class OnvifServiceEvents extends OnvifServiceBase {
    constructor(configs: OnvifServiceEventsConfigs) {
        const {xaddr, user, pass, timeDiff} = configs;
        super({xaddr, user, pass});

        this.timeDiff = timeDiff;
        this.namespaceAttrList = [
            'xmlns:wsa="http://www.w3.org/2005/08/addressing"',
            'xmlns:tev="http://www.onvif.org/ver10/events/wsdl"'
        ];
    }

    getEventProperties() {
        const soapBody = '<tev:GetEventProperties/>';
        const soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetEventProperties', soap);
    }
}

export interface OnvifServiceEventsConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}
