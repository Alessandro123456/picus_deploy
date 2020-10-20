import React from "react";
import Studente from "./Studente.js";
import Operator from "./Operator.js";
import Docente from "./Docente.js";
import IndexHeader from "components/IndexHeader.js";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import DefaultFooter from "components/DefaultFooter.js";

class Index extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      navbarColor: "navbar-transparent",
      scelta: false,
      ws: null,
      flag_create_socket: false

    };
  }

  //serve per chiudere la socket col bot
  closeWindowPortal() {
    console.log("Will unmount")
    if (this.state.flag_create_socket) {
      var data = null
      data = "closed";
      this.state.ws.send(data);
      this.setState({ flag_create_socket: false })
      this.state.ws.close();
      console.log("Socket chiusa")
    }
  }

  componentDidMount() {
  
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    window.addEventListener('beforeunload', () => {
      this.closeWindowPortal();
    });
    this.setState({ ws: new W3CWebSocket("ws://" + this.props.IP + ":"+this.props.porta_server+"/chatbot/"+this.props.keycloak.profile.firstName+
    "/"+this.props.email+"/"+this.props.keycloak.resourceAccess.react_app.roles[0], 'echo-protocol') }, () => {
      this.setState({ flag_create_socket: true })
    });
  }

  componentWillUnmount() {
    document.body.classList.remove("index-page");
    document.body.classList.remove("sidebar-collapse");
  }

  render() {

    return (
      <>
  {this.props.ruolo[1] && this.props.ruolo[0] && !this.props.ruolo[2] &&
  
 <Operator ws={this.state.ws} IP={this.props.IP} IP_KEYCLOAK = {this.props.IP_KEYCLOAK} porta_server={this.props.porta_server}
        porta_keycloak={this.props.porta_keycloak} flag={this.state.flag_create_socket} keycloak={this.props.keycloak} authenticated={this.props.authenticated_var} name={this.props.name} email={this.props.email} />
        
  }
  
  {!this.props.ruolo[1] && this.props.ruolo[0] && this.props.ruolo[2] &&

        <Docente ws={this.state.ws} IP={this.props.IP} IP_KEYCLOAK = {this.props.IP_KEYCLOAK} porta_server={this.props.porta_server}
        porta_keycloak={this.props.porta_keycloak} flag={this.state.flag_create_socket} keycloak={this.props.keycloak} authenticated={this.props.authenticated_var} name={this.props.name} email={this.props.email} />

        
  }
  
  {!this.props.ruolo[1] && !this.props.ruolo[0] && this.props.ruolo[2] &&
  
 <Studente ws={this.state.ws} IP={this.props.IP} IP_KEYCLOAK = {this.props.IP_KEYCLOAK} porta_server={this.props.porta_server}
        porta_keycloak={this.props.porta_keycloak} flag={this.state.flag_create_socket} keycloak={this.props.keycloak} authenticated={this.props.authenticated_var} name={this.props.name} email={this.props.email} />

        
  }
       <div className="wrapper">
       
        
          <IndexHeader />

          <DefaultFooter />
        </div>
      </>
    );
  }
}
export default Index;
