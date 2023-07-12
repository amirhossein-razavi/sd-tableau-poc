const axios = require('axios');

const serverName = 'prod-ca-a.online.tableau.com';
const apiVersion = '3.20';

const Login = async () => {
    try {
        const username = 'mohsenrazavi1123@gmail.com';
        const password = '!Abcd123';

        const payload = {
            credentials: {
                name: username,
                password,
                site: {
                    contentUrl: '',
                },
            },
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        const response = await axios.post(`https://${serverName}/api/${apiVersion}/auth/signin`, payload, {
            headers: headers
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = Login;