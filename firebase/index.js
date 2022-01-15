const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://master-oogway-bot-default-rtdb.firebaseio.com/',
});

exports.dbFirebase = admin.firestore();
exports.dbRealtimeDatabase = admin.database();
