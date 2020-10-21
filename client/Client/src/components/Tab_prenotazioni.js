import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, Input , Row, Col} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import MenuItem from '@material-ui/core/MenuItem';
import axios from "axios"
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Swal from 'sweetalert2'

class Tab_prenotazioni extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      referenti: [],
      selected: [],
      prenotazioni: [],
      already_get: false,
      locali: []
    }
  }

  componentDidMount() {
    this.get_prenotazioni();
  }
  
  conversionedati(dati) {
    var result = dati
    for (let i = 0; i < dati.length; i++) {
      result[i].data_prenotazione = (dati[i].data_prenotazione.substring(0, 7)) + "-" + (parseInt((dati[i].data_prenotazione.substring(8, 10))) + 1)
      result[i].data_richiesta = dati[i].data_richiesta.substring(0, 7) + "-" + (parseInt((dati[i].data_richiesta.substring(8, 10))) + 1)
    }

    return result

  }

  get_prenotazioni() {

    axios.post('http://' + this.props.IP + ':'+this.props.porta_server+'/Prenotazioni/getPrenotazioni', { email: this.props.email }, this.authorizationHeader())
      .then(res => {
        //var dati = this.conversionedati(res.data)

        if (res.status == 200 && res.data.length != 0) {

          this.setState({ prenotazioni: res.data })
        }
        else if (res.status == 200 && res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non sono presenti prenotazioni',
            
          })
        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile reperire le Prenotazioni',
            
          })
        }
      }
      );
  }

  componentDidUpdate() {
    if (this.state.already_get == false) {
      this.get_locali()
      this.setState({ already_get: true })
    }
  }

  convertilocali(dati) {
    var vect = []
    for (let i = 0; i < dati.length; i++) {
      vect.push(dati[i].idLOCALE)
    }

    return vect
  }

  get_locali() {

    axios.get('http://' + this.props.IP + ':'+this.props.porta_server+'/Prenotazione/getLocali', this.authorizationHeader())
      .then(res => {
        var dati = this.convertilocali(res.data);
        if (res.status == 200 && res.data.length != 0) {
          this.setState({ locali: dati })
        }
        else if (res.status == 200 && res.data.length == 0) {
          this.setState({ locali: dati })
        }
        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile reperire i Referenti disponibili',
            
          })
        }
      }
      );
  }

  componentWillUnmount() {


  }

  static propTypes = {
    value: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    change: PropTypes.func.isRequired
  };

  authorizationHeader() {
    if (!this.props.keycloak) return {};
    return {
      headers: {
        "Authorization": "Bearer " + this.props.keycloak.token,
      }
    };
  }

  handleChange(tabella) {

    let struttura = {
      id_prenotazione: tabella.rowData[0],
      data_prenotazione: tabella.rowData[1],
      data_richiesta: tabella.rowData[3],
      ora_inizio: tabella.rowData[4],
      ora_fine: tabella.rowData[5],
      richiedente: tabella.rowData[2],
      numero_persone: tabella.rowData[6],
      locale: tabella.rowData[7],
      descrizione: tabella.rowData[8],


    }

    this.aggiorna_prenotazione(struttura)


  }
  //OPERAZIONI CRUD
  aggiorna_prenotazione(row) {
    axios.post('http://' + this.props.IP + ':8000/Prenotazioni/aggiornaprenotazione', row, this.authorizationHeader())
      .then(response => {
        if (response.status == 202 && response.data.statusText == "HANDLE ERROR GENERIC" || response.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Qualcosa è andato storto e non è stato possibile aggiornare con successo la tua prenotazione!',
            
          }).then((result) => {

          })
          this.get_prenotazioni();

        }

        else if (response.status == 202 && response.data.statusText == "DATA INCORRETTA") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Data Incorretta',
            
          }).then((result) => {

          })
          this.get_prenotazioni();

        }
        else if (response.status == 202 && response.data.statusText == "ORA INCORRETTA") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ora Incorretta',
            
          }).then((result) => {

          })
          this.get_prenotazioni();

        }
        else if (response.status == 202 && response.data.statusText == "ALREADY USE") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La stanza è già Occupata',
            
          }).then((result) => {

          })
          this.get_prenotazioni();

        }
        else if (response.status == 202 && response.data.statusText == "LOCALE CHIUSO") {
          Swal.fire({
            icon: 'error',
            title: 'La stanza è chiusa.',
            text: '',
            
          }).then((result) => {

          })
          this.get_prenotazioni();

        }
        else if (response.status == 202 && response.data.statusText == "PERSONE ECCESSIVE") {
          Swal.fire({
            icon: 'error',
            title: 'Il numero di persone inserite supera la capienza',
            text: '',
            
          }).then((result) => {

          })
          this.get_prenotazioni();
        }

        else if (response.status == 200 && response.data.statusText == "OK") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Prenotazione aggiornata con Successo',
            showConfirmButton: false,
            timer: 1500
          })

        }
      })
  }

  handleDeleteCat = (rowsDeleted) => {

    var vect = [];

    for (let i = 0; i < rowsDeleted.data.length; i++) {
      vect.push(this.state.prenotazioni[rowsDeleted.data[i].dataIndex].idPRENOTAZIONE)
    }
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Tutte le prenotazioni effettuate dagli studenti saranno cancellate!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancella!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminaprenotazione(vect)

      }
    })



  }

  eliminaprenotazione(vect) {
    axios.post("http://" + this.props.IP + ":8000/Prenotazioni/eliminaprenotazione", {
      idprenotazioni: vect,
    }, this.authorizationHeader())
      .then(response => {

        if (response.status == 202 && response.data.statusText == "HANDLE ERROR GENERIC" || response.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Qualcosa è andato storto e non è stato possibile eliminare con successo le prenotazioni selezionate',
            
          }).then((result) => {
            this.get_prenotazioni();
          })

        }
        else if (response.status == 200 && response.data.statusText == "OK") {
          Swal.fire(
            'Cancellate!',
            'La prenotazione è stata eliminata.',
            'success'
          )

        }


      })
  }

  render() {

    const { value, index, change } = this.props;


    const options = {
      onRowsDelete: (rowsDeleted) => {
        this.handleDeleteCat(rowsDeleted);
      },

      filter: true,
      selectableRows: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPage: 10,
    }

    const columns = [
      {
        label: "ID PRENOTAZIONE",
        name: "idPRENOTAZIONE",
        options: {
          display: false,
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <h6>{value}</h6>
          ),
        }
      },
      {
        label: 'DATA PRENOTAZIONE',

        name: "data_prenotazione",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <h6>{value}</h6>

          )
        }
      },
      {
        label: 'RICHIEDENTE ',
        name: "richiedente",
        options: {
          display: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <h6>{value}</h6>
          )
        }
      },
      {
        label: 'DATA RICHIESTA ',

        name: "data_richiesta",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Input style={{ width: "138px" }}

              value={value}
              type="date"
              onChange={event => updateValue(event.target.value)}

            />
          )
        }
      },
      {
        label: 'ORA INIZIO',

        name: "ora_inizio",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Input style={{ width: "90px" }}

              type="time"
              value={value}

              onChange={event => updateValue(event.target.value)}

            />
          )
        }
      },
      {
        label: 'ORA FINE',
        name: "ora_fine",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Input style={{ width: "90px" }}

              type="time"
              value={value}
              onChange={event => updateValue(event.target.value)}

            />
          )
        }
      },
      {
        label: 'NUMERO PERSONE',

        name: "numero_persone",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Input style={{ width: "50px" }}
              value={value}
              onChange={event => updateValue(event.target.value)}

            />
          )
        }
      },
      {
        label: 'LOCALE PRENOTAZIONE',

        name: "locale",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControl>
              <Select value={value} onChange={event => updateValue(event.target.value, index)} style={{ fontSize: 'inherit' }}
              >
                {this.state.locali.map((scelto, index) =>
                  <MenuItem key={index} value={scelto}>{scelto}</MenuItem>
                )}
              </Select>
            </FormControl>
          )
        }
      },
      {
        label: 'DESCRIZIONE',

        name: "descrizione",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Input style={{ width: "200px" }}
                value={value}
                onChange={event => updateValue(event.target.value)}

              />
            );
          }

        }
      },
      {
        label: '',

        name: "",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <FormControl>
                <Button color="success" onClick={() => this.handleChange(tableMeta)}> Conferma </Button>
              </FormControl>

            );
          },
        }
      },
    ];




    return (
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
                      <MUIDataTable title={"Gestione delle Prenotazioni"} data={this.state.prenotazioni} columns={columns} options={options} />
                      </Col>
                  <Col sm="1"></Col>
                </Row>
              </div>
              </div>
              </div>
    );

  }
}

export default Tab_prenotazioni;
