import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Button,Input, Row, Col} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import MenuItem from '@material-ui/core/MenuItem';
import axios from "axios"
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Swal from 'sweetalert2'

class Tab_locali extends React.Component {

    constructor(props) {
        super(props)
        this.state ={
          referenti : [],
          already_get : false,
          selected : [],
          locali : []
        }
    }
    
    componentDidMount(){
      this.get_locali();
    }

  /*
  questa funzione viene richiamata al click di "Inserisci una prenotazione" per riempire lo stato 'locali'
  il quale verrà utilizzato per tenere conto di TUTTI i locali presenti al momento nel DB
  */
    get_locali(){
      axios.get('http://'+this.props.IP+':'+this.props.porta_server+'/Locale/getLocali',this.authorizationHeader())
      .then(res => {         
         if(res.status==200 && res.data.length!=0 ){
          this.setState({locali:res.data})
        }
        else if(res.status==200 && res.data.length==0){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Al momento non sono presenti Locali.\nProva ad inserirne qualcuno'
          })
        }
        else if(res.status==202 && res.data.statusText=="HANDLE ERROR GENERIC" || res.data.statusText=="INTERNAL SERVER ERROR"){
           Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Non è stato possibile reperire i Referenti disponibili',
          
        })
        }
      }
      );
    }
    
    componentDidUpdate(){
      if(this.state.already_get==false){
        this.getDocenti()
        this.setState({already_get:true})
      }
    }
    
    componentWillUnmount(){
      this.setState({already_get:false})
  
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired
    };

    getDocenti(){
        axios.get("http://"+this.props.IP+":"+this.props.porta_server+"/Locali/getDocenti",this.authorizationHeader())
              .then(res => {
              if(res.status==200 && res.data.length!=0 ){
                this.setState({referenti:res.data})
              }
              
              else if(res.status==202 && res.data.statusText=="HANDLE ERROR GENERIC" || res.data.statusText=="INTERNAL SERVER ERROR"){
                 Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Non è stato possibile reperire i Referenti disponibili',
                
              })
              }
              })
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
    questa funzione viene utilizzata per effettuare un'update, al click del bottone "CONFERMA", 
    della riga in questione. Vengono passati, ad una variable struttura, tutti i campi della 
    tupla della tabella UTENTE
    */
    aggiornaLocale(tabella) { 
        let struttura = {
            idLOCALE: tabella.rowData[0],
            numero_tel: tabella.rowData[1],
            tipologia:tabella.rowData[2],
            condiviso: tabella.rowData[3],
            inidirizzo: tabella.rowData[4],
            superficie:tabella.rowData[5],
            capienza_massima: tabella.rowData[6],
            dipartimento: tabella.rowData[7],
            responsabile: tabella.rowData[8],
            stato_locale: tabella.rowData[9],
            id_vecchio  : tabella.tableData[tabella.rowIndex].idLOCALE,
        }

      axios.post('http://'+this.props.IP+':'+this.props.porta_server+'/Locali/aggiornalocale',struttura,this.authorizationHeader())
      .then(response => {
        if(response.status==202 && response.data.statusText=="ID_ALREADY_USE"){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile aggioranre il locale : Id già utilizzato ',
                     
          }).then(()=>{
            this.get_locali();
        })
          
        }
        if(response.status==202 && response.data.statusText=="HANDLE ERROR GENERIC" || response.data.statusText=="INTERNAL SERVER ERROR"){      
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Qualcosa è andato storto e non è stato possibile aggiornare con successo i Locali Selezionati',
                     
          }).then(()=>{
            this.get_locali();
        })
          
        }
        else if (response.status==200 && response.data.statusText=="OK"){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Locale Aggiornato con Successo',
              showConfirmButton: false,
              timer: 1500
            })
            
          }
     })      
    }

    /*
    questa funzione ha le stesse caratteristiche di aggiornaLocale -> viene richiamata al click
    dell'icona del cestino nella tabella e la corrispondente tupla nel DB viene eliminata.
    */
    elimina_locale = (rowsDeleted) => {
        
        var vect = [];
        for(let i=0;i<rowsDeleted.data.length;i++){
          vect.push(this.state.locali[rowsDeleted.data[i].dataIndex].idLOCALE)
        }

        axios.post("http://"+this.props.IP+":"+this.props.porta_server+"/Locale/eliminaLocale", {
          idLOCALi: vect,
          },this.authorizationHeader())
          .then(response => {
            if(response.status==202 && response.data.statusText=="REFERENCED"){      
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hai selezionato un locale che referenzia una prenotazione esistente',
                         
              }).then(()=>{
                  this.get_locali();
              })
            }
            else if(response.status==204 && response.data.statusText=="HANDLE ERROR GENERIC" || response.data.statusText=="INTERNAL SERVER ERROR"){      
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Qualcosa è andato storto e non è stato possibile eliminare con successo i Locali Selezionati',
                         
              }).then(()=>{
                this.get_locali();
            })
              
            }
            else if (response.status==200 && response.data.statusText=="OK"){
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Locali Eliminati con Successo',
                  showConfirmButton: false,
                  timer: 1500
                })
               
              }
            })
        
    }
    
 
  render() {
      
      const { value, index, change } = this.props;
      const selezioni = ["Aula studio", "Laboratorio"]
      const condiviso = ["Locale a uso singolo","Locale a uso condiviso"]
      const dipartimento = ["DIETI"]
      const stato = ["aperto","chiuso"]
      
      const options = {
  
        
        onRowsDelete: (rowsDeleted) => {
        this.elimina_locale(rowsDeleted);
        },

        filter: false,
        selectableRows: true,
        filterType: 'dropdown',
        responsive: 'stacked',
        rowsPerPage: 10,
        }

      const columns = [
          {
            label: "Locale id",  
            name: "idLOCALE",
            options: {
              filter: false,
              customBodyRender: (value, tableMeta,updateValue) => (
                <Input style={{width:"96px"}}
                value={value}

          onChange={event =>             updateValue(event.target.value)}
               
                />
              ),

            }
          },
          {  label: 'Telefono',

            name: "numero_tel",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => (
                <Input style = {{width:"148px"}}
                value={value}

          onChange={event => updateValue(event.target.value)}
                
                />
              )
            }
          },
          {  label: 'Tipologia',

            name: "tipologia",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <FormControl 
 
                  >
                  <Select value={value} onChange={event => updateValue(event.target.value, index)} 
                  style={{fontSize: 'inherit'}} 

                  >
                    { selezioni.map((scelto, index) =>
                      <MenuItem key={index} value={scelto}>{scelto}</MenuItem>
                    )}
                  </Select>
                </FormControl>
      
                );
              },
            }
          },
          {  label: 'Condivisione',

            name: "condiviso",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <FormControl>
                  <Select value={value} onChange={event => updateValue(event.target.value, index)} style={{fontSize: 'inherit'}}>
                    { condiviso.map((scelto, index) =>
                      <MenuItem key={index} value={scelto}>{scelto}</MenuItem>
                    )}
                  </Select>
                </FormControl>
      
                );
              },
            }
          },
          {  label: 'Indirizzo',
            name: "indirizzo",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => (
                <Input style = {{width:"148px"}}
                  value={value}
                  onChange={event => updateValue(event.target.value)}

                />
              )
            }
          },
          {  label: 'Superficie',

            name: "superficie",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => (
                <FormControlLabel
                  value={value}
                  control={<TextField value={value} />}
                  onChange={event => updateValue(event.target.value)}
                />
              )
            }
          },
          {  label: 'Capienza MAX',

            name: "capienza_massima",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => (
                <FormControlLabel 
                  value={value}
                  control={<TextField value={value} />}
                  onChange={event => updateValue(event.target.value)}
                />
              )
            }
          },
          {  label: 'Dipartimento',

            name: "dipartimento",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <FormControl                >
                  <Select value={value} onChange={event => updateValue(event.target.value, index)} style={{fontSize: 'inherit'}}>
                    { dipartimento.map((scelto, index) =>
                      <MenuItem key={index} value={scelto}>{scelto}</MenuItem>
                    )}
                  </Select>
                </FormControl>
      
                );
              },
            }
          },
          {  label: 'Responsabile',

            name: "responsabile",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                <FormControl>
                  <Select value={value} onChange={event => updateValue(event.target.value, index)} style={{fontSize: 'inherit'}} 
                   >
                    { this.state.referenti.map((scelto, index) =>
                      <MenuItem key={index} value={scelto}>{scelto}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                );
                    }
              
            }
          },
          {  label: 'Locale stato',

            name: "stato_locale",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <FormControl>
                  <Select value={value} onChange={event => updateValue(event.target.value, index)} style={{fontSize: 'inherit'}}>
                    { stato.map((scelto, index) =>
                      <MenuItem key={index} value={scelto}>{scelto}</MenuItem>
                    )}
                  </Select>
                </FormControl>
      
                );
              },
            }
          },
          {  label: '',

            name: "",
            options: {
              filter: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <FormControl>
                 <Button color="success" onClick={() => this.aggiornaLocale(tableMeta)}> Conferma </Button>
                </FormControl>
      
                );
              },
            }
          },
        ];
      
     
    

    return (
      <div>
      <div id="gestisci_locale" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgb(164 147 147 / 20%), rgb(98 115 128 / 9%))",  color: "black", minHeight: "none", maxHeight: "none", height: "auto" }}>
        <div
          className="page-header-image"
          style={{
          }}
          ref={React.createRef()}
        ></div>

        <Row >
          <Col sm="1"></Col>
          <Col sm="10" style={{ marginTop: "2.7cm" }}>
        <div>


      <MUIDataTable title={"Gestione dei Locali"} data={this.state.locali} columns={columns} options={options} />
      </div>
      </Col>
                <Col sm="1"></Col>
              </Row>



            </div>
          </div>
    );

  }
}

export default Tab_locali;
