import { useState } from 'react';
import api from '../../../utils/api';

const ShareModal = ({ boardId, onClose }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    try {
      setIsLoading(true);
      await api.post(`/boards/${boardId}/share`, { email, permission });
      alert('Tableau partagé avec succès!');
      onClose();
    } catch (err) {
      alert(`Erreur: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="share-modal">
        <h3>Partager ce tableau</h3>
        <input
          type="email"
          placeholder="Email du collaborateur"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="view">Visualisation seule</option>
          <option value="edit">Édition complète</option>
        </select>
        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button 
            onClick={handleShare}
            disabled={!email || isLoading}
          >
            {isLoading ? 'Envoi...' : 'Partager'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;