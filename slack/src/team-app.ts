import { TeamConfig } from './config/team.config';
import { SlackApp } from './slack-app';
import { RTMClient, WebClient } from '@slack/client';

export class TeamApp extends SlackApp {
    private _appRtmClient: RTMClient;
    private _appWebClient: WebClient;

    public get appRtmClient(): RTMClient {
        return this._appRtmClient;
    }

    public get appWebClient(): WebClient {
        return this._appWebClient;
    }

    constructor(public config: TeamConfig) {
        super();
        this.initApp();
    }

    private initApp() {
        if (this.config.botToken) {
            this._appRtmClient = new RTMClient(this.config.botToken);
            this._appWebClient = new WebClient(this.config.botToken);
        } else {
            this._appRtmClient = new RTMClient(this.config.appToken);
            this._appWebClient = new WebClient(this.config.appToken);
        }

        this._appRtmClient.start();
    }
}
