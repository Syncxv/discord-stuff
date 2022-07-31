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
