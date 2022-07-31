- [Guild Stuff](#guild-stuff)
  - [Basic get guild stuff](#basic-get-guild-stuff)
  - [Get current guild](#get-current-guild)
  - [Get member count of guild](#get-member-count-of-guild)
  - [Get guild icon](#get-guild-icon)
  - [mute a channel for some time hehhe ha](#mute-a-channel-for-some-time-hehhe-ha)
- [GC stuff](#gc-stuff)
  - [GC ADDER](#gc-adder)

# Guild Stuff

## Basic get guild stuff

```js
const { getGuild, getGuilds, getGuildCount } = getModule(['getGuild'], false);
const guild = getGuild('id bruh');
const guilds = getGuilds(); // returns object of guilds where key is id {[guildId: string]: Guild}
const guildCount = getGuildCount(); // 69
```

## Get current guild

```js
const { getGuild } = getModule(['getGuild'], false);
const { getLastSelectedGuildId, getGuildId } = getModule(['getLastSelectedGuildId'], false);
const currentGuild = getGuild(getLastSelectedGuildId());
//or
const currentGuild = getGuild(getGuildId());
```

## Get member count of guild

```js
const { getGuildId } = getModule(['getLastSelectedGuildId'], false);
getModule(['getMemberCounts'], false).getMemberCount(getGuildId());
```

## Get guild icon

```js
function getGuildIcon(guildId) {
    const { getGuild } = getModule(['getGuild'], false);
    const { getGuildIconURL } = getModule(['getGuildIconURL'], false);
    return getGuildIconUrl(getGuild(guildId || getModule(['getLastSelectedGuildId'], false).getGuildId()));
}
```

## mute a channel for some time hehhe ha

```js
function muteChannel(seconds, channelId) {
    const { updateChannelOverrideSettings } = getModule(['updateChannelOverrideSettings'], false);
    const { getChannelId } = getModule(['getLastSelectedChannelId'], false);
    const { getChannel } = getModule(['getChannel', 'getDMFromUserId'], false);
    const channel = getChannel(channelId || getChannelId());
    //updates channel stuff, rn im muting it gg ez
    updateChannelOverrideSettings(channel.guild_id, channel.id, { muted: true });

    function getMuteConfig(s) {
        return {
            muted: true,
            mute_config: {
                end_time: new Date(Date.now() + s * 1000).toISOString(),
                selected_time_window: Number(s),
            },
        };
    }
    updateChannelOverrideSettings(channel.guild_id, channel.id, getMuteConfig(seconds));
}
//900 sec = 15 mins gg ez
muteChannel(900);
```

# GC stuff

## GC ADDER

when someone leaves it adds them back :)

do `stopThingy()` to stop doing it :)

```js
const { FluxDispatcher } = require('powercord/webpack');
const { addRecipient } = getModule(['addRecipient'], false);

const USER_ID_TO_ADD = '743562553212534846';
const GC_CHANNEL_ID = '1003111684765929525';

function handler(payload) {
    if (payload.user.id === USER_ID_TO_ADD && payload.channelId === GC_CHANNEL_ID) {
        addRecipient(payload.channelId, payload.user.id);
    }
}
FluxDispatcher.subscribe('CHANNEL_RECIPIENT_REMOVE', handler);

const stopThingy = () => FluxDispatcher.unsubscribe('CHANNEL_RECIPIENT_REMOVE', handler);
```
