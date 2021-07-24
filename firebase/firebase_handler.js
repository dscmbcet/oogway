const admin = require("firebase-admin");
const Discord = require("discord.js");
const serviceAccount = require("./firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.reactionDataArray = [];
exports.treatDataArray = [];

console.log("Initialising firebase");

/**
 * @param {Discord.Message} reaction_message
 * @param {{channel: Discord.Channel;role: Discord.Role;}[]} team_data
 * @param {string} type
 */
exports.addReactionRole = async (reaction_message, team_data, type) => {
  const colRef = db.collection("rection-roles");

  const new_team_data = team_data.map((e) => {
    if (e.channel) return { role: e.role.id, channel: e.channel.id };
    else return { role: e.role.id };
  });

  const data = {
    id: reaction_message.id,
    type: type,
    guild_id: reaction_message.guild.id,
    channel_name: `${reaction_message.channel.parent.name}:${reaction_message.channel.name}`,
    channel_id: reaction_message.channel.id,
    timestamp: reaction_message.createdAt.toISOString(),
    team_data: new_team_data,
  };

  colRef.doc(reaction_message.id).set(data);
};

/**
 * @param {string} reaction_message
 */
exports.removeReactionRole = async (reaction_message_id) => {
  const colRef = db.collection("rection-roles");
  await colRef.doc(reaction_message_id).delete();
  const deleteIndex = this.reactionDataArray.findIndex((e) => e.id === reaction_message_id);
  if (deleteIndex != -1) this.reactionDataArray.splice(deleteIndex);
};

/**
 * @param {Discord.Message} message
 * @param {Discord.User} user
 * @param {string} description
 */
exports.addToTreatList = async (message, user, description) => {
  const colRef = db.collection("treat-list");
  colRef.doc(message.id).set({
    id: message.id,
    guild_id: message.guild.id,
    user_id: user.id,
    user_name: user.tag,
    description: description,
    timestamp: message.createdAt.toISOString(),
  });
};

exports.listenForReactionRoles = async () => {
  const observer = db.collection("rection-roles")
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          console.log(`New reaction role: ${change.doc.data().id} @Channel ${change.doc.data().channel_name}`);
          this.reactionDataArray.push(change.doc.data());
        }
        if (change.type === "removed") {
          console.log(`Removed reaction role: ${change.doc.data().id} @Channel ${change.doc.data().channel_name}`);
        }
      });
    });
};

exports.listenForTreat = async () => {
  const observer = db.collection("treat-list").onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        console.log(`New treat: ${change.doc.data().id} @User ${change.doc.data().user_name} , Reason: ${change.doc.data().description}`);
        this.treatDataArray.push(change.doc.data());
      }
      if (change.type === "removed") {
        console.log(
          `Removed treat: ${change.doc.data().id} @User ${change.doc.data().user_name} , Reason: ${change.doc.data().description}`);
      }
    });
  });
};
