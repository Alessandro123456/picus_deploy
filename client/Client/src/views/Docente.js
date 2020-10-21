import React from "react";
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2'
import { CardFooter, Card, CardHeader, CardBody, TabContent, Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, UncontrolledTooltip } from "reactstrap";

import Chatbot from '../chatbot/demo/src/index'
import TabPrenotazioni from '../components/Tab_prenotazioni.js'
import Home from './Home.js'
import BuildPrenotazioni from "../components/buildPrenotazioni.js";

class Docente extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      scelta: [false, false, false, false, false, false],
      locali: [],
      navbarColor: "navbar-transparent",
      collapseOpen: false
    };

  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    window.addEventListener("scroll", this.updateNavbarColor);
    window.addEventListener("resize", this.handleResize);
    this.handleResize()
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
  
   /* 
  la funzione aggiorna_stato viene richiamata dai vari dropmenu presenti all'interno della navbar.
  In particolare, a seconda del menu cliccato, la funzione imposterà uno stato, ovvero 'scelta',
  in modo da poter renderizzare nel modo giusto il componente cliccato.
  La funzione prende in ingresso un parametro key che è un valore passato al click del dropmenu corrispondente
  all'interno del render.
  Lo stato 'scelta' è stato utilizzato come flag di controllo nel render per mostrare, appunto, 
  il componente scelto in base al dropmenu.
  */
 aggiorna_stato(key) {
  switch (key) {
    case "home":
      // è stato cliccato bottone relativo a "picus"
      this.setState({scelta: [false, false, false, false, false, false]})
      this.updateNavbarColor_dash_home()
      break
    case 2:
      this.setState({scelta: [false, false, true, false, false, false]})
      this.get_locali();
      this.updateNavbarColor_dash_other()
      break
    case 3:
      this.setState({scelta: [false, false, false, true, false, false]})
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

  add_user() {
    axios.get('http://' + this.props.IP_KEYCLOAK + ':'+this.props.porta_keycloak+'/auth/admin/realms/picus/roles/DOCENTE/users', this.authorizationHeader())
      .then(res => {
        var vect = [];
        var nome = [];
        for (let i = 0; i < res.data.length; i++) {
          vect.push(res.data[i].username)
          nome.push(res.data[i].firstName + " " + res.data[i].lastName)
        }

        axios.post('http://' + this.props.IP + ':'+this.props.porta_server+'/Utenti/aggiornaUtenti',
          {
            email_user: vect,
            nome_user: nome
          }, this.authorizationHeader())
          .then(res => {


            if (res.status == 200) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Docenti Aggiornati con Successo',
                showConfirmButton: false,
                timer: 1500
              })
            }
            else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Non è stato possibile aggiornare i Docenti'
              })
            }
          }
          )
      })
  }
  /*
  questa funzione viene richiamata al click di "Inserisci una prenotazione" per riempire lo stato 'locali'
  il quale verrà utilizzato per tenere conto di TUTTI i locali presenti al momento nel DB
  */
 get_locali() {
  axios.get('http://' + this.props.IP + ':'+this.props.porta_server+'/Prenotazione/getLocali', this.authorizationHeader())
    .then(res => {

      if (res.status == 200 && res.data.length != 0) {
        this.setState({ locali: res.data})
      }

      else if (res.status == 200 && res.data.length == 0) {
        this.setState({ locali: res.data})
      }

      else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Non è stato possibile reperire i Locali disponibili'
        })
      }
    }
    );
 }

  update_foto(url) {

    axios.post('http://' + this.props.IP + ':'+this.props.porta_server+'/Docente/updatefoto',
      { url_user: url, email_user: this.props.email }, this.authorizationHeader())
      .then(res => {


        if (res.status == 200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Foto aggiornata con successo',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato aggiornare la foto con successo',
            
          })
        }
      }
      )

  }

  // **** RENDER ****

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
                    <i className="now-ui-icons ui-1_settings-gear-63"></i>
                    <p>Gestisci le Prenotazioni</p>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem 
                      onClick={() => this.aggiorna_stato(2)}
                    >
                      <i className="now-ui-icons ui-1_simple-add"></i>
                    Inserisci una prenotazione
                  </DropdownItem>
                    <DropdownItem
                      href=""
                      target="_blank"
                      onClick={() => this.aggiorna_stato(3)}
                    >
                      <i className="now-ui-icons design_bullet-list-67 mr-1"></i>
                    Gestisci le tue prenotazioni
                  </DropdownItem>
                    <DropdownItem
                      href=""
                      target="_blank"
                      onClick={() => Swal.fire({
                        title: 'URL',
                        input: 'text',
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        cancelButtonText: "Annulla",
                        confirmButtonText: 'Prova',
                        showLoaderOnConfirm: true,

                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                        if (result.isConfirmed) {
                          console.log("allowOutsideClick", result.value)
                          var foto = result.value
                          Swal.fire({
                            title: 'Carina!',
                            text: 'Sei sicuro?',
                            imageUrl: result.value,
                            imageWidth: 200,
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            confirmButtonText: 'Si',
                            cancelButtonText: 'No',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              this.update_foto(foto)
                            }

                          })
                        }
                      })}
                    >
                      <i className="now-ui-icons users_circle-08"></i>
                    Aggiorna foto Profilo
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

        {this.state.scelta[2] &&
         <BuildPrenotazioni keycloak={this.props.keycloak} IP={this.props.IP} 
         porta_server={this.props.porta_server} locali={this.state.locali}
         email={this.props.email}
         />
        }

        {this.state.scelta[3] &&
          <TabPrenotazioni keycloak={this.props.keycloak} IP={this.props.IP} porta_server={this.props.porta_server} email={this.props.email} />
        }

        <Row>
          <Chatbot ws={this.props.ws} flag={this.props.flag} email={this.props.email} keycloak={this.props.keycloak} />
        </Row>

      </>
    );
  }
}

export default Docente;
