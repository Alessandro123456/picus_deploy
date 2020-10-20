import React, { Component } from 'react';
import closeIcon from './../assets/close-icon.png';
import logo from './../assets/chatbot.png'

class Header extends Component {

  render() {
    return (
      <div className="sc-header" style={{background: "#2ca8ff"}}>
        <img className="sc-header--img" src={logo} alt="" style= {{ padding: '0', borderRadius: '32%', width: '50px' }} />
        <div className="sc-header--team-name"> {this.props.teamName} </div>
        <div className="sc-header--close-button" onClick={this.props.onClose}>
          <img src={closeIcon} alt="" />
        </div>
      </div>
    );
  }
}

export default Header;
