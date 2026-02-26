import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { LEAGUES } from '../constants/leagues';
import './settings.css';

const Settings = ({ isOpen, onClose, favoriteTeam, onTeamChange, selectedLeague, onLeagueChange, onLogout, darkMode, onToggleDarkMode }) => {
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    if (selectedLeague && isOpen) {
      fetchLeagueTeams(selectedLeague);
    }
  }, [selectedLeague, isOpen]);

  const fetchLeagueTeams = async (leagueId) => {
    setLoadingTeams(true);
    try {
      const league = LEAGUES.find(l => l.id === leagueId);
      const leagueName = league ? league.fullName : 'English Premier League';
      
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${encodeURIComponent(leagueName)}`);
      const data = await response.json();
      
      if (data.teams) {
        const teams = data.teams
          .map(t => ({ idTeam: t.idTeam, strTeam: t.strTeam }))
          .sort((a, b) => a.strTeam.localeCompare(b.strTeam));
        
        setLeagueTeams(teams);
        
        const currentTeamInLeague = teams.find(t => t.idTeam === favoriteTeam);
        if (!currentTeamInLeague && teams.length > 0) {
          onTeamChange(teams[0].idTeam);
        }
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
    setLoadingTeams(false);
  };

  const handleLeagueChange = (leagueId) => {
    onLeagueChange(leagueId);
  };
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
          <h3>League</h3>
          <p className="settings-description">Choose which league to follow</p>
          
          <select 
            value={selectedLeague} 
            onChange={(e) => handleLeagueChange(e.target.value)}
            className="team-selector"
          >
            {LEAGUES.map(league => (
              <option key={league.id} value={league.id}>
                {league.name} ({league.country})
              </option>
            ))}
          </select>
        </div>

        <div className="settings-section">
          <h3>Favorite Team</h3>
          <p className="settings-description">Select your favorite team from {LEAGUES.find(l => l.id === selectedLeague)?.name || 'the league'}</p>
          
          {loadingTeams ? (
            <p>Loading teams...</p>
          ) : (
            <select 
              value={favoriteTeam} 
              onChange={(e) => onTeamChange(e.target.value)}
              className="team-selector"
            >
              {leagueTeams.map(team => (
                <option key={team.idTeam} value={team.idTeam}>
                  {team.strTeam}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="toggle-option">
            <div>
              <span>Dark Mode</span>
              <p className="settings-description small">Switch between light and dark theme</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                id="dark-mode-toggle"
                checked={darkMode}
                onChange={onToggleDarkMode}
              />
              <span className="slider"></span>
            </label>
          </div>
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
