const express = require('express');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const Login = require('./login');
const CreateProject = require('./createProject');
const CreateWorkbook = require('./createWorkbook');
const GetProjects = require('./getProjects');
const GetWorkbooks = require('./getWorkbooks');
const GetWorkbook = require('./getWorkbook');
const GenerateToken = require('./generateToken');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(fileupload());
// app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())

app.post('/publish', async (req, res) => {
    try {
        const { projectId, workbookName, projectName, projectDescription } = req.body;
        let project = projectId;
        const workbookFile = req.files.file;

        workbookFile.mv(`${__dirname}/templates/WORKBOOK.twbx`, (err) => {
            if (err) {
                res.status(500).send({ message: "File upload failed", code: 200 });
            }
        });

        const user = await Login();
        const { token, site } = user.credentials;
        console.log(token);
        if (!projectId) {
            const newProject = await CreateProject(projectName, projectDescription, token, site.id);
            project = newProject.id;
        }
        console.log(project);
        await CreateWorkbook(workbookName, project, token, site.id);
        res.status(200).send({ message: "File Uploaded", code: 200 });
    }
    catch {
        res.status(400).send({ message: "File Not Uploaded", code: 400 });
    }
});

app.get('/projects', async (req, res) => {
    try {
        const user = await Login();
        const { token, site } = user.credentials;
        const projects = await GetProjects(token, site.id);
        res.status(200).send({ status: "success", data: projects });
    }
    catch {
        res.status(400).send({ message: "Bad request", code: 400 });
    }
});

app.get('/workbooks', async (req, res) => {
    try {
        const user = await Login();
        const { token, site } = user.credentials;
        const workbooks = await GetWorkbooks(token, site.id);
        res.status(200).send({ status: "success", data: workbooks });
    }
    catch {
        res.status(400).send({ message: "Bad request", code: 400 });
    }
});

app.get('/workbooks/:id', async (req, res) => {
    try {
        const { id: workbookId } = req.params;
        const user = await Login();
        const { token, site } = user.credentials;
        const workbook = await GetWorkbook(token, site.id, workbookId);
        const jwtToken = await GenerateToken();
        res.status(200).send({ status: "success", data: { workbook, jwtToken } });
    }
    catch {
        res.status(400).send({ message: "Bad request", code: 400 });
    }
});

const port = 8000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});