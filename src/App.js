import React, {Component} from 'react';
import {DateTime} from 'luxon';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import '../src/components/styles.css';
import '../src/styles/dark-mode.css';
import {FiSettings} from 'react-icons/fi';
import Dropdown from 'react-bootstrap/Dropdown';
import Dashboard from '../src/components/dashboard';
import Searchbar from '../src/components/searchbar';
import Trialname from '../src/components/trialname';
import Logo from './components/logo';
import Settings from './components/Settings';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';
import { DEFAULT_TEAM } from './constants/teams';
import { DEFAULT_LEAGUE } from './constants/leagues';


const JNAME_LS = 'JNAME_LS';
const TEAM_LS = 'TEAM_LS';
const DARK_MODE_LS = 'DARK_MODE';
const LEAGUE_LS = 'LEAGUE';

const customStyles = {
  content: {
    width: '400px',
    height: '400px',
    opacity: '0.9',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderColor: '#0080ff',
    background: 'none',
    border: 'none'
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    var time = this.getTime();

    this.state = {
      time,
      name: '',
      isNameRequired: false,
      salutation: this.determineSalutation(time.hour),
      quote: null,
      geolocation: {
        latitude: null,
        longitude: null
      },
      location: null,
      temperature: null,
      weatherAPIKey: process.env.REACT_APP_WEATHER_API_KEY,
      weatherIcon: null,
      modalIsOpen: false,
      inputValue: '',
      favoriteTeam: localStorage.getItem(TEAM_LS) || DEFAULT_TEAM,
      selectedLeague: localStorage.getItem(LEAGUE_LS) || DEFAULT_LEAGUE,
      settingsOpen: false,
      useFahrenheit: localStorage.getItem('TEMP_UNIT') === 'F',
      weatherDescription: null,
      darkMode: localStorage.getItem(DARK_MODE_LS) === 'true'
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.toggleTempUnit = this.toggleTempUnit.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.handleLeagueChange = this.handleLeagueChange.bind(this);
  }

  handleLeagueChange(leagueId) {
    this.setState({ selectedLeague: leagueId });
    localStorage.setItem(LEAGUE_LS, leagueId);
  }

  toggleDarkMode() {
    const newMode = !this.state.darkMode;
    this.setState({ darkMode: newMode });
    localStorage.setItem(DARK_MODE_LS, newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
  }

  toggleTempUnit() {
    const newUnit = !this.state.useFahrenheit;
    this.setState({ useFahrenheit: newUnit });
    localStorage.setItem('TEMP_UNIT', newUnit ? 'F' : 'C');
  }

  toggleSettings() {
    this.setState({ settingsOpen: !this.state.settingsOpen });
  }

  handleTeamChange(teamId) {
    this.setState({ favoriteTeam: teamId });
    localStorage.setItem(TEAM_LS, teamId);
  }

  closeModal() {
    this.setState({name: this.state.inputValue});
    localStorage.setItem(JNAME_LS, this.state.inputValue);
    this.setState({modalIsOpen: false});
    
  }

  handleChange(e) {
    this.setState({inputValue: e.target.value});
  }

  componentDidMount() {
    // Apply dark mode on mount
    if (this.state.darkMode) {
      document.body.classList.add('dark-mode');
    }

    navigator.geolocation.getCurrentPosition(
      position =>
        this.setState(
          {
            geolocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
          () => this.updateWeather()
        ),
      () => {
        // Geolocation denied - app will work without weather
      }
    );
    Modal.setAppElement('body');

    const name = localStorage.getItem(JNAME_LS);
    if (name) {
      this.setState({name});
    } else {
      this.setState({modalIsOpen: true});
    }

    // Set fallback quote immediately
    this.setState({quote: 'Stay focused and never give up!'});
    
    // Try to fetch a better quote, but don't worry if it fails
    fetch('https://api.quotable.io/random')
      .then(resp => {
        if (resp.ok) return resp.json();
        throw new Error('API unavailable');
      })
      .then(resp => this.setState({quote: resp.content}))
      .catch(() => {
        // Silently fail - fallback quote already set
      });

    setInterval(() => {
      var time = DateTime.local();
      this.setState({
        time,
        salutation: this.determineSalutation(time.hour)
      });
    }, 1000 * 1);

    // Log page view to Firebase Analytics
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'FootyTabs Home',
        page_location: window.location.href
      });
    }
  }

  determineSalutation(hour) {
    if (hour > 11 && hour < 19) {
      return 'afternoon';
    } else if (hour > 18) {
      return 'evening';
    } else {
      return 'morning';
    }
  }

  determineWeatherCondition(str) {
    switch (str) {
      case 'Rain':
        return 'wi-day-rain';
      case 'Thunderstorm':
        return 'wi-day-thunderstorm';
      case 'Drizzle':
        return 'wi-day-showers';
      case 'Extreme':
        return 'wi-day-snow-thunderstorm';
      case 'Snow':
        return 'wi-day-snow';
      case 'Clouds':
        return 'wi-day-cloudy';
      case 'Clear':
        return 'wi-day-sunny';
      default:
        return null;
    }
  }

  updateWeather() {
    if (!this.state.weatherAPIKey) return;
    
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?APPID=${
        this.state.weatherAPIKey
      }&lat=${this.state.geolocation.latitude}&lon=${
        this.state.geolocation.longitude
      }`
    )
      .then(resp => resp.json())
      .then(resp => {
        const tempC = Math.round(resp.main.temp - 273.15);
        this.setState({
          location: resp.name,
          temperature: tempC,
          weatherIcon: this.determineWeatherCondition(resp.weather[0].main),
          weatherDescription: resp.weather[0].description
        });
      })
      .catch(() => {
        // Silently fail if weather API is unavailable
      });
  }

  getTime() {
    return DateTime.local();
  }

  getBGStyle(category = 'HK') {
    return {
      backgroundImage: `url(${require('./assets/grass.jpg')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
      opacity: '0.9'
    }
  }

  logout = () => {
    this.setState({name: ''});
    localStorage.setItem(JNAME_LS, this.state.name);
    localStorage.clear();
    this.setState({modalIsOpen: true});
  }

  render() {
    return (
      <div style={this.getBGStyle(this.state.category)}>
        <div className="bg-wrapper">
          
        <div className="top-left">
          <div>
            <Logo />
          </div>
            <div>
              <p>Welcome {this.state.name}</p>
              <Trialname />
            </div>
          </div>

          <div className="text-right top-right weather">
            {this.state.temperature !== null ? (
              <>
                <div className="weather-main">
                  <i className={`wi ${this.state.weatherIcon}`} />
                  <span className="temp-value">
                    {this.state.useFahrenheit 
                      ? Math.round(this.state.temperature * 9/5 + 32)
                      : this.state.temperature}°
                  </span>
                  <button className="temp-toggle" onClick={this.toggleTempUnit}>
                    {this.state.useFahrenheit ? 'F' : 'C'}
                  </button>
                </div>
                {this.state.weatherDescription && (
                  <p className="weather-desc">{this.state.weatherDescription}</p>
                )}
                <h5 id="location">{this.state.location}</h5>
              </>
            ) : (
              <div className="weather-unavailable">
                <i className="wi wi-na" />
                <p>Weather unavailable</p>
              </div>
            )}
          </div>
          <div className="text-center centered">
            <div className="block-text">
              <h1 id="time">{this.state.time.toFormat("h':'mm")}</h1>
              <h2 id="ampm">{this.state.time.toFormat('a')}</h2>
            </div>
            <h3 id="greetings">
              Good {this.state.salutation}, {this.state.name}
            </h3>
            <Searchbar />
            <Modal
              isOpen={this.state.modalIsOpen}
              style={customStyles}
              contentLabel="name-modal"
            >
              <div>
                  <Logo />
                </div>
              <div className="modal-content">
                
                <div className="modal-title">What's your Jersey Name?</div>
                  <div className="modal-input" >
                    <input name="name" type="text" onChange={this.handleChange}/>
                  </div>
                  <div className="modal-btn">
                    <button className="modal-button" onClick={this.closeModal}>
                      Enter
                    </button>
                  </div>
              </div>
            </Modal>
          </div>
          <div className="center-right dashboard">
            <h3>Your dashboard</h3>
            <Dashboard 
              favoriteTeam={this.state.favoriteTeam} 
              selectedLeague={this.state.selectedLeague}
            />
          </div>
          <div className="text-center bottom-third quote">
            <div id="quote-text">{this.state.quote}</div>
          </div>
          <div className="text-right bottom-right">
          <button 
            className="settings-icon-btn" 
            onClick={this.toggleSettings}
            title="Settings"
          >
            <FiSettings />
          </button>
          <Settings
            isOpen={this.state.settingsOpen}
            onClose={this.toggleSettings}
            favoriteTeam={this.state.favoriteTeam}
            onTeamChange={this.handleTeamChange}
            selectedLeague={this.state.selectedLeague}
            onLeagueChange={this.handleLeagueChange}
            onLogout={this.logout}
            darkMode={this.state.darkMode}
            onToggleDarkMode={this.toggleDarkMode}
          />
          </div>
        </div>
      </div>
    );
  }
}

export default App;