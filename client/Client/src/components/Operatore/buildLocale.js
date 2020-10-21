import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2'
// reactstrap components
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';


class BuildLocale extends React.Component {

    constructor(props) {
      super(props)
  
      this.state = {
        id_locale_already_taken: false,
        id_locale_obbligatorio: false,
        range_superficie: 10,
        range_capienza: 25,
      }
    }

  /*
  Questa funzione viene richiamata al click del bottone 'Inserisci Locale' posta al termine delle varie form
  e, in base ai campi inseriti precedentemente, fa una post al server in modo da effettuare un inserimento
  all'interno della tabella LOCALI.
  */
  InserisciLocale() {

    let struttura = {
      id: "",
      diparimento: "",
      telefono: "",
      indirizzo: "",
      tipologia: "",
      condivisione: "",
      superficie: this.range_superficie,
      capienza: this.range_capienza,
      referente: ""
    }
    struttura.id = document.getElementById("inserimento_locale_id").value;
    struttura.dipartimento = document.getElementById("inserimento_locale_dipartimento").value;
    struttura.telefono = document.getElementById("inserimento_locale_telefono").value;
    struttura.indirizzo = document.getElementById("inserimento_locale_indirizzo").value;
    struttura.tipologia = document.getElementById("inserimento_locale_tipologia").value;
    struttura.condivisione = document.getElementById("inserimento_locale_condivisione").value;
    struttura.superficie = document.getElementById("inserimento_locale_superficie").value;
    struttura.capienza = document.getElementById("inserimento_locale_capienza").value;
    struttura.referente = document.getElementById("inserimento_locale_referente").value;

    if (struttura.id != "") {

      axios.post('http://' + this.props.IP + ':'+this.props.porta_server+'/Locali/InserimentoLocale', struttura, this.authorizationHeader())
        .then(response => {

          if (response.status == 202 && response.data.statusText == "ID_ALREADY_USE") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Il locale inserito è già presente! Cambiare ID'
              })
            this.setState({ id_locale_already_taken: true })
            this.setState({ id_locale_obbligatorio: false })
          }


          else if (response.status == 202 && response.data.statusText == "NO_REFERENTE") {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Non hai selezionato nessun referente dalla lista'
            })
            this.setState({ id_locale_already_taken: false })
            this.setState({ id_locale_obbligatorio: false })
          }


          else if (response.status == 202 && response.data.statusText == "ER_DATA_TOO_LONG") {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Uno dei campi delle form ha un testo troppo lungo'
            })
            this.setState({ id_locale_already_taken: false })
            this.setState({ id_locale_obbligatorio: false })
          }

          else if (response.status == 202 && response.data.statusText == "HANDLE ERROR GENERIC" || response.data.statusText == "INTERNAL SERVER ERROR") {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Qualcosa è andato storto e non è stato possibile insierire i locali con successo'
            })
            this.setState({ id_locale_already_taken: false })
            this.setState({ id_locale_obbligatorio: false })
          }

          else if (response.status == 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Locale Inserito Con Successo',
              showConfirmButton: false,
              timer: 1500
            })
            this.setState({ id_locale_already_taken: false })
            this.setState({ id_locale_obbligatorio: false })

          }
        })
    }

    else {
      this.setState({ id_locale_obbligatorio: true })
      this.setState({ id_locale_already_taken: false })
    }
  }

  cambiaColore(elemento) {
    document.getElementById(elemento).style.background = "transparent"
    document.getElementById(elemento).style.borderColor = "#2ca8ff"
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

  /*
    Queste due funzioni servono per aggiornare real-time il valore inseriti dai due slider:
    Superficie e Capienza Massima.
  */
  onInputSuperficie() {
    var input = document.getElementById("inserimento_locale_superficie");
    var currentVal = input.value;
    this.setState({
      range_superficie: currentVal
    })
    }

  onInputCapienza() {
    var input = document.getElementById("inserimento_locale_capienza");
    var currentVal = input.value;
    this.setState({
      range_capienza: currentVal
    })
  }

    render() {
        return(

<div>

<div id="inserisci_locale" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgb(164 147 147 / 20%), rgb(98 115 128 / 9%))", color: "black", minHeight: "none", maxHeight: "none", height: "auto" }}>
  <div
    className="page-header-image"
    style={{
    }}
    ref={React.createRef()}
  ></div>
  <Row style={{ marginTop: '1cm' }}>
    <Col xs="6" sm="3"></Col>


    <Col sm="6" style={{ marginTop: "2.7cm", paddingRight: "30px", paddingLeft: "30px" }}>

      {!this.state.id_locale_already_taken && !this.state.id_locale_obbligatorio &&
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText></InputGroupText>
          </InputGroupAddon>
          <Input placeholder="Identificativo Locale" id="inserimento_locale_id" onMouseUp={() => this.cambiaColore("inserimento_locale_id")} />
        </InputGroup>
      }
      {this.state.id_locale_already_taken && !this.state.id_locale_obbligatorio &&
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText></InputGroupText>
          </InputGroupAddon>
          <Input placeholder="Identificativo Locale" id="inserimento_locale_id" invalid />
          <FormFeedback>L' ID di questo locale è stato già inserito</FormFeedback>
        </InputGroup>
      }
      {!this.state.id_locale_already_taken && this.state.id_locale_obbligatorio &&
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText></InputGroupText>
          </InputGroupAddon>
          <Input placeholder="Identificativo Locale" id="inserimento_locale_id" invalid />
          <FormFeedback>L' ID del locale è obbligatorio</FormFeedback>
        </InputGroup>
      }
      <br />
      <FormGroup>
        <Label for="exampleSelect">Dipartimento</Label>
        <Input defaultValue="DIETI" type="select" name="select" id="inserimento_locale_dipartimento" onMouseUp={() => this.cambiaColore("inserimento_locale_dipartimento")}>
          <option>DIETI</option>
        </Input>
      </FormGroup>
      <br />
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText></InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Telefono" id="inserimento_locale_telefono" onMouseUp={() => this.cambiaColore("inserimento_locale_telefono")} />
      </InputGroup>
      <br />
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText></InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Indirizzo" id="inserimento_locale_indirizzo" onMouseUp={() => this.cambiaColore("inserimento_locale_indirizzo")} />
      </InputGroup>

      <br />
      <Row>
        <Col sm='6'>
          <FormGroup>
            <Label for="exampleSelect">Tipologia</Label>
            <Input type="select" name="select" id="inserimento_locale_tipologia" onMouseUp={() => this.cambiaColore("inserimento_locale_tipologia")}>
              <option>Aula studio</option>
              <option>Laboratorio</option>
            </Input>
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for="exampleRange">Superficie</Label>
            <Input id="inserimento_locale_superficie" type="range" min="0" max="250" step="5" defaultValue="10" onInput={this.onInputSuperficie.bind(this)} /> {this.state.range_superficie}

          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <Label for="exampleSelect">Condivisione</Label>
            <Input type="select" name="select" id="inserimento_locale_condivisione" placeholder="Condivisione" onMouseUp={() => this.cambiaColore("inserimento_locale_condivisione")}>
              <option>Locale a uso condiviso</option>
              <option>Locale a uso singolo</option>
            </Input>
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for="exampleRange">Capienza Massima</Label>
            <Input id="inserimento_locale_capienza" type="range" min="0" max="200" step="1" defaultValue="25" onInput={this.onInputCapienza.bind(this)} /> {this.state.range_capienza}

          </FormGroup>
        </Col>
      </Row>


      <FormGroup>
        <Label for="exampleSelect">Referente</Label>
        <Input type="select" name="select" id="inserimento_locale_referente" onMouseUp={() => this.cambiaColore("inserimento_locale_referente")}>
          <option> Seleziona il Referente</option>
          {this.props.referenti.map((prof) =>

            <option>{prof}</option>,
          )}

        </Input>
      </FormGroup>

      <Row> 

      <Col sm="4">
      </Col>

      <Col sm="4">
        <Button className="btn-round" color="info" type="button" onClick={() => this.InserisciLocale()}> Inserisci Locale </Button>
      </Col>

      <Col sm="4">
      </Col>

      </Row>


    </Col>

    <Col sm="3"></Col>


  </Row>


</div>
</div>

        );
    }
}

export default BuildLocale;
