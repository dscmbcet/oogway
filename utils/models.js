class PollData {
    role = '';
}

class TeamData {
    role = '';
    channel = '';
}

class AnnoymousData {
    emoji = '';
    count = 0;
    users = [''];
}

class AnnoymousTreatData {
    emoji = '';
    count = 0;
    min_count = 0;
    user_id = '';
    treat_id = '';
    description = '';
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
    data = [new PollData(), new AnnoymousData(), new TeamData(), new AnnoymousTreatData()];
}

class FirebaseReactionPoll extends FirebaseReaction {
    data = [new PollData()];
}
class FirebaseReactionTeam extends FirebaseReaction {
    data = [new TeamData()];
}
class FirebaseReactionAnnoymous extends FirebaseReaction {
    data = [new AnnoymousData()];
}
class FirebaseReactionAnnoymousTreat extends FirebaseReaction {
    data = [new AnnoymousTreatData()];
}

class FirebaseTreat {
    id = '';
    user_id = '';
    guild_id = '';
    user_name = '';
    description = '';
    timestamp = '';
}

module.exports = {
    FirebaseReaction,
    FirebaseTreat,
    FirebaseReactionAnnoymous,
    FirebaseReactionAnnoymousTreat,
    FirebaseReactionPoll,
    FirebaseReactionTeam,
};
