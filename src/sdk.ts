import { IHttp, IHttpRequest, IRead } from '@rocket.chat/apps-engine/definition/accessors';

export interface ISchedule {
    _id: string;
    start: Date;
    end: Date;
    track: string;
    order: number;
    location: string;
}

export interface ISession {
    _id: string;
    app: string;
    ext_id: string;
    desc: string;
    event: string;
    removed: boolean;
    schedules: Array<ISchedule>;
    speakers: Array<string>;
    title: string;
    id: string;
}

class SDK {
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
            'X-Client-Version': 'Farol/0.0.1/javascript/rocketchat',
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
