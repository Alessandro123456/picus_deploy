import React from "react";
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2'
import { CardFooter, Card, CardHeader, CardBody, TabContent, Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, UncontrolledTooltip } from "reactstrap";

import Tab_locali from "../components/Tab_locali.js"
import Chatbot from '../chatbot/demo/src/index'
import CardAule from '../components/CardAule.js'
import C2A_mappa from '../components/C2A_mappa.js'
import TabPrenotazioni from '../components/Tab_prenotazioni.js'

class Docente extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      scelta: [false, false, false, false, false, false],
      range_superficie: 10,
      range_capienza: 25,
      range_numeropartecipanti: 20,
      referenti: [], //get lista referenti
      professori: [], //get lista docenti
      value: "",
      locali: [],
      lista_aule: [],
      id_locale_already_taken: false,
      id_locale_obbligatorio: false,
      aule_prenotate: [],
      aule_prenotate_visualizza: [],
      mostra_card: false,
      navbarColor: "navbar-transparent",
      collapseOpen: false,
      height_page: window.innerHeight,
      width_page: window.innerWidth,
      resize: false,
      aule_prenotabili: [],
      aule_prenotabili_mappa: [],
      map: false //utilizzato per rendere mappa
    };

    this.onInputSuperficie = this.onInputSuperficie.bind(this)
    this.onInputCapienza = this.onInputCapienza.bind(this)
    this.onInputNumeroPartecipanti = this.onInputNumeroPartecipanti.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleResize = this.handleResize.bind(this);

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

  //funzione di autenticazione di keycloak
  authorizationHeader() {
    if (!this.props.keycloak) return {};
    return {
      headers: {
        "Authorization": "Bearer " + this.props.keycloak.token,
      }
    };
  }

  handleResize() {
    this.setState({ height_page: window.innerHeight, width_page: window.innerWidth }, () => {
      console.log("H", this.state.height_page)
      console.log("W", this.state.width_page)
      console.log("resize", this.state.resize)
      if (this.state.height_page < 568 || this.state.width_page < 1242) {
        this.setState({ resize: true })
        //document.getElementsByClassName("justify-content-end collapse navbar-collapse").style.background = "linear-gradient(0deg, white, rgb(44, 168, 255))"

      }

      else {
        this.setState({ resize: false })
      }
    })
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  
  aggiorna_stato(key) {
    switch (key) {
      case "home":
        this.setState({
          scelta: [false, false, false, false, false, false],
          professori: [], lista_aule: [], mostra_card: false, aule_prenotate: [], aule_prenotabili: []

        })
        this.updateNavbarColor_dash_home()
        break

      case 0:
        this.setState({
          scelta: [true, false, false, false, false, false],
          professori: [], lista_aule: [], mostra_card: false, aule_prenotate: [],  aule_prenotabili: []
        })
        this.updateNavbarColor_dash_other()
        this.get_referenti_inserisci_locale();
        break

      case 1:
        this.setState({
          scelta: [false, true, false, false, false, false],
          professori: [], lista_aule: [], mostra_card: false, aule_prenotate: [],  aule_prenotabili: []
        })
        this.updateNavbarColor_dash_other()
        break
      case 2:
        this.setState({
          scelta: [false, false, true, false, false, false],
          professori: [], lista_aule: [], mostra_card: false, aule_prenotate: [], map: false,  aule_prenotabili: [], aule_prenotabili_mappa: []
        })
        this.updateNavbarColor_dash_other()
        this.get_locali();
        break
      case 3:
        this.setState({
          scelta: [false, false, false, true, false, false],
          professori: [], lista_aule: [], mostra_card: false, aule_prenotate: [],  aule_prenotabili: []
        })
        this.updateNavbarColor_dash_other()
        break
      case 4:
        this.setState({ scelta: [false, false, false, false, true, false],  aule_prenotabili: [] })
        this.updateNavbarColor_dash_other()
        this.getProfessori();

        break;
      case 5:
        this.setState({
          scelta: [false, false, false, false, false, true],
          professori: [], lista_aule: [], mostra_card: false, aule_prenotate: [],  aule_prenotabili: []
        })
        this.updateNavbarColor_dash_other()
        this.visualizzaPrenotazioni()
        break
    }

  }

  funzione_sfondo () {
    console.log("collapse", this.state.collapseOpen)
    console.log("elemento", document.getElementsByClassName("navbar-nav"))
    console.log("id", document.getElementById("navbar-id"))
    if(this.state.collapseOpen) {
      document.getElementById("navbar-id").style.background = "linear-gradient(0deg, #000000, rgb(49 118 167))"
    }
    else {
      document.getElementById("navbar-id").style.background = "transparent"
    }
  }

  // *******OPERATORE

  add_user() {
    console.log("add user")
    axios.get('http://' + this.props.IP_KEYCLOAK + ':'+this.props.porta_keycloak+'/auth/admin/realms/picus/roles/DOCENTE/users', this.authorizationHeader())
      .then(res => {
        var vect = [];
        var nome = [];
        for (let i = 0; i < res.data.length; i++) {
          vect.push(res.data[i].username)
          nome.push(res.data[i].firstName + " " + res.data[i].lastName)
        }
        console.log("VECT", vect)
        console.log("NOME", nome)
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

  get_locali() {
    axios.get('http://' + this.props.IP + ':'+this.props.porta_server+'/Prenotazione/getLocali', this.authorizationHeader())
      .then(res => {
        console.log("Ecco i risultati: ", res.data)

        if (res.status == 200 && res.data.length != 0) {
          this.setState({ locali: res.data})
        }

        else if (res.status == 200 && res.data.length == 0) {
          //FARE QUALCOSA QUANDO NON CI SONO LOCALI E DIPENDE MOLTO DALLA TABELLA
        }

        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile reperire i Referenti disponibili'
          })
        }
      }
      );
  }

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
            console.log(response)
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

  get_referenti_inserisci_locale() {
    console.log("get referenti_inserisci locali")
    console.log("IP", this.props.IP)
    axios.get("http://" + this.props.IP + ":"+this.props.porta_server+"/Locali/view_referenti", this.authorizationHeader())
      .then(res => {
        if (res.status == 200 && res.data.length != 0) {
          this.setState({ referenti: res.data })
        }
        else if (res.status == 200 && res.data.length == 0) {
          this.setState({ referenti: res.data })
        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile reperire i Referenti disponibili',
            
          })
        }
      })
  }

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

  cambiaColore(elemento) {

    document.getElementById(elemento).style.background = "transparent"
    document.getElementById(elemento).style.borderColor = "#2ca8ff"
  }

  // ******** DOCENTE

  visualizzaPrenotazioni() {

    axios.post('http://' + this.props.IP + ':'+this.props.porta_server+'/PrenotaPosto/visualizzaPrenotazioni',
      { email: this.props.email }, this.authorizationHeader())
      .then(res => {
        console.log("get visualizzaPrenotazioni", res.data)

        if (res.status == 200 && res.data.length != 0) {
          this.setState({ aule_prenotate_visualizza: res.data })
        }
        else if (res.status == 200 && res.data.length == 0) {
          this.setState({ aule_prenotate_visualizza: res.data })

        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile reperire i Professori disponibili',
            
          })
        }
      }
      )
  }

  getProfessori() {
    axios.get("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/getProfessori", this.authorizationHeader()).then(res => {
      console.log("getProfessori", res)
      if (res.status == 200 && res.data.length != 0) {
        this.setState({ professori: res.data })
      }
      else if (res.status == 200 && res.data.length == 0) {
        //  this.setState({professori : {data:[{NOME:"Non ci sono Referenti Disponibili"}]}})
        this.setState({ professori: res.data })
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

  update_foto(url) {
    console.log("url", url)
    console.log("email", this.props.email)

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

  onInputNumeroPartecipanti() {
    var input = document.getElementById("numeropartecipanti");
    var currentVal = input.value;
    this.setState({
      range_numeropartecipanti: currentVal
    })
  }

  //CHECK DISPONIBILITA' AULE CON CARD
  PrenotaAule() {

    console.log("STATO LOCALI", this.state.locali)


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
        console.log("Aule disponibili", res.data)
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
      }
      );
  }

  //CHECK DISPONIBILITA' AULE CON MAPPA
  renderMap() {

    console.log("STATO LOCALI", this.state.locali)
    var locali = []

    let appoggio = []
    var appoggio_esclusi = {}

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
            console.log("Aule prenotabili (VERDI) :", this.state.aule_prenotabili_mappa)

            for(let i=0; i<this.state.locali.length; i++) {
              locali.push(this.state.locali[i].idLOCALE)
              console.log("locali ", this.state.locali[i].idLOCALE)
            }
            console.log("locali totati", locali)

        //trova verdi
        for (let i = 0; i < this.state.aule_prenotabili_mappa.length; i++) {
          try {
            document.getElementById(this.state.aule_prenotabili_mappa[i].idLOCALE).style.fill = "green"
            appoggio.push(this.state.aule_prenotabili_mappa[i].idLOCALE)
          }
          catch (errore) {
            console.log("Non ci sta l'elemento nell'html (GREEN)", errore)
          }
        }

        //trova grigi
        for (let i = 0; i < this.state.locali.length; i++) {
          console.log("["+this.state.locali[i].idLOCALE+"] :"+this.state.locali[i].stato_locale)
          if (this.state.locali[i].stato_locale == "chiuso") {
            console.log("trovato: ",this.state.locali[i].idLOCALE)
            try {
              document.getElementById(this.state.locali[i].idLOCALE).style.fill = "grey"
              appoggio.push(this.state.locali[i].idLOCALE)
            }
            catch (errore) {
              console.log("Non ci sta l'elemento nell'html (GREY)", errore)
            }
          }
        }

        console.log("grigi + verdi", appoggio)

        /*
        
       // for(let k =0; k<appoggio.length; k++) {
          for (var i = 0; i < appoggio_esclusi.length; i++) {
            var obj = appoggio_esclusi[i];
           // console.log("["+appoggio[k]+"] : ["+this.state.locali[i].idLOCALE +"] = "+ appoggio.indexOf(this.state.locali[i].idLOCALE))
           console.log(appoggio.indexOf(obj.idLOCALE))
              if(appoggio[k].indexOf(obj.idLOCALE)) {
                console.log("dentro", obj.idLOCALE)
                try {
                  document.getElementById(appoggio_esclusi[i].idLOCALE).style.fill = "red"
                }
                catch (error) {
                  console.log("Non ci sta l'elemento nell'html (RED)", error)
                }
              }
          }
      //  }

      */

     var locali_filtrati = locali.filter(
      function(e) {
        return this.indexOf(e) < 0;
      },
      appoggio
     );
     console.log("colora di rosso: ",locali_filtrati);

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

  // *********** STUDENTE

  visualizzaPostiDisponibili() {
    let professore = this.state.value
    let data = document.getElementById("dataProf").value
    axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/Prenotazione/ViewPostiDisponibili", {
      prof: professore,
      giorno: data
    }, this.authorizationHeader()).
      then(res => {
        console.log("Ho ricevuto le aule", res)
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

  DisdiciPosto_conferma(elemento) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
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
        console.log(res)
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

  getAulePrenotate() {
    axios.post("http://" + this.props.IP + ":"+this.props.porta_server+"/PrenotaPosto/AulePrenotate", { email: this.props.email }, this.authorizationHeader())
      .then(res => {
        console.log("ricevuto ", res)
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
          <div id="home" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgba(44, 44, 44, 0.2), #021c389c)", minHeight: "none", maxHeight: "none" }}>
            <div
              className="page-header-image"
              style={{
                backgroundImage: "url(" + require("assets/img/header_dieti.jpg") + ")",
              }}
              ref={React.createRef()}
            ></div>
            <Container>
              <div className="content-center brand">
                <h1 className="h1-seo"><img style={{ width: "299px", maxWidth: "none" }}
                  alt="..."
                  className="n-logo"
                  src={require("assets/img/picus.png")}
                ></img>
                </h1>
                <h3>La tua APP per le prenotazioni</h3>
              </div>
            </Container>
          </div>
        }

        {this.state.scelta[2] &&
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
                        <C2A_mappa IP={this.props.IP} email={this.props.email} porta_server= {this.props.porta_server} keycloak={this.props.keycloak} />

                      </Col>
                      <Col sm="3">

                      </Col>
                    </Row>
                  </div>
                }


              </Row>
            </div>
          </div>
        }
        {this.state.scelta[3] &&
          <div>
            <div id="gestisci_prenotazione" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgb(164 147 147 / 20%), rgb(98 115 128 / 9%))",  color: "black", minHeight: "none", maxHeight: "none", height: "auto" }}>
              <div
                className="page-header-image"
                style={{
                }}
                ref={React.createRef()}
              ></div>
              <div>
                <Row>
                  <Col sm="1"></Col>
                  <Col sm="10" style={{ marginTop: "2.7cm" }}>
                    <TabPrenotazioni keycloak={this.props.keycloak} IP={this.props.IP} porta_server={this.props.porta_server} email={this.props.email} />
                  </Col>
                  <Col sm="1"></Col>
                </Row>
              </div></div></div>
        }

        <Row>

          <Chatbot ws={this.props.ws} flag={this.props.flag} email={this.props.email} keycloak={this.props.keycloak} />

        </Row>

      </>
    );
  }
}

export default Docente;
