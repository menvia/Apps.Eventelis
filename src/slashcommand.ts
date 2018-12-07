import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { IHttp, IHttpRequest, IMessageBuilder, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import { App } from '@rocket.chat/apps-engine/definition/App';
import { startNewMessageWithDefaultSenderConfig } from './helpers';
import { sdk } from './sdk';

export class EventelisSlashCommand implements ISlashCommand {
    public command = 'eventelis';
    public i18nParamsExample = 'EVENTELIS_COMMAND_PARAMS';
    public i18nDescription = 'EVENTELIS_COMMAND_DESCRIPTION';
    public providesPreview = false;

    constructor(private readonly app: App) { }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [command, query] = context.getArguments();

        if (!command) {
            return this.processHelpCommand(context, read, modify);
        }

        switch (command) {
            case 'sessions':
            case 'lectures':
            case 'palestras':
                this.processSessionsCommand(context, query, read, modify, http, persis);
                break;
            default:
            return this.processHelpCommand(context, read, modify);
        }

    }

    private async processHelpCommand(context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
        const sender = await read.getUserReader().getById('rocket.cat');
        const room = context.getRoom();

        const msg = await startNewMessageWithDefaultSenderConfig(modify, read, sender, room);
        const text =
            `These are the commands I can understand:
            \`/eventelis sessions {{Search}} \` search sessions...
            \`/eventelis help\` Shows this message`;

        msg.setText(text);

        modify.getNotifier().notifyUser(context.getSender(), msg.getMessage());
    }

    private async processSessionsCommand(context: SlashCommandContext,
                                         query: string,
                                         read: IRead,
                                         modify: IModify,
                                         http: IHttp,
                                         persis: IPersistence): Promise<void> {
        const sender = await read.getUserReader().getById('rocket.cat');
        const room = context.getRoom();

        const msg = await startNewMessageWithDefaultSenderConfig(modify, read, sender, room);

        if (!await sdk.hasAuthInfo(read)) {
            msg.setText('Set the authentication key at the app admin');
            modify.getCreator().finish(msg);
            return;
        }

        msg.setText('Set the authentication key at the app admin');
        const data = await sdk.getSessions(http, read, query);
        let message = '';
        data.forEach((session, $index) => {
            if ($index < 10) {
                message += session.title + '\n';
            }
        });
        msg.setText(message);

        modify.getCreator().finish(msg);
    }
}
