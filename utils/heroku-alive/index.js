const axios = require('axios').default;
require('dotenv').config();

const mbcetCredentials = JSON.parse(process.env.ACCOUNT1);
const dscCredentials = JSON.parse(process.env.ACCOUNT2);

const baseURL = 'https://api.heroku.com';
const Accept = 'application/vnd.heroku+json; version=3.account-quotas';
const thresholdHours = 128;

const mbcetAPI = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${mbcetCredentials.token}`,
        Accept,
    },
});

const dscAPI = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${dscCredentials.token}`,
        Accept,
    },
});

const dscBot = async (enable) => {
    console.log(`Enable DSC BOT: ${enable}`);
    const dscRes = await dscAPI.patch(`/apps/${dscCredentials.bot.id}/formation/${dscCredentials.bot.worker}`, {
        quantity: enable ? 1 : 0,
        size: 'Free',
        type: 'Worker',
    });

    return dscRes.data.quantity;
};

const mbcetBot = async (enable) => {
    console.log(`Enable MBCET BOT: ${enable}`);
    const mbcetRes = await mbcetAPI.patch(`/apps/${mbcetCredentials.bot.id}/formation/${mbcetCredentials.bot.worker}`, {
        quantity: enable ? 1 : 0,
        size: 'Free',
        type: 'Worker',
    });

    return mbcetRes.data.quantity;
};

const enableDSCBot = async (enable) => {
    await dscBot(enable);
    await mbcetBot(!enable);
};

const checkCredits = async () => {
    const mbcetRes = (await mbcetAPI.get(`/accounts/${mbcetCredentials.id}/actions/get-quota`))?.data;
    const mbcetQuota = (mbcetRes.account_quota - mbcetRes.quota_used) / 3600;

    const dscRes = (await dscAPI.get(`/accounts/${dscCredentials.id}/actions/get-quota`))?.data;
    const dscQuota = (dscRes.account_quota - dscRes.quota_used) / 3600;

    console.log({ quota: { dsc: dscQuota.toFixed(2), mbcet: mbcetQuota.toFixed(2) } });

    // If quotas expired
    if (mbcetQuota === 0) return enableDSCBot(true);
    if (dscQuota === 0) return enableDSCBot(false);

    // Dividing quotas equally
    if (mbcetQuota >= thresholdHours) await enableDSCBot(false);
    else await enableDSCBot(true);
};

checkCredits();
