import React from "react";
import Studente from "./Studente.js";
import Operator from "./Operator.js";
import Docente from "./Docente.js";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import DefaultFooter from "components/DefaultFooter.js";

//  view principale che permette, su un controllo del ruolo, 
//  la renderizzazione dell'apposita interfaccia (STUDENTE, OPERATORE O DOCENTE)

class Index extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      navbarColor: "navbar-transparent",
      scelta: false,
      ws: null, //viene inizializzato uno stato websocket che permette la comunicazione col bot
      flag_create_socket: false //flag di controllo che assicura l'istanziazione della socket

    };
  }

  //serve per chiudere la socket col bot -> è un componentDidUnmount
  closeWindowPortal() {
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

    //  inizializzazione della ws con 3 parametri passati in input: nome + email + ruolo
    //  (il ruolo serve al bot per decidere che tipo di azioni offrire (semplice switch-case)) 

    this.setState({ ws: new W3CWebSocket("ws://" + this.props.IP + ":"+this.props.porta_server+"/chatbot/"+this.props.keycloak.profile.firstName+
    "/"+this.props.email+"/"+this.props.keycloak.resourceAccess.react_app.roles[0], 'echo-protocol') }, () => {
      this.setState({ flag_create_socket: true })
    });
  }

  componentWillUnmount() {
    document.body.classList.remove("index-page");
    document.body.classList.remove("sidebar-collapse");
  }

  /*
  all'interno del render ci sono 3 if che si attivano in base al ruolo passato da keycloak:
  1) se il flag di operatore && docente è vero => si attiva il render dell'operatore
  2) se il flag di docente && studente è vero => si attiva il render del docente 
                                               (il docente parte di default con ruolo studente)
  3) se il flag di studente è vero => si attiva il render dello studente
  */
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
       
          <DefaultFooter />
        </div>
      </>
    );
  }
}
export default Index;
