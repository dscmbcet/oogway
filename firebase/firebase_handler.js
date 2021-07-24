const admin = require("firebase-admin");
const Discord = require("discord.js");
const serviceAccount = require("./firebase-config.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
exports.reactionDataArray = [];

console.log('Initialising firebase');

exports.getConfig = async (code) => {
    const colRef = db.collection('configs');
    const docs = await colRef.get();
    if (docs.empty) {
        return undefined;
    }
    let token
    docs.forEach((doc) => {
        token = doc.data()
    })
    return token
}

/**
 * @param {Discord.Message} reaction_message
 * @param {{channel: Discord.Channel;role: Discord.Role;}[]} team_data
 */
exports.addReactionRole = async (reaction_message, team_data) => {
    const colRef = db.collection('rection-roles');

    const new_team_data = team_data.map(e => {
        if (e.channel) return { role: e.role.id, channel: e.channel.id }
        else return { role: e.role.id }
    })

    colRef.doc(reaction_message.id).set({
        id: reaction_message.id,
        guild_id: reaction_message.guild.id,
        channel_name: reaction_message.channel.name,
        channel_id: reaction_message.channel.id,
        timestamp: reaction_message.createdAt.toISOString(),
        team_data: new_team_data
    });
}


exports.removeReactionRole = async (reaction_message_id) => {
    const colRef = db.collection('rection-roles');
    await colRef.doc(reaction_message_id).delete();
    const deleteIndex = this.reactionDataArray.findIndex(e => e.id === reaction_message_id);
    if (deleteIndex != -1) this.reactionDataArray.splice(deleteIndex);
}


listenForNewReactionRoles = async () => {
    const observer = db.collection('rection-roles')
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    console.log(`New reaction role: ${change.doc.data().id} @Channel: ${change.doc.data().channel_name}`);
                    this.reactionDataArray.push(change.doc.data());
                }
                if (change.type === 'removed') {
                    console.log(`Removed reaction role: ${change.doc.data().id} @Channel: ${change.doc.data().channel_name}`);
                }
            });
        });
}

listenForNewReactionRoles();

