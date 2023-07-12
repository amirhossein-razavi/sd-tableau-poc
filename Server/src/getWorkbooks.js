const axios = require('axios');

const serverName = 'prod-ca-a.online.tableau.com';
const apiVersion = '3.20';

const getWorkbooks = async (token, siteId) => {
    try {
        const headers = {
            'X-Tableau-Auth': token,
        };

        const response = await axios.get(`https://${serverName}/api/${apiVersion}/sites/${siteId}/workbooks`, {
            headers: headers
        });

        return response.data.workbooks.workbook;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = getWorkbooks;