import { IMessageBuilder, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export async function startNewMessageWithDefaultSenderConfig(modify: IModify, read: IRead, sender: IUser, room: IRoom, useRocketCat: boolean): Promise<IMessageBuilder> {

    const msg = modify.getCreator().startMessage()
        .setGroupable(false)
        .setSender(sender);

    if (useRocketCat) {
        const settingsReader = read.getEnvironmentReader().getSettings();
        const userAliasSetting = await settingsReader.getValueById('userAlias');
        const userAvatarSetting = await settingsReader.getValueById('userAvatar');

        msg
            .setUsernameAlias(userAliasSetting)
            .setAvatarUrl(userAvatarSetting);
    }

    if (room) {
        msg.setRoom(room);
    }

    return msg;
}
