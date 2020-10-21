import React from "react";
import axios from "axios"
import Swal from 'sweetalert2'
// reactstrap components
import {
  CardFooter,
  Card,
  CardHeader,
  FormGroup,
  Label,
  CardBody,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";

class CardAule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          flag : false           
          };
    }
    authorizationHeader() {
      if (!this.props.keycloak) return {};
      return {
        headers: {
          "Authorization": "Bearer " + this.props.keycloak.token,
        }
      };
    }
    
    prenotaAula() {

      let struttura = {
        giorno: document.getElementById("Date").value,
        ora_ingresso: document.getElementById("timeIN").value,
        ora_uscita: document.getElementById("timeOUT").value,
        numero_partecipanti:  document.getElementById("numeropartecipanti").value,
        descrizione : document.getElementById("id"+this.props.key_p).value,
        id_locale : this.props.aule.idLOCALE,
        email : this.props.email
      }
      
      axios.post('http://'+this.props.IP+':'+this.props.porta_server+'/Prenotazione/InserimentoPrenotazione',struttura,this.authorizationHeader())
      .then(res => {

        if (res.status == 200 ) {
          this.setState({ flag : true})
          Swal.fire({
            position: 'central',
            icon: 'success',
            title: 'Aula prenotata con successo',
            showConfirmButton: false,
            timer: 1500
          })
        }

        else if (res.status == 202 && res.data.statusText == "HANDLE ERROR GENERIC" || res.data.statusText == "INTERNAL SERVER ERROR") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non è stato possibile prenotare il locale selezionato'
          })
        }   
      }
  )
  
  }
    render() {
    
        return (
            <>
            <Container style={{color: "black",maxWidth: "8cm",minWidth:"8cm",minHeight:"8cm",maxHeight:"8cm"}}>
                    <Card>
                      <CardHeader className="nav-tabs-neutral justify-content-center">
                      <Nav className="nav-tabs-neutral justify-content-center" data-background-color="blue" role="tablist" tabs >
                      <h6>{this.props.aule.idLOCALE}</h6>
                      </Nav>
                                </CardHeader>
                                      <CardBody>
                                      <Row style={{marginLeft: "0"}}>
                                      <Col sm="7">                                        
                                        <Row style={{paddingBottom: "0.1cm"}} className="nav-tabs-neutral justify-content-center" > <h6> <b> TIPOLOGIA</b></h6> </Row>                                     
                                        <Row style={{paddingBottom: "0.1cm"}} className="nav-tabs-neutral justify-content-center"> <h6> <b>CAPIENZA MASSIMA </b> </h6></Row>        
                                        
                                      </Col>
                                      <Col sm="5">
                                        <Row style={{paddingBottom: "0.1cm"}}  className="nav-tabs-neutral justify-content-center"><h6>{this.props.aule.tipologia}</h6></Row>                                   
                                        <Row style={{paddingBottom: "0.1cm"}} className="nav-tabs-neutral justify-content-center"><h6> {this.props.aule.capienza_massima}</h6></Row>                                
                                                                          
                                      </Col>
                                      </Row>
                                        <Row>
                                        <Input id={"id" + this.props.key_p}  style={{textAlign:"center"}} type="textarea" name="text"  placeholder="DESCRIZIONE LEZIONE"/>                                                                                                                                                 
   
                                          </Row>   
                                      <CardFooter>
                                        {!this.state.flag ? 
                              
                                        <Button  className="btn-round" color="info" type="button" onClick = {() =>this.prenotaAula()} >                                        
                                         Prenota Aula
                                        </Button>
                                        :
                                        <Button  className="btn-round" color="danger" type="button" >                                        
                                        Aula prenotata
                                       </Button>
                                        }
                                      </CardFooter>                                      
                                      </CardBody>
                                      </Card>
                                      </Container>
          
          </>
        )}
}
export default CardAule;
