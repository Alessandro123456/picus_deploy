import React from "react";
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2'
import { CardFooter, Card, CardHeader, CardBody, TabContent, Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, UncontrolledTooltip } from "reactstrap";


class VisualizzaAule extends React.Component {

    constructor(props) {
      super(props)
  
      this.state = {
        value: "",
        lista_aule: [],
        aule_prenotate: [],
        aule_prenotate_visualizza: [],
        mostra_card: false,
        professori: [] //get lista docenti
      }
    }

    componentDidMount() {
        this.visualizzaPrenotazioni()
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

  DisdiciPosto_conferma(elemento) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Non potrai annullare questa azione!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancella!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.DisdiciPosto(elemento);
      }
    })
  }

  DisdiciPosto(elemento) {
    axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/EliminaPosto", {
      riga: elemento
    }, this.authorizationHeader())
      .then(res => {
        //new
        if (res.status == 200) {
          Swal.fire(
            'Cancellato!',
            'La tua prenotazione è stata cancellata',
            'success'
          )
          this.visualizzaPrenotazioni()
        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile eliminare la prenotazione',
            
          })
        }
      })

  }
/*
 la funzione sottostante viene richiamata da 'DisdiciPosto' in quanto, dopo una cancellazione, 
 permette di renderizzare correttamente le nuove aule disponibili in base all'eliminazione precedente
*/
  visualizzaPrenotazioni() {

    axios.post('http://' + this.props.IP + ':'+this.props.porta_server+'/PrenotaPosto/visualizzaPrenotazioni',
      { email: this.props.email }, this.authorizationHeader())
      .then(res => {

        if (res.status == 200 && res.data.length != 0) {
          this.setState({ aule_prenotate_visualizza: res.data })
        }
        else if (res.status == 200 && res.data.length == 0) {
          this.setState({ aule_prenotate_visualizza: res.data })
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Al momento non hai prenotazioni attive. Prova a prenotarne una!',
          })
        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile reperire le aule',
            
          })
        }
      }
      )
  }

    render(){
      return(
        <div>
        <div id="visualizza_posto" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgb(164 147 147 / 20%), rgb(98 115 128 / 9%))",  color: "black", minHeight: "none", maxHeight: "none", height: "auto" }}>
          <div
            className="page-header-image"
            style={{
            }}
            ref={React.createRef()}
          ></div>
          <div>
              <div>
                {this.state.aule_prenotate_visualizza.length != 0 &&
                  <Row style={{ marginTop: "2.7cm", marginLeft: "1.85cm" }}>

                    {this.state.aule_prenotate_visualizza.map((aule) =>
                      <div>
                        <Col sm="4">
                          <Row>
                            <Container style={{ color: "black", maxWidth: "8cm", minWidth: "8cm", minHeight: "8cm", maxHeight: "8cm" }}>
                              <Card>
                                <CardHeader className="nav-tabs-neutral justify-content-center">
                                  <Nav className="nav-tabs-neutral justify-content-center" data-background-color="blue" role="tablist" tabs >
                                    <h6>{aule.NOME}</h6>
                                  </Nav>
                                </CardHeader>
                                <CardBody>
                                  <Row sm="10" style={{ marginLeft: "0" }}>
                                    <Col sm="4">
                                      <Row style={{ paddingBottom: "0.1cm" }} className="nav-tabs-neutral justify-content-center" > <h6> <b> AULA</b></h6> </Row>
                                      <Row style={{ paddingBottom: "0.1cm" }} className="nav-tabs-neutral justify-content-center"> <h6>ORA INIZIO  </h6></Row>
                                      <Row style={{ paddingBottom: "0.1cm" }} className="nav-tabs-neutral justify-content-center"><h6> ORA FINE </h6></Row>
                                    </Col>
                                    <Col sm="4">
                                      <Row style={{ paddingBottom: "0.1cm" }} className="nav-tabs-neutral justify-content-center"><h6> {aule.locale}</h6></Row>
                                      <Row style={{ paddingBottom: "0.1cm" }} className="nav-tabs-neutral justify-content-center"><h6> {aule.ora_inizio}</h6></Row>
                                      <Row style={{ paddingBottom: "0.1cm" }} className="nav-tabs-neutral justify-content-center"><h6> {aule.ora_fine}</h6></Row>
                                    </Col>
                                    <Col sm="4">
                                      {aule.url_foto != null ?
                                        <img alt="..." className="rounded-circle" src={aule.url_foto}></img>
                                        :
                                        <img alt="..." className="rounded-circle" src="https://www.efficienzaenergeticagroup.com/wp-content/uploads/2016/09/avatar.jpg"></img>
                                      }
                                    </Col>
                                  </Row>
                                  <Row sm="2" style={{ marginLeft: "0" }}>
                                  </Row>

                                  <CardFooter>

                                    <Button className="btn-round" color="info" type="button" onClick={() => this.DisdiciPosto_conferma(aule.idPrenotazione_studente)} >
                                      Elimina La tua Prenotazione
                                        </Button>



                                  </CardFooter>
                                </CardBody>
                              </Card>
                            </Container>
                          </Row>
                        </Col>
                      </div>
                    )}
                  </Row>
                }
              </div>
             
          </div></div></div>
      );
    }
}

export default VisualizzaAule;