import { createRequestSoap } from './soap';

export class OnvifServiceBase {
    protected xaddr = '';
    protected user = '';
    protected pass = '';
    protected oxaddr: URL;
    protected timeDiff: number;
    protected namespaceAttrList: string[];

    constructor({xaddr, user, pass}: OnvifServiceBaseConfigs) {
        this.xaddr = xaddr;
        this.user = user || '';
        this.pass = pass || '';
        this.oxaddr = new URL(this.xaddr);
        if (this.user) {
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        }
        this.timeDiff = 0;
    }

    protected createRequestSoap(body: string, withoutUser = false) {
        return withoutUser
          ? createRequestSoap({
              body,
              xmlns: this.namespaceAttrList,
              diff: this.timeDiff,
          })
          : createRequestSoap({
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
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        } else {
            this.oxaddr.username = null;
            this.oxaddr.password = null;
        }
    }

}

export interface OnvifServiceBaseConfigs {
    xaddr: string;
    user?: string;
    pass?: string;
}
