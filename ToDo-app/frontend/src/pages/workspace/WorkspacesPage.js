import React from 'react';
import WorkspaceList from '../../components/Workspace/WorkspaceList';
import './WorkspacesPage.css';

const WorkspacesPage = () => {
  return (
    <div className="workspaces-page">
      <div className="page-header">
        <h1>Espaces de Travail</h1>
        <p>Gérez vos espaces de travail et accédez à vos tableaux</p>
      </div>
      
      <WorkspaceList />
    </div>
  );
};

export default WorkspacesPage;