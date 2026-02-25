import React from 'react';
import Modal from 'react-modal';
import { PREMIER_LEAGUE_TEAMS } from '../constants/teams';
import './settings.css';

const Settings = ({ isOpen, onClose, favoriteTeam, onTeamChange, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="settings-modal"
      overlayClassName="settings-overlay"
    >
      <div className="settings-content">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-section">
          <h3>Favorite Team</h3>
          <p className="settings-description">Choose your team to see personalized fixtures and stats</p>
          
          <select 
            value={favoriteTeam} 
            onChange={(e) => onTeamChange(e.target.value)}
            className="team-selector"
          >
            {PREMIER_LEAGUE_TEAMS.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-section">
          <h3>Account</h3>
          <button className="logout-btn" onClick={onLogout}>
            Clear Data & Reset
          </button>
          <p className="settings-description small">This will clear your name and preferences</p>
        </div>

        <div className="settings-footer">
          <button className="save-btn" onClick={onClose}>
            Save & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Settings;
