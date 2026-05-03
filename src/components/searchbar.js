import React, { Component } from 'react';
import{FiSearch} from 'react-icons/fi';
import {MdArrowDropDown} from 'react-icons/md'
import './searchbar.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row, Col } from 'react-bootstrap';
import { DiBingSmall } from "react-icons/di";

const ENGINE_LS = 'engine';
const Google_LS = 'gdisplay';
const Bing_LS = 'bdisplay';
const Duck_LS = 'ddisplay';
const Ecosia_LS = 'edisplay';

export default class Searchbar extends Component {
    constructor(props){
        super(props)
        this.state = {
          gdisplay: (localStorage.getItem(Google_LS)) || 'block',
          bdisplay: (localStorage.getItem(Bing_LS)) || 'none',
          ddisplay: (localStorage.getItem(Duck_LS)) || 'none',
          edisplay: (localStorage.getItem(Ecosia_LS)) || 'none',
          engine: (localStorage.getItem(ENGINE_LS))
        };
        this.handleload = this.handleload.bind(this);
      }
      handleg = () => {
          this.setState({gdisplay: 'block'})
          localStorage.setItem(Google_LS, 'block')
          this.setState({engine: this.state.gdisplay})
          this.setState({bdisplay: 'none'})
          localStorage.setItem(Bing_LS, 'none')
          this.setState({ddisplay: 'none'})
          localStorage.setItem(Duck_LS, 'none')
          this.setState({edisplay: 'none'})
          localStorage.setItem(Ecosia_LS, 'none')
          localStorage.setItem(ENGINE_LS, 'google')
      }
      handleb = () => {
        this.setState({gdisplay: 'none'})
        localStorage.setItem(Google_LS, 'none')
        this.setState({bdisplay: 'block'})
        localStorage.setItem(Bing_LS, 'block')
        this.setState({engine: this.state.bdisplay})
        this.setState({ddisplay: 'none'})
        localStorage.setItem(Duck_LS, 'none')
        this.setState({edisplay: 'none'})
        localStorage.setItem(Ecosia_LS, 'none')
        localStorage.setItem(ENGINE_LS, 'bing')
    }
        handled = () => {
            this.setState({gdisplay: 'none'})
            localStorage.setItem(Google_LS, 'none')
            this.setState({bdisplay: 'none'})
            localStorage.setItem(Bing_LS, 'none')
            this.setState({ddisplay: 'block'})
            localStorage.setItem(Duck_LS, 'block')
            this.setState({engine: this.state.ddisplay})
            this.setState({edisplay: 'none'})
            localStorage.setItem(Ecosia_LS, 'none')
            localStorage.setItem(ENGINE_LS, 'duckduckgo')
        }
        handlee = () => {
            this.setState({gdisplay: 'none'})
            localStorage.setItem(Google_LS, 'none')
            this.setState({bdisplay: 'none'})
            localStorage.setItem(Bing_LS, 'none')
            this.setState({ddisplay: 'none'})
            localStorage.setItem(Duck_LS, 'none')
            this.setState({edisplay: 'block'})
            localStorage.setItem(Ecosia_LS, 'block')
            this.setState({engine: this.state.edisplay})
            localStorage.setItem(ENGINE_LS, 'ecosia')
        }
        handleload = () =>{
            if (ENGINE_LS === 'bing'){
                this.setState({gdisplay: 'none'})
                this.setState({bdisplay: 'block'})
                localStorage.setItem(ENGINE_LS, 'bing')
                this.setState({engine: this.state.bdisplay})
                this.setState({ddisplay: 'none'})
                this.setState({edisplay: 'none'})
            }
            if (ENGINE_LS === 'duckduckgo'){
                this.setState({gdisplay: 'none'})
                this.setState({bdisplay: 'none'})
                this.setState({ddisplay: 'block'})
                localStorage.setItem(ENGINE_LS, 'duckduckgo')
                this.setState({engine: this.state.ddisplay})
                this.setState({edisplay: 'none'})
            }
            if (ENGINE_LS === 'ecosia'){
                this.setState({gdisplay: 'none'})
                this.setState({bdisplay: 'none'})
                this.setState({ddisplay: 'none'})
                this.setState({edisplay: 'block'})
                localStorage.setItem(ENGINE_LS, 'ecosia')
                this.setState({engine: this.state.edisplay})
            }
        }
    render() {
        return (
            <div className="searchbar-container" onLoad={this.handleload}>

                <form method="get" action="https://www.google.com/search?q=" target="_top" style={{display: this.state.gdisplay}}>
                    <div className="searchbar">
                        <input type="text" placeholder="Search Google" id="q" name="q" title="" alt="Search Text" maxLength="256" />
                        <button type="submit" id="searchsubmit">
                            <span id="searchsubmiticon"><FiSearch /></span>
                            <span id="searchsubmitimg"><img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="google-logo"/></span>
                        </button>
                        <Dropdown>
                        <Row>
                            <Col>
                            <Dropdown.Toggle variant="none" id="dropdown-basic">
                                <MdArrowDropDown />
                            </Dropdown.Toggle>
                            </Col>
                            
                            <Col>
                            <Dropdown.Menu>
                                <Dropdown.Header>SEARCH WITH</Dropdown.Header>
                                <Dropdown.Item><button onClick={this.handleg}><img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="google-logo"/> Google</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handleb}><DiBingSmall /> Bing</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handled}><img src="https://img.icons8.com/color/24/000000/duckduckgo--v1.png" alt="duckduckgo-logo"/> DuckDuckGo</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handlee}><img src="https://img.icons8.com/color/24/000000/ecosia.png" alt="ecosia-logo"/> Ecosia</button></Dropdown.Item>
                            </Dropdown.Menu>
                            </Col>
                        </Row>
                        </Dropdown>
                    </div>
                </form>

                <form method = "get" action="https://www.bing.com/search?q=" target="_top" style={{display: this.state.bdisplay}}>
                  <div className="searchbar">
                        <input type="text" placeholder="Search Bing" id="q" name="q" title="" alt="Search Text" maxLength="256" />
                        <button type="submit" id="searchsubmit">
                            <span id="searchsubmiticon"><FiSearch /></span>
                            <span id="searchsubmitimg"><DiBingSmall  style={{color: "#25828c", width: "16px", height: "16px"}}/></span>
                        </button>
                        <Dropdown>
                        <Row>
                            <Col>
                            <Dropdown.Toggle variant="none" id="dropdown-basic">
                                <MdArrowDropDown />
                            </Dropdown.Toggle>
                            </Col>
                            
                            <Col>
                            <Dropdown.Menu>
                                <Dropdown.Header>SEARCH WITH</Dropdown.Header>
                                <Dropdown.Item><button onClick={this.handleg}><img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="google-logo"/> Google</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handleb}><DiBingSmall /> Bing</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handled}><img src="https://img.icons8.com/color/24/000000/duckduckgo--v1.png" alt="duckduckgo-logo"/> DuckDuckGo</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handlee}><img src="https://img.icons8.com/color/24/000000/ecosia.png" alt="ecosia-logo"/> Ecosia</button></Dropdown.Item>
                            </Dropdown.Menu>
                            </Col>
                        </Row>
                        </Dropdown>
                  </div>
                </form>

                <form method = "get" action="https://www.duckduckgo.com/?q=" target="_top" style={{display: this.state.ddisplay}}>
                  <div className="searchbar">
                        <input type="text" placeholder="Search DuckDuckGo" id="q" name="q" title="" alt="Search Text" maxLength="256" />
                        <button type="submit" id="searchsubmit">
                            <span id="searchsubmiticon"><FiSearch /></span>
                            <span id="searchsubmitimg"><img src="https://img.icons8.com/color/16/000000/duckduckgo--v1.png" alt="duckduckgo-logo"/></span>
                        </button>
                        <Dropdown>
                        <Row>
                            <Col>
                            <Dropdown.Toggle variant="none" id="dropdown-basic">
                                <MdArrowDropDown />
                            </Dropdown.Toggle>
                            </Col>
                            
                            <Col>
                            <Dropdown.Menu>
                                <Dropdown.Header>SEARCH WITH</Dropdown.Header>
                                <Dropdown.Item><button onClick={this.handleg}><img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="google-logo"/> Google</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handleb}><DiBingSmall /> Bing</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handled}><img src="https://img.icons8.com/color/24/000000/duckduckgo--v1.png" alt="duckduckgo-logo"/> DuckDuckGo</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handlee}><img src="https://img.icons8.com/color/24/000000/ecosia.png" alt="ecosia-logo"/> Ecosia</button></Dropdown.Item>
                            </Dropdown.Menu>
                            </Col>
                        </Row>
                        </Dropdown>
                  </div>
                </form>
                
                <form method = "get" action="https://www.ecosia.org/search?q=" target="_top" style={{display: this.state.edisplay}}>
                  <div className="searchbar">
                        <input type="text" placeholder="Search Ecosia" id="q" name="q" title="" alt="Search Text" maxLength="256" required/>
                        <button type="submit" id="searchsubmit">
                            <span id="searchsubmiticon"><FiSearch /></span>
                            <span id="searchsubmitimg"><img src="https://img.icons8.com/color/16/000000/ecosia.png" alt="ecosia-logo"/></span>
                        </button>
                        <Dropdown>
                        <Row>
                            <Col>
                            <Dropdown.Toggle variant="none" id="dropdown-basic">
                                <MdArrowDropDown />
                            </Dropdown.Toggle>
                            </Col>
                            
                            <Col>
                            <Dropdown.Menu>
                                <Dropdown.Header>SEARCH WITH</Dropdown.Header>
                                <Dropdown.Item><button onClick={this.handleg}><img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="google-logo"/> Google</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handleb}><DiBingSmall /> Bing</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handled}><img src="https://img.icons8.com/color/24/000000/duckduckgo--v1.png" alt="duckduckgo-logo"/> DuckDuckGo</button></Dropdown.Item>
                                <Dropdown.Item><button onClick={this.handlee}><img src="https://img.icons8.com/color/24/000000/ecosia.png" alt="ecosia-logo"/> Ecosia</button></Dropdown.Item>
                            </Dropdown.Menu>
                            </Col>
                        </Row>
                        </Dropdown>
                  </div>
                </form>
            </div>   
        )
    }
}