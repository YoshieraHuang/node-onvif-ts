import { parse, UrlWithStringQuery } from 'url';
import { createRequestSoap } from './soap';

export class OnvifServiceBase {
    protected xaddr = '';
    protected user = '';
    protected pass = '';
    protected oxaddr: UrlWithStringQuery;
    protected timeDiff: number;
    protected namespaceAttrList: string[];

    constructor({xaddr, user, pass}: OnvifServiceBaseConfigs) {
        this.xaddr = xaddr;
        this.user = user || '';
        this.pass = pass || '';
        this.oxaddr = parse(this.xaddr);
        if (this.user) {
            this.oxaddr.auth = this.user + ':' + this.pass;
        }
        this.timeDiff = 0;
    }

    protected createRequestSoap(body: string) {
        return createRequestSoap({
            body,
            xmlns: this.namespaceAttrList,
            diff: this.timeDiff,
            user: this.user,
            pass: this.pass,
        });
    }

    setAuth(user: string, pass: string) {
        this.user = user;
        this.pass = pass;
        if (this.user) {
            this.oxaddr.auth = this.user + ' ' + this.pass;
        } else {
            this.oxaddr.auth = '';
        }
    }

}

export interface OnvifServiceBaseConfigs {
    xaddr: string;
    user?: string;
    pass?: string;
}