enum REACTION_TYPE {
    TEAM = 'TEAM',
    ANNOYMOUS = 'ANNOYMOUS',
}

interface FirebaseReactionDataArray {
    role?: string;
    channel?: string;
    emoji?: string;
    count?: number;
    users?: string[];
}

interface FirebaseReaction {
    id: string;
    type: REACTION_TYPE;
    guild_id: string;
    channel_name: string;
    channel_id: string;
    timestamp: string;
    data: FirebaseReactionDataArray[];
}
