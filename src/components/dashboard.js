import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './dashboard.css';

export default class Dashboard extends Component {
    state = {
        standings: [],
        matches: [],
        lastMatches: [],
        teamInfo: null,
        loading: true,
        lastUpdated: null,
        refreshInterval: null,
        currentTeamId: null
    };

    componentDidMount() {
        this.fetchData();
        // Auto-refresh every 30 minutes
        const interval = setInterval(() => this.fetchData(), 30 * 60 * 1000);
        this.setState({ refreshInterval: interval });
    }

    componentWillUnmount() {
        if (this.state.refreshInterval) {
            clearInterval(this.state.refreshInterval);
        }
    }

    componentDidUpdate(prevProps) {
        // Refresh when team or league changes
        if (prevProps.favoriteTeam !== this.props.favoriteTeam || 
            prevProps.selectedLeague !== this.props.selectedLeague) {
            // Clear old team data immediately
            this.setState({ 
                teamInfo: null,
                lastMatches: [],
                currentTeamId: null
            });
            // Add delay to avoid rate limiting
            setTimeout(() => this.fetchData(), 1000);
        }
    }

    fetchData = () => {
        const { selectedLeague, favoriteTeam } = this.props;
        const LEAGUE_ID = selectedLeague || '4328';

        this.setState({ loading: true });

        Promise.all([
            fetch(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${LEAGUE_ID}&s=2025-2026`),
            fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${LEAGUE_ID}`),
            fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${favoriteTeam}`),
            fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${favoriteTeam}`)
        ])
        .then(([standingsRes, matchesRes, lastMatchesRes, teamRes]) => 
            Promise.all([standingsRes.json(), matchesRes.json(), lastMatchesRes.json(), teamRes.json()])
        )
        .then(([standingsData, matchesData, lastMatchesData, teamData]) => {
            // Ensure we're using the current favoriteTeam
            const currentTeam = this.props.favoriteTeam;
            this.setState({
                standings: standingsData.table || [],
                matches: (matchesData.events || []).slice(0, 15),
                lastMatches: (lastMatchesData.results || []).slice(0, 5),
                teamInfo: teamData.teams?.[0] || null,
                loading: false,
                lastUpdated: new Date(),
                currentTeamId: currentTeam
            });
        })
        .catch(() => {
            this.setState({ loading: false });
        });
    }

    getTimeSinceUpdate = () => {
        if (!this.state.lastUpdated) return '';
        const minutes = Math.floor((new Date() - this.state.lastUpdated) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 min ago';
        return `${minutes} mins ago`;
    }

    getMatchResult = (match, teamId) => {
        if (!match.intHomeScore || !match.intAwayScore) return null;
        
        const isHome = match.idHomeTeam === teamId;
        const teamScore = isHome ? parseInt(match.intHomeScore) : parseInt(match.intAwayScore);
        const oppScore = isHome ? parseInt(match.intAwayScore) : parseInt(match.intHomeScore);
        
        if (teamScore > oppScore) return 'W';
        if (teamScore < oppScore) return 'L';
        return 'D';
    }

    render() {
        const { standings, matches, lastMatches, teamInfo, loading, currentTeamId } = this.state;
        const { favoriteTeam, selectedLeague } = this.props;
        
        // Use currentTeamId from state to ensure data consistency
        const activeTeamId = currentTeamId || favoriteTeam;

        // Get league name
        const LEAGUES = [
            { id: '4328', name: 'Premier League' },
            { id: '4335', name: 'La Liga' },
            { id: '4332', name: 'Serie A' },
            { id: '4331', name: 'Bundesliga' },
            { id: '4334', name: 'Ligue 1' }
        ];
        const currentLeague = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];

        if (loading && !standings.length) {
            return <div className="dashboard-loading">Loading {currentLeague.name} data...</div>;
        }

        // Filter matches for favorite team
        const teamMatches = matches.filter(m => 
            m.idHomeTeam === activeTeamId || m.idAwayTeam === activeTeamId
        ).slice(0, 10);

        // Get team's position in table
        const teamStanding = standings.find(t => t.idTeam === activeTeamId);
        
        // Get team name - only use teamInfo if it matches the active team
        const teamInfoMatches = teamInfo?.idTeam === activeTeamId;
        const teamName = (teamInfoMatches ? teamInfo?.strTeam : null) || teamStanding?.strTeam || 'Your Team';

        return (
            <div>
                <div className="dashboard-header">
                    <span className="last-updated">{this.getTimeSinceUpdate()}</span>
                    <button className="refresh-btn" onClick={this.fetchData} title="Refresh">
                        ↻
                    </button>
                </div>
                <Carousel>
                    {/* Team Overview */}
                    {teamStanding && (
                        <Carousel.Item>
                            <div className="dashboard-widget">
                                <h3>{teamName}</h3>
                                <div className="team-overview">
                                    <div className="team-stat">
                                        <div className="stat-label">Position</div>
                                        <div className="stat-value">{teamStanding.intRank}</div>
                                    </div>
                                    <div className="team-stat">
                                        <div className="stat-label">Points</div>
                                        <div className="stat-value">{teamStanding.intPoints}</div>
                                    </div>
                                    <div className="team-stat">
                                        <div className="stat-label">Played</div>
                                        <div className="stat-value">{teamStanding.intPlayed}</div>
                                    </div>
                                    <div className="team-stat">
                                        <div className="stat-label">Form</div>
                                        <div className="stat-value form-string">{teamStanding.strForm || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="team-record">
                                    <span className="record-item win">W: {teamStanding.intWin}</span>
                                    <span className="record-item draw">D: {teamStanding.intDraw}</span>
                                    <span className="record-item loss">L: {teamStanding.intLoss}</span>
                                    <span className="record-item">GD: {teamStanding.intGoalDifference}</span>
                                </div>
                            </div>
                        </Carousel.Item>
                    )}

                    {/* Recent Results */}
                    {lastMatches.length > 0 && (
                        <Carousel.Item>
                            <div className="dashboard-widget">
                                <h3>Recent Results</h3>
                                <div className="matches-list">
                                    {lastMatches.map(match => {
                                        const result = this.getMatchResult(match, favoriteTeam);
                                        const isHome = match.idHomeTeam === activeTeamId;
                                        return (
                                            <div key={match.idEvent} className="match-item result-item">
                                                <div className="match-date">
                                                    {match.dateEvent}
                                                </div>
                                                <div className="match-teams">
                                                    <span className={isHome ? 'team-bold' : ''}>{match.strHomeTeam}</span>
                                                    <span className="score">{match.intHomeScore} - {match.intAwayScore}</span>
                                                    <span className={!isHome ? 'team-bold' : ''}>{match.strAwayTeam}</span>
                                                </div>
                                                {result && <span className={`result-badge ${result.toLowerCase()}`}>{result}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Carousel.Item>
                    )}

                    {/* Upcoming Fixtures */}
                    {teamMatches.length > 0 && (
                        <Carousel.Item>
                            <div className="dashboard-widget">
                                <h3>Upcoming Fixtures</h3>
                                <div className="matches-list">
                                    {teamMatches.map(match => {
                                        const isHome = match.idHomeTeam === activeTeamId;
                                        return (
                                            <div key={match.idEvent} className="match-item favorite-match">
                                                <div className="match-date">
                                                    {match.dateEvent} - {match.strTime || 'TBD'}
                                                </div>
                                                <div className="match-teams">
                                                    <span className={isHome ? 'team-bold' : ''}>{match.strHomeTeam}</span>
                                                    <span className="vs">vs</span>
                                                    <span className={!isHome ? 'team-bold' : ''}>{match.strAwayTeam}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Carousel.Item>
                    )}

                    {/* League Table */}
                    <Carousel.Item>
                        <div className="dashboard-widget">
                            <h3>{currentLeague.name} Table</h3>
                            <table className="standings-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Team</th>
                                        <th>P</th>
                                        <th>W</th>
                                        <th>D</th>
                                        <th>L</th>
                                        <th>Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((team, idx) => (
                                        <tr key={idx} className={team.idTeam === activeTeamId ? 'favorite-team' : ''}>
                                            <td>{team.intRank || idx + 1}</td>
                                            <td className="team-name">{team.strTeam}</td>
                                            <td>{team.intPlayed}</td>
                                            <td>{team.intWin}</td>
                                            <td>{team.intDraw}</td>
                                            <td>{team.intLoss}</td>
                                            <td><strong>{team.intPoints}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Carousel.Item>

                    {/* All Team Fixtures */}
                    {teamMatches.length > 5 && (
                        <Carousel.Item>
                            <div className="dashboard-widget">
                                <h3>All {teamName} Fixtures</h3>
                                <div className="matches-list">
                                    {teamMatches.map(match => {
                                        const isHome = match.idHomeTeam === activeTeamId;
                                        return (
                                            <div key={match.idEvent} className="match-item favorite-match">
                                                <div className="match-date">
                                                    {match.dateEvent} - {match.strTime || 'TBD'}
                                                </div>
                                                <div className="match-teams">
                                                    <span className={isHome ? 'team-bold' : ''}>{match.strHomeTeam}</span>
                                                    <span className="vs">vs</span>
                                                    <span className={!isHome ? 'team-bold' : ''}>{match.strAwayTeam}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Carousel.Item>
                    )}
                </Carousel>
            </div>
        );
    }
}
