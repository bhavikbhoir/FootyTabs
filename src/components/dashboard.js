import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './dashboard.css';

export default class Dashboard extends Component {
    state = {
        standings: [],
        scorers: [],
        matches: [],
        loading: true
    };

    componentDidMount() {
        // TheSportsDB - Free API, no key needed, no CORS issues
        const LEAGUE_ID = '4328'; // Premier League

        Promise.all([
            fetch(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${LEAGUE_ID}&s=2025-2026`),
            fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${LEAGUE_ID}`)
        ])
        .then(([standingsRes, matchesRes]) => 
            Promise.all([standingsRes.json(), matchesRes.json()])
        )
        .then(([standingsData, matchesData]) => {
            this.setState({
                standings: standingsData.table || [],
                matches: (matchesData.events || []).slice(0, 10),
                loading: false
            });
        })
        .catch(() => {
            this.setState({ loading: false });
        });
    }

    render() {
        const { standings, matches, loading } = this.state;

        if (loading) {
            return <div className="dashboard-loading">Loading Premier League data...</div>;
        }

        return (
            <Carousel>
                <Carousel.Item>
                    <div className="dashboard-widget">
                        <h3>Premier League Table 2025-26</h3>
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
                                    <tr key={idx}>
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

                <Carousel.Item>
                    <div className="dashboard-widget">
                        <h3>Upcoming Fixtures</h3>
                        <div className="matches-list">
                            {matches.length > 0 ? matches.map(match => (
                                <div key={match.idEvent} className="match-item">
                                    <div className="match-date">
                                        {match.dateEvent} - {match.strTime || 'TBD'}
                                    </div>
                                    <div className="match-teams">
                                        <span>{match.strHomeTeam}</span>
                                        <span className="vs">vs</span>
                                        <span>{match.strAwayTeam}</span>
                                    </div>
                                </div>
                            )) : <p>No upcoming fixtures available</p>}
                        </div>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div className="dashboard-widget">
                        <h3>About Premier League</h3>
                        <div className="info-content">
                            <p>The Premier League is the top tier of English football.</p>
                            <p><strong>Current Season:</strong> 2024-25</p>
                            <p><strong>Teams:</strong> 20</p>
                            <p><strong>Founded:</strong> 1992</p>
                            <p>Data provided by TheSportsDB</p>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
        );
    }
}
