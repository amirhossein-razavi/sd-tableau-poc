const jws = require('jws');
const { v4 } = require('uuid');

const generateToken = () => {

    const username = 'mohsenrazavi1123@gmail.com';
    const connectedAppClientId = 'ea14a651-4fe1-4d92-9d44-9f308584c22a';
    const connectedAppSecretKey = 'xsa4sAC2YtPRuAieITXvaM2ZTB5HS7lWlYq//I07CIg=';
    const connectedAppSecretId = 'c096ed5c-5f44-4745-ade0-cf43a499944c';

    const data = {
        iss: connectedAppClientId,
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
        jti: v4(),
        aud: 'tableau',
        sub: username,
        scp: ['tableau:views:embed', 'tableau:metrics:embed'],
    };
    const header = {
        alg: 'HS256',
        typ: 'JWT',
        kid: connectedAppSecretId,
        iss: connectedAppClientId,
    };

    const token = jws.sign({
        header,
        payload: data,
        secret: connectedAppSecretKey,
        expiresIn: 60,
    });
    return token;
};

module.exports = generateToken;