import { IHttp, IHttpRequest, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { ISession } from './interfaces';

class SDK {
    private app: App;
    public setApp(app: App): any {
        this.app = app;
    }
    public async getSessions(http: IHttp, read: IRead, query: string) {
        const url = 'https://frl.io/event/session';

        const options: IHttpRequest = {
            headers: await this.getHeaders(read),
            params: await this.getParams(read, query),
        };

        const response = await http.get(url, options);

        return response.data as Array<ISession>;
    }

    public async hasAuthInfo(read: IRead): Promise<boolean> {
        const headers = await this.getHeaders(read);

        return !!headers.Authorization;
    }

    private async getHeaders(read: IRead): Promise<{[key: string]: string}> {
        const settingsReader = read.getEnvironmentReader().getSettings();
        const authKeySetting = await settingsReader.getValueById('key');

        return {
            'Authorization': authKeySetting,
            'Content-Type': 'application/json',
            'X-Client-Version': `Farol/${this.app.getVersion()}/javascript/rocketchat`,
        };
    }

    private async getParams(read: IRead, query: string): Promise<{[key: string]: string}> {
        const settingsReader = read.getEnvironmentReader().getSettings();
        const eventId = await settingsReader.getValueById('eventId');

        return {
            event_id: eventId,
            q: query,
        };
    }
}

export const sdk = new SDK();
