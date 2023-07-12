/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const inputRef = useRef(null);
  const [file, setFile] = useState('');
  const [projects, setProjects] = useState([]);
  const [workbooks, setWorkbooks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedWorkbook, setSelectedWorkbook] = useState('');
  const [selectedView, setSelectedView] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [workbookName, setWorkbookName] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketToken, setToken] = useState('');

  const onPublish = () => {
    setLoading(true);
    const body = new FormData();

    body.append('file', file);
    body.append('projectId', selectedProject);
    body.append('projectName', projectName);
    body.append('projectDescription', projectDescription);
    body.append('workbookName', workbookName);

    fetch('http://localhost:8000/publish', {
      method: 'POST',
      body,
    })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const getProjects = async () => {
    setLoading(true);

    await fetch('http://localhost:8000/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        response.json().then(({ data }) => {
          setLoading(false);
          setProjects(data);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const getWorkbooks = async () => {
    setLoading(true);

    await fetch('http://localhost:8000/workbooks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        response.json().then(({ data }) => {
          setLoading(false);
          setWorkbooks(data);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const getSelectedWorkbook = async (id) => {
    setLoading(true);

    await fetch(`http://localhost:8000/workbooks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        response.json().then(({ data }) => {
          setSelectedWorkbook(data.workbook);
          setToken(data.jwtToken);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    getProjects();
    getWorkbooks();
  }, []);

  return (
    <>
      {loading && (<div>loading</div>)}
      <select style={{ width: 300 }} onChange={(e) => setSelectedProject(e.target.value)}>
        <option disabled selected>Select</option>
        {projects?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name" />
      <input value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Project description" />
      <input value={workbookName} onChange={(e) => setWorkbookName(e.target.value)} placeholder="Workbook name" />
      <input
        ref={inputRef}
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="button" onClick={onPublish}>Publish</button>

      {!selectedWorkbook && (
        <>
          <h2>Workbooks list</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {workbooks.map((p) => (
              <div style={{ boxShadow: '10px 10px 10px #ccc', marginLeft: 20, marginTop: 20, width: 300, padding: 20, borderRadius: 10 }}>
                <p>{p.name}</p>
                <p>{`project: ${p.project.name}`}</p>
                <button type="button" onClick={() => getSelectedWorkbook(p.id)}>Select</button>
              </div>
            ))}
          </div>
        </>
      )}

      {(selectedWorkbook && !selectedView) && (
        <>
          <h2>{`${selectedWorkbook.name} view's list`}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedWorkbook?.views?.view.map((v) => (
              <div style={{ boxShadow: '10px 10px 10px #ccc', marginLeft: 20, marginTop: 20, width: 300, padding: 20, borderRadius: 10 }}>
                <p>{v.name}</p>
                <button type="button" onClick={() => setSelectedView(v.name)}>View</button>
              </div>
            ))}
          </div>
        </>
      )}

      {(selectedView && ticketToken) && (
        <tableau-viz
          id="tableauViz"
          width="1000"
          height="1000"
          hide-tabs={false}
          touch-optimize={false}
          disable-url-actions={false}
          debug={false}
          src={`https://prod-ca-a.online.tableau.com/t/cato2/views/${selectedWorkbook.name}/${selectedView.replace(/ /g, '')}`}
          device="Desktop"
          toolbar="bottom"
          token={ticketToken}
        />
      )}
    </>
  );
};

export default App;
