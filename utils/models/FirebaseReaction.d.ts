export interface FirebaseReaction {
    id: string;
    type: REACTION_TYPE;
    guild_id: string;
    channel_name: string;
    channel_id: string;
    timestamp: string;
    content?: string;
    data: {
        role?: string;
        channel?: string;
        emoji?: string;
        count?: number;
        min_count?: number;
        user_id?: string;
        treat_id?: string;
        description?: string;
        users?: string[];
    }[];
}

export interface FirebaseReactionPoll extends FirebaseReaction {
    type: REACTION_TYPE.TEAM;
    data: {
        role: string;
    }[];
}
export interface FirebaseReactionTeam extends FirebaseReaction {
    type: REACTION_TYPE.TEAM;
    data: {
        role: string;
        channel: string;
    }[];
}
// Above both interfaces are handled as single object
export interface FirebaseReactionTeamPoll extends FirebaseReaction {
    type: REACTION_TYPE.TEAM;
    data: {
        role: string;
        channel?: string;
    }[];
}
export interface FirebaseReactionAnnoymous extends FirebaseReaction {
    type: REACTION_TYPE.ANNOYMOUS;
    data: {
        emoji: string;
        count: number;
        users: string[];
    }[];
}
export interface FirebaseReactionAnnoymousTreat extends FirebaseReaction {
    type: REACTION_TYPE.TREAT;
    data: {
        emoji: string;
        count: number;
        min_count: number;
        user_id: string;
        treat_id: string;
        description: string;
        users: string[];
    }[];
}

enum REACTION_TYPE {
    TEAM = 'TEAM',
    ANNOYMOUS = 'ANNOYMOUS',
    TREAT = 'TREAT',
}
