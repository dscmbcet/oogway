const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { COLORS, PREFIX, EMAIL_REGEX } = require('../utils/constants');
const { logger } = require('../utils/logger');
const { MESSAGES } = require('./messages/onboarding');
const { sendDissapearingMessage } = require('../utils/functions');
const { addNewMember, getMember, updateBanOrKickMember } = require('../firebase/firebase_handler');
const { sendMail } = require('../utils/mailHandler');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     * */
    async execute(member, client) {
        await updateBanOrKickMember(member, { reason: '' }, { reason: '' }, false);
        const user = await getMember(member);

        if (user.verified) {
            const serverConfig = client.configs.get(member.guild.id);
            const memberRole = member.guild.roles.cache.get(serverConfig.member_role_id);
            await member.roles.add(memberRole);
            return;
        }
        const serverConfig = client.configs.get(member.guild.id);
        const unverifiedRole = member.guild.roles.cache.get(serverConfig.unverified_role_id);
        await member.roles.add(unverifiedRole);

        const channel = member.guild.channels.cache.get(serverConfig.verification_channel_id);
        this.sendVerify(member, channel);
    },

    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.GuildChannel} channel
     */
    async sendVerify(member, channel) {
        const message = MESSAGES.WELCOME_MESSAGE.replace('@USERNAME', member.user).replace('@USERNAME', member.user);
        try {
            const embed = new Discord.MessageEmbed()
                .setTitle('Verification')
                .setColor(COLORS.cyan)
                .setDescription(`Check your DM for verification ${member.user}`);
            await member.send(message);
            await channel.send(embed);
        } catch (error) {
            const embed = new Discord.MessageEmbed()
                .setTitle('I am unable to send you a message for verification')
                .setColor(COLORS.red)
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(
                    [
                        `${member.user}`,
                        '1. Please go your discord user **settings**',
                        '2. Go to **Privacy & Safety** menu',
                        '3. Enable **Allow direct messages from server members**',
                        `\nAfter that type \`${PREFIX}verify-me\` here`,
                    ].join('\n')
                )
                .setFooter('Feel free to disble the Allow direct messages from server members option after verification');
            await channel.send(embed);
        }
    },

    /**
     * @param {Discord.Message} message
     * @param {Discord.Client} client
     */
    async messageHandler(message, client) {
        let guildID;
        if (PREFIX === '!') guildID = require('../configs/dsc').id;
        else guildID = require('../configs/ooway-test').id;

        const user = client.guilds.cache.get(guildID).members.cache.get(message.author.id);
        let command;
        let args;

        const tempUser = await getMember(user);
        if (tempUser.verified) return;

        if (message.content.toLowerCase() === 'agree') command = 'agree';
        else if (message.content.startsWith(PREFIX)) {
            args = message.content.slice(PREFIX.length).trim().split(' ');
            command = args.shift().toLowerCase();
        } else {
            const possibleMessage = [
                {
                    message: MESSAGES.WELCOME_MESSAGE.replace('@USERNAME', user.user).replace('@USERNAME', user.user),
                    command: 'name',
                },
                {
                    message: MESSAGES.QUESTION_TWO.replace('@ANSWER_NAME', tempUser.name).replace('@ANSWER_NAME', tempUser.name),
                    command: 'email',
                },
                { message: MESSAGES.QUESTION_THREE.replace('@EMAIL', tempUser.email), command: 'verify' },
                { message: MESSAGES.QUESTION_FOUR, command: 'dy' },
                {
                    message: MESSAGES.QUESTION_FIVE.replace('@DEPARTMENT', tempUser.branch).replace('@YEAR', tempUser.year),
                    command: 'college',
                },
                {
                    message: MESSAGES.QUESTION_SIX.replace('@COLLEGE', tempUser.college),
                    command: 'agree',
                },
            ];
            const previousMessage = (await message.channel.messages.fetch())
                .filter((e) => e.author.bot)
                .filter((e) => e.content !== '')
                .first().content;

            const bestMessage = possibleMessage.find((e) => e.message === previousMessage);
            if (bestMessage === undefined) {
                return message.channel.send(possibleMessage[0].message);
            }

            command = bestMessage.command;
            args = message.content.trim().split(' ');
            logger.info(`${user.user.tag} is using DM: ${command}`);
        }

        try {
            const serverConfig = client.configs.get(guildID);

            if (command === 'verify-me') {
                return message.channel.send(MESSAGES.WELCOME_MESSAGE.replace('@USERNAME', user).replace('@USERNAME', user));
            }

            if (command === 'name') {
                if (!args[0]) return sendDissapearingMessage(message, '**Invalid Name!**');
                const name = args.join(' ').trim();
                if (!/^[a-zA-Z ]+$/.test(name)) return sendDissapearingMessage(message, '**Invalid Name!**');

                try {
                    await user.setNickname(name);
                } catch (error) {}

                await addNewMember({ user, name });
                const msg = MESSAGES.QUESTION_TWO.replace('@ANSWER_NAME', name).replace('@ANSWER_NAME', name);
                return message.channel.send(msg);
            }

            if (command === 'email') {
                if (!args[0]) return sendDissapearingMessage(message, '**Invalid Email!**');
                const email = args[0].trim();

                if (!EMAIL_REGEX.test(email)) return sendDissapearingMessage(message, '**Invalid Email Entered!**');
                if (email.endsWith('@mbcet.ac.in')) return sendDissapearingMessage(message, '**Invalid Email Entered!**');

                const verificationCode = uuidv4().replace('-', '').slice(0, 10).toLocaleUpperCase();
                await addNewMember({ user, email, verificationCode, verifiedEmail: false });

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Sending verification code to: ${email}`)
                    .setColor(COLORS.yellow)
                    .setDescription('Please wait this might take a few minutes');
                message.channel.send(embed);

                const mailStatus = await sendMail(email, verificationCode);
                if (mailStatus) {
                    const msg = MESSAGES.QUESTION_THREE.replace('@EMAIL', email);
                    return message.channel.send(msg);
                }
                embed = new Discord.MessageEmbed()
                    .setTitle('⛔ **We are experiencing some issues right now** ⛔')
                    .setColor(COLORS.red)
                    .setDescription(MESSAGES.ERROR_MAIL);
                return message.channel.send(embed);
            }

            if (command === 'verify') {
                if (!args[0]) return sendDissapearingMessage(message, '**Invalid Verification Code Entered!**');
                const verificationCode = args[0].trim();
                if ((await getMember(user)).verificationCode === verificationCode) {
                    await addNewMember({ user, verifiedEmail: true });
                    const msg = MESSAGES.QUESTION_FOUR;
                    return message.channel.send(msg);
                }
                return sendDissapearingMessage(message, '**Invalid Verification Code Entered!**');
            }

            if (command === 'dy') {
                if (args.length < 2) return sendDissapearingMessage(message, '**PLease provide details properly!**');
                const VALID_DEPARTMENTS = ['CSE', 'EC', 'EE', 'ME', 'CE', 'OTHER'];
                const branch = args[0].trim().toUpperCase();
                const year = parseInt(args[1].trim(), 10);

                if (!VALID_DEPARTMENTS.find((e) => e === branch)) {
                    return sendDissapearingMessage(message, `**PLease provide a valid department**\n\n ${VALID_DEPARTMENTS.join(', ')}`);
                }

                if (year === undefined || year < 2000 || year > new Date().getFullYear() + 10) {
                    return sendDissapearingMessage(message, '**PLease provide a valid year**');
                }

                await addNewMember({ user, branch, year });
                const msg = MESSAGES.QUESTION_FIVE.replace('@DEPARTMENT', branch).replace('@YEAR', year);
                return message.channel.send(msg);
            }

            if (command === 'college') {
                if (!args[0]) return sendDissapearingMessage(message, '**PLease provide details properly!**');
                let college;
                if (args[0].toLowerCase() === 'yes') {
                    college = 'MBCET';
                    await user.roles.remove(serverConfig.other_colleges_role_id);
                } else {
                    college = args.join(' ');
                    if (college.toUpperCase() !== 'MBCET') await user.roles.add(serverConfig.other_colleges_role_id);
                }

                await addNewMember({ user, college });
                const msg = MESSAGES.QUESTION_SIX.replace('@COLLEGE', college);
                return message.channel.send(msg);
            }

            if (command === 'agree') {
                if (message.content !== 'agree' && message.content !== `${PREFIX}agree`) {
                    return sendDissapearingMessage(message, 'You must say `agree` to the code of conduct to move forward');
                }
                const person = await getMember(user);

                if (
                    person.email === 'Not Provided' ||
                    person.name === 'Not Provided' ||
                    person.year === 0 ||
                    person.college === 'Not Provided' ||
                    person.branch === 'Not Provided' ||
                    !person.verifiedEmail
                ) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(COLORS.red)
                        .setThumbnail(user.user.displayAvatarURL())
                        .addField(`${user.user.tag}`, `${user.user}`)
                        .addField('Email:', person.email)
                        .addField('College:', person.college)
                        .addField('Department:', person.branch)
                        .addField('Year:', person.year === 0 ? 'Not Provided' : person.year)
                        .addField('Email Verified:', person.verifiedEmail ? ':white_check_mark:' : ':x:')
                        .setFooter('Please fill in the required fields');
                    return message.channel.send(embed);
                }

                await user.roles.add(serverConfig.member_role_id);
                await user.roles.remove(serverConfig.unverified_role_id);

                await addNewMember({ user, verified: true });

                const msg = MESSAGES.FINAL;
                await message.channel.send(msg);

                const guild = client.guilds.cache.get(guildID);
                const channel = guild.channels.cache.get(serverConfig.welcome_channel_id);

                logger.info(`A new member just arrived: ${user.user.tag}`);
                const embed = new Discord.MessageEmbed({
                    title: 'A new member just arrived!',
                    description: [
                        `Welcome **${user}** we hope you enjoy your stay here!`,
                        '\nI am **Master Oogway**, bot of GDSC MBCET',
                        'To get to know me type: `!help-v`',
                    ].join('\n'),
                    thumbnail: { url: user.user.displayAvatarURL() },
                    color: COLORS.cyan,
                });
                channel.send(embed);

                await new Promise((resolve) => setTimeout(() => resolve(), 60000));
                await message.channel.delete();
            }
        } catch (e) {
            logger.error(`Command: ${command} Error:`, e);
            const embed = new Discord.MessageEmbed({
                title: 'Error Occured',
                description: 'Check your commands',
                color: COLORS.red,
            });
            return message.channel.send(embed).then((msg) => {
                msg.delete({ timeout: 5000 });
            });
        }
    },
};
