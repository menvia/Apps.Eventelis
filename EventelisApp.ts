import {
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

export class EventelisApp extends App {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }
}
