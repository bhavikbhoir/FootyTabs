import React, { Component } from 'react';
import Logovideo from '../assets/logo.mp4'

export default class Logo extends Component {
    render() {
        return (
            <div className="logovideo">
                <video src={Logovideo} autoPlay loop muted style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "50%"
                }}>
                </video>
            </div>
        )
    }
}
