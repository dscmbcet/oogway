class PollData {
    role = '';
}

class TeamData {
    role = '';
    channel = '';
}

class AnnoymousData {
    emoji = '';
    count = '';
    users = [''];
}

class FirebaseReaction {
    id = '';
    /**  @default ['TEAM'|'ANNOYMOUS'] ReactionType */
    type = '';
    guild_id = '';
    channel_name = '';
    channel_id = '';
    timestamp = '';
    /** @type {PollData | AnnoymousData | TeamData} */
    data;
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
