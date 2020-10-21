import React from "react";
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2'
import { CardFooter, Card, CardHeader, CardBody, TabContent, Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, UncontrolledTooltip } from "reactstrap";
import Chatbot from '../chatbot/demo/src/index'
import BuildPrenotaPosto from "components/Studente/buildPrenotaPosto";
import Home from "./Home.js"
import VisualizzaAule from "./../components/Studente/visualizzaAule"

class Studente extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      scelta: [false, false, false, false, false, false],
      professori: [], //get lista docenti
      navbarColor: "navbar-transparent",
      collapseOpen: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    window.addEventListener("scroll", this.updateNavbarColor);
  }

  componentWillMount() {
    window.removeEventListener("scroll", this.updateNavbarColor);
  }

  componentWillReceiveProps() {
    if (this.props.keycloak != null) {
      if (!this.props.keycloak.authenticated) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Il token di autenticazione è scaduto'
          })        
          this.props.keycloak.logout();
      }
    }
  }

 /*
  funzione di autenticazione di keycloak -> questa funzione viene richiamata all'interno delle axios
  in modo da proteggere, in base al ruolo, le richieste al server */
  authorizationHeader() {
    if (!this.props.keycloak) return {};
    return {
      headers: {
        "Authorization": "Bearer " + this.props.keycloak.token,
      }
    };
  }

  updateNavbarColor_dash_home = () => {
    this.setState({ navbarColor: "navbar-transparent" });
  };

  updateNavbarColor_dash_other = () => {

    this.setState({ navbarColor: "" });
  };

  setButtonHovered(stato) {
    if (stato == true) {
      document.getElementById("LOGOUT").style.backgroundColor = "white"
    }
    else
      document.getElementById("LOGOUT").style.backgroundColor = "transparent"
  }

  setButtonHovered_home(stato) {
    if (stato == true) {
      document.getElementById("button_picus").style.backgroundColor = "white"
    }
    else
      document.getElementById("button_picus").style.backgroundColor = "transparent"
  }
  
  aggiorna_stato(key) {
    switch (key) {
      case "home":
        this.setState({scelta: [false, false, false, false, false, false]})
        this.updateNavbarColor_dash_home()
        break
      case 4:
        this.setState({ scelta: [false, false, false, false, true, false]})
        this.updateNavbarColor_dash_other()
        this.getProfessori();
        break;
      case 5:
        this.setState({scelta: [false, false, false, false, false, true]})
        this.updateNavbarColor_dash_other()
        break
    }
  }

  funzione_sfondo () {
    if(this.state.collapseOpen) {
      document.getElementById("navbar-id").style.background = "linear-gradient(0deg, #000000, rgb(49 118 167))"
    }
    else {
      document.getElementById("navbar-id").style.background = "transparent"
    }
  }

  /*
  questa funzione viene richiamata al click di "Prenota un posto" e riempie la SelectForm 
  'Professore' con la lista di docenti disponibili all'interno del render
  attraverso lo state 'professori'
*/
  getProfessori() {
    axios.get("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/getProfessori", this.authorizationHeader()).then(res => {
      if (res.status == 200 && res.data.length != 0) {
        this.setState({ professori: res.data })
      }
      else if (res.status == 200 && res.data.length == 0) {
        this.setState({ professori: res.data })
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Nessun docente ha effettuato una prenotazione',
        })
      }
      else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Non è stato possibile reperire i Professori disponibili',
        })
      }
    })
  }

  // **** RENDER

  render() {
    const { collapseOpen, navbarColor } = this.state;
    return (

      <>
        {collapseOpen ? (
          <div
            id="bodyClick"
            onClick={() => {
              document.documentElement.classList.toggle("nav-open");
              this.setState({ collapseOpen: false });

            }}
          />
        ) : null}


        <Navbar className={"fixed-top " + navbarColor} expand="lg" color="info" style={{ padding: "0.1px" }}>
          <Container>
            <div className="navbar-translate">

              <NavbarBrand

                target="_blank"
                id="navbar-brand"
              >
                <Button
                  className="nav-link btn-neutral"
                  id="button_picus"
                  onClick={() => this.aggiorna_stato("home")}
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={() => this.setButtonHovered_home(true)}
                  onMouseLeave={() => this.setButtonHovered_home(false)}
                >
                  <p>PICUS</p>
                </Button>
              </NavbarBrand>

              <button
                className="navbar-toggler navbar-toggler"
                onClick={() => {
                  document.documentElement.classList.toggle("nav-open");
                  this.setState({ collapseOpen: !collapseOpen } , () => this.funzione_sfondo () )
                }}
                aria-expanded={collapseOpen}
                type="button"
              >
                <span className="navbar-toggler-bar top-bar"></span>
                <span className="navbar-toggler-bar middle-bar"></span>
                <span className="navbar-toggler-bar bottom-bar"></span>
              </button>
            </div>

            <Collapse
              className="justify-content-end"
              isOpen={collapseOpen}
              navbar
            >
              <Nav navbar id = "navbar-id" >

                
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    href=""
                    nav

                  >
                    <i className="now-ui-icons ui-1_calendar-60"></i>
                    <p>Prenotazioni</p>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => this.aggiorna_stato(4)}
                    >
                      <i className="now-ui-icons ui-1_simple-add"></i>
                   Prenota il tuo posto
                  </DropdownItem>
                    <DropdownItem

                      target="_blank"
                      onClick={() => this.aggiorna_stato(5)}
                    >
                      <i className="now-ui-icons design_bullet-list-67 mr-1"></i>
                    Visualizza le tue prenotazioni
                  </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <NavItem>
                  <Button
                    className="nav-link btn-neutral"
                    id="LOGOUT"
                    onClick={() => this.props.keycloak.logout()}
                    style={{ backgroundColor: 'transparent', color: "white" }}
                    onMouseEnter={() => this.setButtonHovered(true)}
                    onMouseLeave={() => this.setButtonHovered(false)}

                  >
                    <i className="now-ui-icons arrows-1_share-66 mr-1"></i>
                    <p>LOGOUT</p>
                  </Button>
                </NavItem>



                <NavItem>
                  <NavLink
                    href="https://twitter.com/dieti_unina"
                    target="_blank"
                    id="twitter-tooltip"
                  >
                    <i className="fab fa-twitter"></i>
                    <p className="d-lg-none d-xl-none">Twitter</p>
                  </NavLink>
                  <UncontrolledTooltip target="#twitter-tooltip">
                    Follow us on Twitter
                </UncontrolledTooltip>
                </NavItem>



                <NavItem>
                  <NavLink
                    href="https://www.facebook.com/dieti.unina.it/?ref=page_internal"
                    target="_blank"
                    id="facebook-tooltip"
                  >
                    <i className="fab fa-facebook-square"></i>
                    <p className="d-lg-none d-xl-none">Facebook</p>
                  </NavLink>
                  <UncontrolledTooltip target="#facebook-tooltip">
                    Like us on Facebook
                </UncontrolledTooltip>
                </NavItem>



                <NavItem>
                  <NavLink
                    href="https://instagram.com/dieti.unina?igshid=9acjh8hu640l"
                    target="_blank"
                    id="instagram-tooltip"
                  >
                    <i className="fab fa-instagram"></i>
                    <p className="d-lg-none d-xl-none">Instagram</p>
                  </NavLink>
                  <UncontrolledTooltip target="#instagram-tooltip">
                    Follow us on Instagram
                </UncontrolledTooltip>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>

        {!this.state.scelta[0] && !this.state.scelta[1] && !this.state.scelta[2] && !this.state.scelta[3] && !this.state.scelta[4] && !this.state.scelta[5] &&
          <Home />
        }

        {this.state.scelta[4] &&
         <BuildPrenotaPosto keycloak={this.props.keycloak} IP={this.props.IP} porta_server={this.props.porta_server} professori={this.state.professori} email={this.props.email}/>
        }

        {this.state.scelta[5] &&
          <VisualizzaAule keycloak={this.props.keycloak} IP={this.props.IP} porta_server={this.props.porta_server} email={this.props.email} />
        }

        <Row>
          <Chatbot ws={this.props.ws} flag={this.props.flag} email={this.props.email} keycloak={this.props.keycloak}/>
        </Row>

      </>
    );
  }
}

export default Studente;
