import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Keycloak from 'keycloak-js';
// styles for this kit
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.4.0";
import "assets/demo/demo.css?v=1.4.0";
import "assets/demo/nucleo-icons-page-styles.css?v=1.4.0";
// pages for this kit
import Index from "views/Index.js";
import Swal from 'sweetalert2'

//configurazione degli IP_SERVER + IP_KEYCLOAK + PORTE

var IP = process.env.REACT_APP_HOST_IP_ADDRESS_SERVER
var IP_KEYCLOAK = process.env.REACT_APP_HOST_IP_KEYCLOAK

var porta_keycloak = process.env.REACT_APP_PORT_KEYCLOAK
var porta_server = process.env.REACT_APP_PORT_SERVER

//configurazione per l'istanziazione di keycloak
var key = {
  realm: "picus",
  url: "http://"+IP_KEYCLOAK+":"+porta_keycloak+"/auth/",
  clientId: "react_app",
  public: true,
  ssl_required: "external",
}

var keycloak = Keycloak(key); 
var authenticated_var = null 
var attribute = null
var name = null
var docente=null
var operator=null
var studente = null
var email=null

console.log("keycloak",keycloak)

keycloak.init({ onLoad: 'login-required' })
    .success(authenticated => {    
        authenticated_var=authenticated         
       // renderReactDom() // Avvia il rendering di <App>
    })
    .error((error) => {  
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Errore: problemi sul login'
      })             
    })
    keycloak.onReady = function () {
      // L'OGGETTO KEYCLOAK È PRONTO
      // prendiamo i dati dell'utente di profilo che ci servono per i menu all'interno dei componenti figli
      keycloak.loadUserProfile().success(details => {
          console.log("details",details)
          attribute=details.attributes;
          name = details.firstName;
          docente = keycloak.hasResourceRole("docente");
          operator = keycloak.hasResourceRole("operator");
          studente = keycloak.hasResourceRole("studente");
          console.log("docente",docente)
          console.log("operatore",operator)
          console.log("studente",studente)
          email = details.email;
          renderReactDom();
      }
      )
  }

function renderReactDom() {
  //viene avviato il render di Index -> view principale dell'applicazione
ReactDOM.render(
  <BrowserRouter> 
        <Route path="/" render={(props) => <Index IP = {IP} IP_KEYCLOAK = {IP_KEYCLOAK} ruolo = {[docente,operator,studente]} keycloak={keycloak} porta_server = {porta_server}
        porta_keycloak={porta_keycloak} authenticated={authenticated_var}  name = {name} email = {email} />} />
        <Redirect to="/" />
        <Redirect from="/" to="/" />
  </BrowserRouter>,
  document.getElementById("root")
);
}
