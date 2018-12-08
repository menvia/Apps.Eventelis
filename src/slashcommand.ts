import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { IHttp, IHttpRequest, IMessageBuilder, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import { App } from '@rocket.chat/apps-engine/definition/App';
import { startNewMessageWithDefaultSenderConfig } from './helpers';
import { sdk } from './sdk';

/**
 * Eventelis Slash Commnand processor
 */
export class EventelisSlashCommand implements ISlashCommand {
    public command = 'eventelis';
    public i18nParamsExample = 'EVENTELIS_COMMAND_PARAMS';
    public i18nDescription = 'EVENTELIS_COMMAND_DESCRIPTION';
    public providesPreview = false;

    /**
     * Constructor
     * @param app
     */
    constructor(private readonly app: App) {
        sdk.setApp(app);
     }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        // The first string is always the Eventelis command the following ones
        // are parameters to be used as query
        const [command, ...query] = context.getArguments();

        if (!command) {
            return this.processHelpCommand(context, read, modify);
        }

        if ('search') {
            this.processSessionsCommand(context, query.join(' '), read, modify, http, persis);
        } else {
            this.processHelpCommand(context, read, modify);
        }
    }

    private async processHelpCommand(context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
        const sender = await read.getUserReader().getById('rocket.cat');
        const room = context.getRoom();

        const msg = await startNewMessageWithDefaultSenderConfig(modify, read, sender, room);
        const text =
            `These are the commands I can understand:
            \`/eventelis search {{query}} \` search sessions...
            \`/eventelis help\` Shows this message`;

        msg.setText(text);

        modify.getNotifier().notifyUser(context.getSender(), msg.getMessage());
    }

    private async postMessage(message: string, context: SlashCommandContext, read: IRead, modify: IModify) {
            const sender = await read.getUserReader().getById('rocket.cat');
            const room = context.getRoom();
            const msg = await startNewMessageWithDefaultSenderConfig(modify, read, sender, room);
            msg.setText(message);
            modify.getCreator().finish(msg);
    }

    private async processSessionsCommand(context: SlashCommandContext,
                                         query: string,
                                         read: IRead,
                                         modify: IModify,
                                         http: IHttp,
                                         persis: IPersistence): Promise<void> {
        let message = '';
        if (!await sdk.hasAuthInfo(read)) {
            message = 'Set the authentication key at the app admin';
            this.postMessage(message, context, read, modify);
            return;
        }

        // Set a first response to the user
        message = `Hummm, let me see if I can find sessions containing *${query}*...`;
        this.postMessage(message, context, read, modify);

        // Search for sessions on Eventelis
        const data = await sdk.getSessions(http, read, query);

        // Check if any session was found
        if (!data || data.length === 0) {
            message = `I could find no session containing *${query}*.`;
            this.postMessage(message, context, read, modify);
        } else {
            // Show user the number of found sessions
            message = `Yay! I've found ${data.length} sessions containing *${query}*.\n`;
            if (data.length > 10) {
                message += `For a better experience we will limit your search results in 10 sessions.\n`;
            }

            // Build message with the resulting sessions
            data.forEach((session, $index) => {
                if ($index < 10 && session.schedules && session.schedules.length > 0 && session.schedules[0].start) {
                    const dateTime = session.schedules[0].start.toLocaleString().split('T');
                    const date = dateTime[0].split('-');
                    const time = dateTime[1].split(':');
                    const stringDate = `${date[2]}.${date[1]}.${date[0]}`;
                    const stringTime = `${time[0]}:${time[1]}`;
                    message += `*${stringDate} ${stringTime}* - ${session.title}\n`;
                }
            });
            this.postMessage(message, context, read, modify);
        }
    }
}
