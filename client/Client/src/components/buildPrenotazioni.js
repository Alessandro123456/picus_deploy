import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2'
import CardAule from '../components/CardAule.js'

// reactstrap components
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import Planimetria from './Planimetria'

class BuildPrenotazioni extends React.Component {

    constructor(props) {
      super(props)
  
      this.state = {
        aule_prenotabili: [],
        aule_prenotabili_mappa: [],
        map: false, //utilizzato per rendere mappa,
        range_numeropartecipanti: 20,
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

  onInputNumeroPartecipanti() {
    var input = document.getElementById("numeropartecipanti");
    var currentVal = input.value;
    this.setState({
      range_numeropartecipanti: currentVal
    })
  }

  //CHECK DISPONIBILITA' AULE CON CARD
  PrenotaAule() {

    let struttura = {
      giorno: null,
      ora_ingresso: null,
      ora_uscita: null,
      numero_partecipanti: 0,
    }

    struttura.giorno = document.getElementById("Date").value
    struttura.ora_ingresso = document.getElementById("timeIN").value
    struttura.ora_uscita = document.getElementById("timeOUT").value
    struttura.numero_partecipanti = document.getElementById("numeropartecipanti").value


    axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/CheckDisponibilita", struttura, this.authorizationHeader())
      .then(res => {
        if (res.status == 200 && res.data.length != 0) {
          this.setState({ aule_prenotabili: res.data, map: false })
        }
        else if (res.status == 200 && res.data.length == 0) {
          this.setState({ aule_prenotabili: res.data, map: false })
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non sono presenti aule prenotabili per la data richiesta',
            
          })
        }
        else if (res.status == 202 && res.data.statusText == "DATA INCORRETTA") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La data inserita è incorretta',
            
          })
        }
        else if (res.status == 202 && res.data.statusText == "ORA INCORRETTA") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'L ora inserita è incoretta',
            
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
      );
  }
  

  //CHECK DISPONIBILITA' AULE CON MAPPA
  renderMap() {
    var locali = []
    let appoggio = []
    let struttura = {

      giorno: null,
      ora_ingresso: null,
      ora_uscita: null,
      numero_partecipanti: 0,

    }

    struttura.giorno = document.getElementById("Date").value
    struttura.ora_ingresso = document.getElementById("timeIN").value
    struttura.ora_uscita = document.getElementById("timeOUT").value
    struttura.numero_partecipanti = document.getElementById("numeropartecipanti").value


    axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/CheckDisponibilita", struttura, this.authorizationHeader())
      .then(res => {
        if (res.status == 200) {

          this.setState({ aule_prenotabili_mappa: res.data, map: true } , () => {
            for(let i=0; i<this.props.locali.length; i++) {
              locali.push(this.props.locali[i].idLOCALE)
            }

        //trova verdi
        if(this.state.aule_prenotabili_mappa.length != 0) {
        for (let i = 0; i < this.state.aule_prenotabili_mappa.length; i++) {
          try {
            document.getElementById(this.state.aule_prenotabili_mappa[i].idLOCALE).style.fill = "green"
            appoggio.push(this.state.aule_prenotabili_mappa[i].idLOCALE)
          }
          catch (errore) {
            console.log("Non ci sta l'elemento nell'html (GREEN)", errore)
          }
        }
      }

        //trova grigi
        for (let i = 0; i < this.props.locali.length; i++) {
          if (this.props.locali[i].stato_locale == "chiuso") {
            try {
              document.getElementById(this.props.locali[i].idLOCALE).style.fill = "grey"
              appoggio.push(this.props.locali[i].idLOCALE)
            }
            catch (errore) {
              console.log("Non ci sta l'elemento nell'html (GREY)", errore)
            }
          }
        }

      var locali_filtrati = locali.filter(
      function(e) {
        return this.indexOf(e) < 0;
      },
      appoggio
     );

     for(let i=0; i<locali_filtrati.length; i++) {
      try {
        document.getElementById(locali_filtrati[i]).style.fill = "red"
      }
      catch (error) {
        console.log("Non ci sta l'elemento nell'html (RED)", error)
      }
     }
    })
  }
    else if (res.status == 202 && res.data.statusText == "DATA INCORRETTA") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La data inserita è incoretta',
        
      })
    }
    else if (res.status == 202 && res.data.statusText == "ORA INCORRETTA") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'L ora inserita è incoretta',
        
      })
    }
    else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Non è stato possibile reperire le aule',
        
      })
    } 
  })
}


    render() {
        return(

            <div>
            <div id="inserisci_prenotazione" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgb(164 147 147 / 20%), rgb(98 115 128 / 9%))",  color: "black", minHeight: "none", maxHeight: "none", height: "auto" }}>
              <div
                className="page-header-image"
                style={{
                }}
                ref={React.createRef()}
              ></div>
              <Row>
                <Col sm="4"></Col>


                <Col sm="4" style={{ marginTop: "2.7cm" }}>

                  <FormGroup style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>
                    <Label for="exampleDate">Giorno</Label>
                    <Input
                      type="date"
                      name="date"
                      id="Date"
                      placeholder="date placeholder"
                    />

                  </FormGroup >
                  <FormGroup style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>
                    <Label for="exampleTime">Ora ingresso</Label>
                    <Input
                      type="time"
                      name="timeIN"
                      id="timeIN"
                      placeholder="time placeholder"
                    />
                  </FormGroup>
                  <FormGroup style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>
                    <Label for="exampleTime">Ora uscita</Label>
                    <Input
                      type="time"
                      name="timeOUT"
                      id="timeOUT"
                      placeholder="time placeholder"
                    />
                  </FormGroup>

                  <FormGroup style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>

                    <Label for="NumeroPartecipanti">Numero Partecipanti</Label>
                    <Input id="numeropartecipanti" type="range" min="0" max="150" step="1" defaultValue="20" onInput={this.onInputNumeroPartecipanti.bind(this)} /> {this.state.range_numeropartecipanti}

                  </FormGroup>
                  <Row> 
                  <Col sm="3"></Col>
                  <Col sm="6" style={{marginLeft: "0.3cm",marginRight: "0.3cm"}}>
                  <Button className="btn-round" color="info" type="button" onClick={() => this.PrenotaAule()} block>Visualizza aule disponibili</Button>
                  <Button  className="btn-round" color="info" type="button" onClick={() => this.renderMap()} block>Visualizza aule disponibili con mappa</Button>
                  </Col>
                  <Col sm="3"></Col>
                  </Row>
                </Col>
                <Col sm="4"></Col>

                {this.state.aule_prenotabili.length != 0 && !this.state.map &&

                  <Row style={{ marginTop: "1.5cm", marginRight: "0px", marginLeft: "0px" }}>
                    {this.state.aule_prenotabili.map((aule, key) =>

                      <Col sm="3" style={{maxWidth: "100%",marginBottom: "1.5cm"}}>
                        <CardAule aule={aule} key_p={key} email={this.props.email} IP={this.props.IP} porta_server={this.props.porta_server} keycloak={this.props.keycloak} />
                      </Col>

                    )}
                  </Row>

                }

                {this.state.map == true &&
                  <div>
                    <Row style={{ marginTop: "1cm" }}>
                      <Col sm="3">

                      </Col>
                      <Col sm="6">
                        <Planimetria IP={this.props.IP} email={this.props.email} porta_server= {this.props.porta_server} keycloak={this.props.keycloak} />

                      </Col>
                      <Col sm="3">

                      </Col>
                    </Row>
                  </div>
                }


              </Row>
            </div>
          </div>

        );
    }

}

export default BuildPrenotazioni;