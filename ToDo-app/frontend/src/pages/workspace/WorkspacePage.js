import { useState, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import api from '../../utils/api';
import BoardList from './components/BoardList';

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get(`/workspaces/${workspaceId}/boards`);
        setBoards(response.data);
      } catch (err) {
        console.error('Failed to fetch boards:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, [workspaceId]);

  if (isLoading) return <div>Loading workspace...</div>;

  return (
    <div className="workspace-container">
      <aside className="workspace-sidebar">
        <h2>Mes Tableaux</h2>
        <BoardList boards={boards} workspaceId={workspaceId} />
        <button onClick={() => createNewBoard(workspaceId)}>
          + Nouveau tableau
        </button>
      </aside>

      <main className="workspace-content">
        <Outlet /> 
      </main>
    </div>
  );
}