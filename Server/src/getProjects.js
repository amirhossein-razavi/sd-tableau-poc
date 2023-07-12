const axios = require('axios');

const serverName = 'prod-ca-a.online.tableau.com';
const apiVersion = '3.20';

const getProjects = async (token, siteId) => {
    try {
        const headers = {
            'X-Tableau-Auth': token,
        };

        const response = await axios.get(`https://${serverName}/api/${apiVersion}/sites/${siteId}/projects`, {
            headers: headers
        });

        return response.data.projects.project;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = getProjects;