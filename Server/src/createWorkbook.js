const axios = require('axios');
const fsp = require('fs/promises');
const fs = require('fs');
const FormData = require('form-data');
const http = require('http');
const https = require('follow-redirects').https;
const unirest = require('unirest');
const path = require('path');
const { parseString } = require("xml2js");

const serverName = 'prod-ca-a.online.tableau.com';
const apiVersion = '3.20';

const writeF = (xmlAbsolutePath, workbookName, projectId) => {
    return new Promise(function (resolve, reject) {
        fs.writeFile(
            xmlAbsolutePath,
            `<tsRequest>
                <workbook name="${workbookName}" showTabs="true" >
                <project id="${projectId}"/>
                </workbook>
            </tsRequest>`,
            err => {
                if (err) {
                    console.error(err);
                    reject(err)
                }
                else {
                    resolve('success');
                    console.error('file written successfully');
                }
            });
    });
}

const createWorkbook = async (workbookName, projectId, token, siteId) => {

    let xmlRelativePath = './templates/publish-workbook.xml';
    let twbxRelativePath = './templates/WORKBOOK.twbx';
    let xmlAbsolutePath = path.resolve(xmlRelativePath);

    await writeF(xmlAbsolutePath, workbookName, projectId);

    unirest('POST', `https://${serverName}/api/${apiVersion}/sites/${siteId}/workbooks`)
        .headers({
            'Content-Type': 'multipart/mixed;',
            'X-Tableau-Auth': token,
        })
        .attach('request_payload', xmlAbsolutePath)
        // .field('request_payload', `<tsRequest><workbook name="curl_test_5" showTabs="true"><project id=${projectId} /></workbook></tsRequest>`)
        .attach('tableau_workbook', path.resolve(twbxRelativePath))
        .end(function (res) {
            if (res.error) console.log(res.error);
            if (res.raw_body) {
                parseString(res.raw_body, (err, results) => {
                    console.log(results.tsResponse.workbook[0]['$'].id);
                });
            }
        });








    // return fsp.readFile('./MY_WORKBOOK.twbx').then(async (data) => {

    //     const url = `https://${serverName}/api/${apiVersion}/sites/${siteId}/workbooks?workbookType=twbx&overwrite=true`;

    //     var formData = new FormData();

    //     const xml_payload = `
    //         <tsRequest>
    //             <workbook name="test_create_workbook_2" showTabs="true">
    // 	            <project id=${projectId} />
    //             </workbook>
    //         </tsRequest>
    //     `;

    //     formData.append("tableau_workbook", data, {
    //         filename: 'MY_WORKBOOK.twbx',
    //         contentType: 'application/octet-stream'
    //     });

    //     // formData.append('request_payload', fs.createReadStream('/Users/amirhossein/Desktop/publish-workbook.xml'));

    //     formData.append("request_payload", fs.readFileSync('/Users/amirhossein/Desktop/publish-workbook.xml', "utf-8"), {
    //         filename: 'publish-workbook.xml',
    //         contentType: 'application/octet-stream'
    //     });

    //     // formData.append("request_payload", xml_payload, {
    //     //     filename: "",
    //     //     contentType: 'text/xml'
    //     // });

    //     const form_headers = formData.getHeaders()
    //     form_headers['content-type'] = form_headers['content-type'].replace('form-data', 'mixed')

    //     const headers = {
    //         // ...form_headers,
    //         'content-type': 'multipart/mixed;',
    //         'X-Tableau-Auth': token,
    //     };
    //     console.log(headers);

    //     const response = await fetch(url, {
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         // mode: "cors", // no-cors, *cors, same-origin
    //         // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         // credentials: "same-origin", // include, *same-origin, omit
    //         headers,
    //         // redirect: "follow", // manual, *follow, error
    //         // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: formData, // body data type must match "Content-Type" header
    //     });

    //     console.log(await response.text());

    // #######################################

    // formData.append("request_payload", new Blob([xml_payload], { type: 'text/xml' }), {

    //     filename: "",

    //     contentType: 'text/xml'

    // });

    // formData.append("tableau_workbook", new Blob([data], { type: '' }), {

    //     filename: 'MY_WORKBOOK.twbx',

    //     contentType: 'application/octet-stream'

    // });

    // const form_headers = form.getHeaders()

    // form_headers['content-type'] = form_headers['content-type'].replace('form-data', 'mixed')
    // form_headers['X-Tableau-Auth'] = 'jLUjSOJxT_Kbw97lD8fKvQ|G3LMPCVb1cSsK0ZmvX3AUHGWMNaS8PeW|0258da8c-fa89-4927-ae67-bc5eadb2012e'

    // const headers = {
    //     'X-Tableau-Auth': 'jLUjSOJxT_Kbw97lD8fKvQ|G3LMPCVb1cSsK0ZmvX3AUHGWMNaS8PeW|0258da8c-fa89-4927-ae67-bc5eadb2012e',
    //     'Content-Type': `multipart/mixed; boundary=${formData._boundary}`,
    // };

    // return axios.post(url, formData, { headers });


    // HTTP REQ
    // const options = {
    //     hostname: serverName,
    //     path: `/api/${apiVersion}/sites/${siteId}/workbooks?workbookType=twbx&overwrite=true`,
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': `multipart/mixed; boundary=${formData._boundary}`,
    //         'X-Tableau-Auth': token,
    //     },
    // };

    // const req = http.request(options, (res) => {
    //     let data = '';

    //     res.on('data', (chunk) => {
    //         data += chunk;
    //     });

    //     res.on('end', () => {
    //         console.log('Response:', data);
    //     });
    // });


    // req.on('error', (error) => {
    //     console.error('Error:', error);
    // });

    // // formData.pipe(req);

    // req.write(formData);
    // req.end();

    // catch ####################################
    // }).catch (error => {

    //     console.log("publishing failed")

    //     if ('response' in error && 'status' in error['response']) {

    //         console.log(error['response']['status'], error['response']['statusText'])

    //         console.log(error['response']['data'])

    //     } else {

    //         console.log(error)

    //     }

    // })

}




// async function createWorkbook() {
//     try {

//         const payload = `
//         <tsRequest>
//             <workbook name="test_create_workbook_1" showTabs="true" >
//             <project id="95814f8e-1046-4200-b7e0-ab162a075535"/>
//             <views>
//             <view />
//             </views>
//             </workbook>
//         </tsRequest>
//         `;

//         const filePath = './MY_WORKBOOK.twbx';

//         const fileData = fs.readFileSync(filePath);

//         const formData = new FormData();
//         formData.append('tableau_workbook', fileData);
//         formData.append('request_payload', payload);


//         const headers = {
//             'X-Tableau-Auth': 'jLUjSOJxT_Kbw97lD8fKvQ|G3LMPCVb1cSsK0ZmvX3AUHGWMNaS8PeW|0258da8c-fa89-4927-ae67-bc5eadb2012e',
//             'Content-Type': 'multipart/mixed',
//         };

//         const response = await axios.post(`https://${serverName}/api/${apiVersion}/sites/${siteId}/workbooks`, payload, {
//             headers: headers
//         });

//         console.log(response.data);
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

module.exports = createWorkbook;