class FirebaseReactionDataArray {
    name = '';
    role = '';
    channel = '';
    emoji = '';
    count = '';
    users = [''];
}

class FirebaseReaction {
    id = '';
    type = '';
    guild_id = '';
    channel_name = '';
    channel_id = '';
    timestamp = '';
    data = [new FirebaseReactionDataArray()];
}

class FirebaseTreat {
    id = '';
    user_id = '';
    guild_id = '';
    user_name = '';
    description = '';
    timestamp = '';
}

module.exports = { FirebaseReaction, FirebaseTreat };
