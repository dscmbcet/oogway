const { PREFIX } = require('../../utils/constants');

const WELCOME_MESSAGE = [
    'Hello @USERNAME :wave:',
    "I'm Master Oogway and I'm here to welcome you to the GDSC MBCET Community on Discord!",
    '\nBefore you can join the server, I need to ask you a few questions.',
    'If you have any trouble, please ask us about it in the verification channel',
    "Here's the first question:",
    "\n**🔺1. What's your full name?**",
].join('\n');

const QUESTION_TWO = [
    '✅ Great, Hi **@ANSWER_NAME** :wave:',
    "\nI've changed your name on this server to **@ANSWER_NAME**.",
    `If you'd like to change it back then type: \`${PREFIX}name <NAME>\`, Eg: \`${PREFIX}name John Doe\``,
    "\n**🔺2. What's your email address (not mbcet email)?**",
].join('\n');

const QUESTION_THREE = [
    '✅ Awesome, we have sent a verification email to: **@EMAIL** .',
    `\nIf you haven't recieved the code type: \`${PREFIX}email <YOUR_EMAIL>\` again to resent the code, Eg: \`${PREFIX}email johndoe@gmail.com\``,
    '\n**🔺3. Enter the verification code sent to your mail**',
].join('\n');

const ERROR_MAIL = ['Please try again later using command', `\`${PREFIX}email <YOUR_EMAIL>\``, `Eg: \`${PREFIX}email johndoe@gmail.com\``];

const QUESTION_FOUR = [
    '✅ Great, we are almost done',
    '\nWe would need your department and passout year now',
    'Valid Departments Are: `CSE, CE, ME, EE, EC, OTHER`',
    '\n**🔺4. Enter your department and passout year**',
    'Eg: if you are from **CSE** and in **2nd** year',
    `Your reply should be: \`CSE ${new Date().getFullYear() + 2}\``,
].join('\n');

const QUESTION_FIVE = [
    '✅ Great you are from **@DEPARTMENT** and will passout in year **@YEAR**',
    `If you'd like to change it then type: \`${PREFIX}dy <DEPARTMENT> <PASSOUT_YEAR>\`, Eg: \`${PREFIX}dy CSE 2023\``,
    '\n**🔺5. Are you from MBCET or Other Colleges?`**',
    'If you from MBCET Reply: `yes`',
    'Otherwise Reply: `YOUR_COLLEGE_NAME`',
].join('\n');

const QUESTION_SIX = [
    '✅ Great you are from **@COLLEGE** college',
    `If you'd like to change it then type: \`${PREFIX}college <yes / COLLEGE_NAME>\`, Eg: \`${PREFIX}college yes\``,
    '\nOur community rules are',
    '```1. No Spam',
    '2. No Promotions',
    '3. Be Respectful and do not insult each other or yourself.',
    '4. Please refrain from forwarding trivial posts that do not pertain to the objective of the group.',
    '5. Help and learn from each other.',
    '6. Anybody found not respecting the guidelines of the group shall be removed promptly.```',
    '\n**🔺6. Do you agree to abide by and uphold the code of conduct?`**',
    'Reply: `yes`',
].join('\n');

const FINAL = [
    '**✅ Congratulations you have been verified.',
    '\n✨Welcome to GDSC MBCET Community.✨**',
    'Do not wait to start the conversation',
    '\nHead over to https://discord.com/channels/745702118240944138/756387538968510574 and say **hello** to your community.',
].join('\n');

const MESSAGES = { WELCOME_MESSAGE, QUESTION_TWO, QUESTION_THREE, QUESTION_FOUR, QUESTION_FIVE, QUESTION_SIX, FINAL, ERROR_MAIL };

module.exports = { MESSAGES };
