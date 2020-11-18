import React from "react";
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2'
import { CardFooter, Card, CardHeader, CardBody, TabContent, Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, UncontrolledTooltip } from "reactstrap";


class BuildPrenotaPosto extends React.Component {

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
      this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        this.setState({ value: event.target.value });
      }

    //funzione di autenticazione di keycloak
    authorizationHeader() {
    if (!this.props.keycloak) return {};
     return {
      headers: {
        "Authorization": "Bearer " + this.props.keycloak.token,
      }
     };
    }

    /*
    questa funzione ritorna tutti i locali che sono stati prenotati dal docente e che matchano 
    con la richiesta delle due form (docente + data)
    */
    visualizzaPostiDisponibili() {
        let professore = this.state.value
        let data = document.getElementById("dataProf").value
        axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/ViewPostiDisponibili", {
          prof: professore,
          giorno: data
        }, this.authorizationHeader()).
          then(res => {
            if (res.status == 200 && res.data.length != 0) {
              this.setState({ lista_aule: res.data })
              this.getAulePrenotate()
            }
            else if (res.status == 200 && res.data.length == 0) {
              Swal.fire({
                title: 'Non ci sono aule prenotate dal Professore selezionato',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              })
    
            }
            else if (res.status == 202 && res.data.statusText == "DATA INCORRETTA") {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La data inserite è incoretta',
                
              })
            }
            else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Non è stato possibile reperire le Aule prenotate dal professore',
                
              })
            }
    
          })
    }
      
    /*
    viene utilizzata per renderizzare nel modo corretto le card che, a seguito di una prenotazione,
    switchano bottono e non permettono una successiva prenotazione sulla medesima card 
    (vedi if all'interno del render sul bottone)
    */
    getAulePrenotate() {
        axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/PrenotaPosto/AulePrenotate", { email: this.props.email }, this.authorizationHeader())
          .then(res => {
            if (res.status == 200 && res.data.length != 0) {
              this.setState({ aule_prenotate: res.data })
              this.setState({ mostra_card: true })
            }
            else if (res.status == 200 && res.data.length == 0) {
              this.setState({ mostra_card: true })
            }
            else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Non è stato possibile reperire le aule prenotate dal professore selezionato',
                
              })
            }
          })
    
    }

    /*
    prenota posto viene attivata al click del bottone "prenota" all'interno della card
    dell'aula corrispondente -> riceve in input un valore "key" che rappresenta il
    l' i-esimo elemento a seguito del map nel render
    */
    PrenotaPosto(key) {

    axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/PostiDisponibili/PrenotaPosto", {
      data_prenotazione: this.state.lista_aule[key].data_prenotazione,
      data_richiesta: this.state.lista_aule[key].data_richiesta,
      descrizione: this.state.lista_aule[key].descrizione,
      idPRENOTAZIONE: this.state.lista_aule[key].idPRENOTAZIONE,
      local: this.state.lista_aule[key].locale,
      ora_iniziale: this.state.lista_aule[key].ora_inizio,
      ora_finale: this.state.lista_aule[key].ora_fine,
      posti_disponibili: this.state.lista_aule[key].numero_persone,
      email: this.props.email,
    }, this.authorizationHeader()).then(res => {

      if (res.status == 200) {

        this.setState({ aule_prenotate: this.state.aule_prenotate.concat(this.state.lista_aule[key].idPRENOTAZIONE) })
        this.visualizzaPostiDisponibili()
      }
      else if (res.status == 202 && res.data.statusText == "POSTI FINITI") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'I posti sono finiti ',
          
        })
      }
      else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Non è stato possibile prenotare il posto ',
          
        })
      }
    })
    } 

    render() {
        return(
<div id="inizio_prenotaunposto" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgb(164 147 147 / 20%), rgb(98 115 128 / 9%))",  color: "black", minHeight: "none", maxHeight: "none", height: "auto" }}>
<div
  className="page-header-image"
  style={{
  }}
  ref={React.createRef()}
>
</div>

<Row>
  <Col sm="4"></Col>
  <Col sm="4" style={{ marginTop: "2.7cm" }}>
    <FormGroup style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>
      <Label for="exampleSelect">Professore</Label>
      <Input type="select" name="select" id="exampleSelect" value={this.state.value} onChange={this.handleChange}>
        <option id="option_fake">Seleziona il professore</option>
        {this.props.professori.map((prof) =>
          <option>{prof.NOME}</option>,
        )}
      </Input>
    </FormGroup>

    <FormGroup style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>
      <Label for="exampleDate">Date</Label>
      <Input id="dataProf" type="date" name="date" placeholder="date placeholder" />
    </FormGroup>
    <Row>
      <Col sm="3">

      </Col>
      <Col sm="6" style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>

    <Button className="btn-round" color="info" type="button" onClick={() => this.visualizzaPostiDisponibili()} size="lg">OTTIENI AULE PRENOTATE DA : {this.state.value}</Button>
    </Col>

    <Col sm="3">
        
        </Col>
    </Row>
  </Col>

  <Col sm="4"></Col>
</Row >


  <div>

    {this.state.lista_aule.length != 0 && this.state.mostra_card &&
      <Row style={{ marginTop: "2.7cm", marginLeft: "15px", marginRight: "15px" }}>

        {this.state.lista_aule.map((aule, key) =>
          <div>
    <Col sm="3">
        
        </Col>

<Col sm="4" style={{maxWidth: "100%",marginBottom: "1.5cm"}}>
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
                      <Col sm="3">
                        {aule.url_foto != null ?
                          <img alt="..." className="rounded-circle" src={aule.url_foto}></img>
                          :
                          <img alt="..." className="rounded-circle" src="https://www.efficienzaenergeticagroup.com/wp-content/uploads/2016/09/avatar.jpg"></img>
                        }
                      </Col>
                    </Row>
                    <Row sm="2" style={{ marginLeft: "0" }}>
                    </Row>
                    <TabContent style={{ paddingTop: "0.3cm" }} body outline color="primary" className="text-center" className="nav-tabs-neutral justify-content-center" >
                      <h6> Posti Disponibili : {aule.numero_persone}</h6>
                    </TabContent>
                    <Col sm="3">
        
        </Col>
        <Col sm="6">
        <CardFooter>
                      {!this.state.aule_prenotate.includes(aule.idPRENOTAZIONE) ?
                        <Button className="btn-round" color="success" type="button" onClick={() => { this.PrenotaPosto(key) }}>
                          Prenota un posto
                                       </Button>
                        :
                        <Button className="btn-round" color="info" type="button" >
                          Posto già prenotato
                                      </Button>
                      }
                    </CardFooter>
        </Col>
        <Col sm="3">
        
        </Col>
                    
                  </CardBody>
                </Card>
            </Col>
            <Col sm="3">
        
        </Col>
          </div>
        )}
      </Row>
    }
  </div>
  

</div>
        );
    }
}

export default BuildPrenotaPosto;