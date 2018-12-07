import {
    IConfigurationExtend, IEnvironmentRead, ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { EventelisSlashCommand } from './src/slashcommand';

export class EventelisApp extends App {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }
    public async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configuration.settings.provideSetting({
            id: 'userAlias',
            type: SettingType.STRING,
            packageValue: 'Eventelis',
            required: true,
            public: false,
            i18nLabel: 'USER_ALIAS_LABEL',
            i18nDescription: 'USER_ALIAS_DESCRIPTION',
        });

        configuration.settings.provideSetting({
            id: 'userAvatar',
            type: SettingType.STRING,
            packageValue: 'https://res.cloudinary.com/hrscywv4p/image/upload/c_limit,h_630,q_90,w_1200/v1/41445/logo_eventelis_ry6p3p.png',
            required: true,
            public: false,
            i18nLabel: 'USER_AVATAR_LABEL',
            i18nDescription: 'USER_AVATAR_DESCRIPTION',
        });
        await configuration.settings.provideSetting({
            id: 'key',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'KEY_LABEL',
            i18nDescription: 'KEY_DESCRIPTION',
        });
        await configuration.settings.provideSetting({
            id: 'eventId',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'EVENT_ID_LABEL',
            i18nDescription: 'EVENT_ID_DESCRIPTION',
        });
        await configuration.slashCommands.provideSlashCommand(new EventelisSlashCommand(this));
    }
}
