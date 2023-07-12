const axios = require('axios');

const serverName = 'prod-ca-a.online.tableau.com';
const apiVersion = '3.20';

const getWorkbook = async (token, siteId, workbookId) => {
    try {
        const headers = {
            'X-Tableau-Auth': token,
        };

        const response = await axios.get(`https://${serverName}/api/${apiVersion}/sites/${siteId}/workbooks/${workbookId}`, {
            headers: headers
        });

        return response.data.workbook;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = getWorkbook;