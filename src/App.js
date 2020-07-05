// import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import Landingpage from './components/landingpage';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">  
//         <Landingpage />   
//       </div>
//     );
//   }
// }

// export default App;

import React, {Component} from 'react';
import {DateTime} from 'luxon';
import Modal from 'react-modal';
import '../src/components//styles.css';
import {FiSettings} from 'react-icons/fi';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Dashboard from '../src/components/dashboard';
import Searchbar from '../src/components/searchbar';
// import Header from './Header';
import Trialname from '../src/components/trialname';
import Logo from './components/logo';


const JNAME_LS = 'JNAME_LS';

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
      weatherAPIKey: '594d083c4f45203a1d8cf6c1f7dd0a0b',
      weatherIcon: null,
      modalIsOpen: false,
      inputValue: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  closeModal() {
    this.setState({name: this.state.inputValue});
    localStorage.setItem(JNAME_LS, this.state.inputValue);
    this.setState({modalIsOpen: false});
    
  }

  handleChange(e) {
    this.setState({inputValue: e.target.value});
  }

  componentWillMount() {
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
        throw 'Error occured!';
      }
    );
    Modal.setAppElement('body');
  }

  componentDidMount() {
    const name = localStorage.getItem(JNAME_LS);
    if (name) {
      this.setState({name});
    } else {
      this.setState({modalIsOpen: true});
    }

    fetch('https://horizonshq.herokuapp.com/api/inspirationalquotes')
      .then(resp => resp.json())
      .then(resp => this.setState({quote: resp.message}));

    setInterval(() => {
      var time = DateTime.local();
      this.setState({
        time,
        salutation: this.determineSalutation(time.hour)
      });
    }, 1000 * 1);
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
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?APPID=${
        this.state.weatherAPIKey
      }&lat=${this.state.geolocation.latitude}&lon=${
        this.state.geolocation.longitude
      }`
    )
      .then(resp => resp.json())
      .then(resp =>
        this.setState({
          location: resp.name,
          temperature: Math.round(resp.main.temp - 273.15),
          weatherIcon: this.determineWeatherCondition(resp.weather[0].main)
        })
      );
  }

  getTime() {
    return DateTime.local();
  }

  getBGStyle(category = 'HK') {
    return {
    //   backgroundImage: `url(https://source.unsplash.com/collection/10767820/1920x1080/daily?${category})`,
      backgroundImage: `url(https://source.unsplash.com/lBhhnhndpE0/1920x1080/`,
      backgroundSize: 'cover',
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
            <div>
              <i className={`wi ${this.state.weatherIcon}`} />&nbsp;<span id="weather" />
              {this.state.temperature}&#8451;
            </div>
            <h5 id="location">{this.state.location}</h5>
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
            <Dashboard />
          </div>
          <div className="text-center bottom-third quote">
            <div id="quote-text">{this.state.quote}</div>
          </div>
          <div className="text-right bottom-right">
          <Dropdown id="settings">
            <Dropdown.Toggle>
            <FiSettings/>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="1" onClick={this.logout}>Logout</Dropdown.Item>
              {/* <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
              <Dropdown.Item eventKey="3" active>
                Orange
              </Dropdown.Item>
              <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
            {/* <div id="settings">
              <button><i class="FiSettings"><FiSettings/></i> Settings</button>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;