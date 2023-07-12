const axios = require('axios');

const serverName = 'prod-ca-a.online.tableau.com';
const apiVersion = '3.20';
// const siteId = '4acb9da1-16cc-44df-8f76-3763ab900d90';
// const token = 'J8xDS0_aS6acX0457FjjNQ|BfCFnGz9xPGYRY8BfnNGfXZIY4yJxWuT|4acb9da1-16cc-44df-8f76-3763ab900d90';

const createProject = async (projectName, projectDescription, token, siteId) => {
    try {
        const payload = `
        <tsRequest>
            <project
                 name="${projectName}"
                 description="${projectDescription}"
            />
        </tsRequest>
        `;

        const headers = {
            'X-Tableau-Auth': token,
            'Content-Type': 'application/xml',
        };

        const response = await axios.post(`https://${serverName}/api/${apiVersion}/sites/${siteId}/projects`, payload, {
            headers: headers
        });

        return response.data.project;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = createProject;
