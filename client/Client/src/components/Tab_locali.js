import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Button,Input} from 'reactstrap';
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

    get_locali(){
      console.log("getLocali",this.props.keycloak.token)
      axios.get('http://'+this.props.IP+':'+this.props.porta_server+'/Locale/getLocali',this.authorizationHeader())
      .then(res => {
         console.log("Ecco i risultati: ",res.status)
         
         if(res.status==200 && res.data.length!=0 ){
          this.setState({locali:res.data})
        }
        else if(res.status==200 && res.data.length==0){
          //FARE QUALCOSA QUANDO NON CI SONO LOCALI E DIPENDE MOLTO DALLA TABELLA
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
        
     
        this.get_referenti_inserisci_locale()
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
    get_referenti_inserisci_locale(){
        axios.get("http://"+this.props.IP+":"+this.props.porta_server+"/Locali/view_referenti",this.authorizationHeader())
              .then(res => {
              if(res.status==200 && res.data.length!=0 ){
                this.setState({referenti:res.data})
                console.log("referenti",this.state.referenti)
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
    authorizationHeader() {
      if(!this.props.keycloak) return {};
      return {
        headers: {
        "Authorization"                 : "Bearer " + this.props.keycloak.token,
        }
      };
    }
    aggiorna_locale(row){
      axios.post('http://'+this.props.IP+':'+this.props.porta_server+'/Locali/aggiornalocale',row,this.authorizationHeader())
      .then(response => {
        console.log(response.status,response.data.statusText)
        if(response.status==202 && response.data.statusText=="ID_ALREADY_USE"){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile aggioranre il locale : Id già utilizzato ',
                     
          }).then((result)=>{
            this.get_locali();
        })
          
        }
        if(response.status==202 && response.data.statusText=="HANDLE ERROR GENERIC" || response.data.statusText=="INTERNAL SERVER ERROR"){      
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Qualcosa è andato storto e non è stato possibile aggiornare con successo i Locali Selezionati',
                     
          }).then((result)=>{
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
    elimina_locale(vect){
    axios.post("http://"+this.props.IP+":"+this.props.porta_server+"/Locale/eliminaLocale", {
    idLOCALi: vect,
    },this.authorizationHeader())
    .then(response => {
      if(response.status==202 && response.data.statusText=="REFERENCED"){      
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hai selezionato un locale che referenzia una prenotazione esistente',
                   
        }).then((result)=>{
            this.get_locali();
        })
        
      }
      else if(response.status==204 && response.data.statusText=="HANDLE ERROR GENERIC" || response.data.statusText=="INTERNAL SERVER ERROR"){      
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Qualcosa è andato storto e non è stato possibile eliminare con successo i Locali Selezionati',
                   
        }).then((result)=>{
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
    handleChange(tabella) {

      console.log("TAB",tabella)
      
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
        console.log("tabella",tabella.rowData)
        this.aggiorna_locale(struttura)  
       
          
    }
    handleDeleteCat = (rowsDeleted) => {
        
        var vect = [];
        
        for(let i=0;i<rowsDeleted.data.length;i++){
          vect.push(this.state.locali[rowsDeleted.data[i].dataIndex].idLOCALE)
        }
        this.elimina_locale(vect)
        
    }
    
 
  render() {
      
      const { value, index, change } = this.props;
      const selezioni = ["Aula studio", "Laboratorio"]
      const condiviso = ["Locale a uso singolo","Locale a uso condiviso"]
      const dipartimento = ["DIETI"]
      const stato = ["aperto","chiuso"]
      
      const options = {
  
        
        onRowsDelete: (rowsDeleted) => {
        this.handleDeleteCat(rowsDeleted);
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
                 <Button color="success" onClick={() => this.handleChange(tableMeta)}> Conferma </Button>
                </FormControl>
      
                );
              },
            }
          },
        ];
      
     
    

    return (
        <div>


      <MUIDataTable title={"Gestione dei Locali"} data={this.state.locali} columns={columns} options={options} />
      </div>

    );

  }
}

export default Tab_locali;
