var express = require("express");
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var db = require("./gestoreDB.js")
var IP_KEYCLOAK = process.env.REACT_APP_HOST_IP_KEYCLOAK
var port_keycloak = process.env.REACT_APP_PORT_KEYCLOAK

//keycloak
const Keycloak = require('keycloak-connect');
var WsController = require("./SocketController.js");
var expressWs = require('express-ws')(app);
var moment = require('moment')

var keycloakConfig ={
    "realm": "picus",
    "auth-server-url": "http://"+IP_KEYCLOAK+":"+port_keycloak+"/auth/",
    "ssl-required": "external",
    "resource": "nodejs",
    "public-client": true,
    "verify-token-audience": true,
    "use-resource-role-mappings": true,
    "confidential-port": 0
  } 
var keycloak = new Keycloak({},keycloakConfig);
app.use( keycloak.middleware( ));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())
app.ws('/chatbot/:nome/:email/:ruolo',WsController);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', "*")
  next();
  });

///////////////////////////////////-------------------OPERATORE---------------------------///////////////////////////////////////////

app.post("/Locali/InserimentoLocale",keycloak.protect("operator"),function (req, result) {
      console.log("[LOG SERVER] Locali/InserimentoLocali")
      console.log(req.body)
      idLocale=req.body.id
      numero_tel = req.body.telefono
      tipologia=req.body.tipologia
      indirizzo=req.body.indirizzo
      superficie = req.body.superficie
      capienza_massima=req.body.capienza
      dipartimento =req.body.dipartimento
      responsabile=req.body.referente
      condiviso=req.body.condivisione
      try{
      esito = db.buildLocali(idLocale,numero_tel,tipologia,condiviso,indirizzo,superficie,capienza_massima,dipartimento,responsabile,function(esito,err){
      console.log("[LOG SERVER] Locali/InserimentoLocali ESITO",esito)
        if (esito==true){
          result.status(200).send("OK")
          }
          else if(esito == false && err.code == "ER_DUP_ENTRY"){
            console.log("TIPE_ERROR",err.code)
            result.status(202).json({
              statusText: 'ID_ALREADY_USE'
          });
            }
            else if(esito == false && err.code == "ER_DATA_TOO_LONG"){
              console.log("TIPE_ERROR",err.code)
              result.status(202).json({
                statusText: 'ER_DATA_TOO_LONG'
            });
              }
            else if(esito == false && err.code == "ER_NO_REFERENCED_ROW_2"){
              console.log("TIPE_ERROR",err.code)
              result.status(202).json({
                statusText: 'NO_REFERENTE'
            });
              }
        else if(esito == false ){
                result.status(202).json({
                statusText: 'HANDLE ERROR GENERIC'
              });
          }
      })
    }
    catch(e){
      console.log("[LOG SERVER] /Locali/InserimentoLocale ",e)
              result.status(202).json({
              statusText: 'INTERNAL SERVER ERROR'
            });
    }
    
})

app.get("/Locali/view_referenti",keycloak.protect("operator"),function(req,result){
  console.log("[LOG SERVER] /Locali/view_referent")
  try{
      db.getReferenti(function(risultati,esito,err){
              console.log("[LOG SERVER] /Locali/view_referent ESITO",esito)
              if (esito==true){
                       var res_http = []
                       for(let i=0;i<risultati.length;i++){
                         res_http.push(risultati[i].email);
                       }
                       result.status(200).send(res_http)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })
}
catch(e){
          console.log("[LOG SERVER] /Locali/view_referenti ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
}
 
})

app.get("/Prenotazione/getLocali",keycloak.protect("docente"),function(req,result){

  console.log("[LOG SERVER] /Locale/getLocali")
  try{
      db.getLocali(function(risultati,esito,err){
              console.log("[LOG SERVER] /Locali/getLocali ESITO",esito)
              if (esito==true){
                  result.status(200).send(risultati)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })
}
catch(e){
        console.log("[LOG SERVER] /Locale/getLocali ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
}
})


app.get("/Locale/getLocali",keycloak.protect("operator"),function(req,result){

  console.log("[LOG SERVER] /Locale/getLocali")
  try{
      db.getLocali(function(risultati,esito,err){
              console.log("[LOG SERVER] /Locali/getLocali ESITO",esito)
              if (esito==true){
                  result.status(200).send(risultati)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })
}
catch(e){
        console.log("[LOG SERVER] /Locale/getLocali ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
}
})

app.post("/Locale/eliminaLocale",keycloak.protect("docente"),function(req,result){
  console.log("[LOG SERVER] /Locale/eliminaLocale") 
  idLocali=req.body.idLOCALi
  var risposta = false
  try{
        db.deleteLocali(idLocali,function(esito,err){
                console.log("[LOG SERVER] /Locale/eliminaLocale ESITO",esito)
                if (esito==true && risposta==false){
                    result.status(200).json({
                      statusText: 'OK'
                  });
                  risposta=true
                 }
                 if (risposta==false && err.code == "ER_ROW_IS_REFERENCED_2"){
                  result.status(202).json({
                    statusText: 'REFERENCED'
                });
                risposta=true
               }
               
               if (esito==true && risposta==false){
                result.status(200).json({
                  statusText: 'OK'
              });
              risposta=true
             }
                else if(esito == false  && risposta==false ){
                      result.status(202).json({
                      statusText: 'HANDLE ERROR GENERIC'
                  });
                  risposta=true
                }
    })
  }
  catch(e){
            console.log("[LOG SERVER] /Locale/eliminaLocale ",e)
            result.status(202).json({
            statusText: 'INTERNAL SERVER ERROR'
          });
  }

    
})

app.post("/Locali/aggiornalocale",keycloak.protect("operator"),function(req,result){

    console.log("[LOG SERVER] /Locali/aggiornalocale") 
    try{
          db.updatelocali(req.body,function(esito,err){
                  console.log("[LOG SERVER] /Locali/aggiornalocale ESITO",esito)
                  if (esito==true){
                      result.status(200).json({
                        statusText: 'OK'
                    });
                   }
                  else if (esito==false && err.code == "ER_DUP_ENTRY" ){
                    result.status(202).json({
                      statusText: 'ID_ALREADY_USE'
                  });
                  }
                  else if(esito == false){
                        result.status(202).json({
                        statusText: 'HANDLE ERROR GENERIC'
                    });
      
                  }
      })
    }
    catch(e){
              console.log("[LOG SERVER] /Locali/aggiornalocale ",e)
              result.status(202).json({
              statusText: 'INTERNAL SERVER ERROR'
            });
    }
    
})

app.post("/Utenti/aggiornaUtenti", keycloak.protect("operator"), function (req, result) {

  console.log("[LOG SERVER] Utenti/aggiornaUtenti")
  try {
    db.update_user(req.body, function (esito, err) {
      console.log("[LOG SERVER] /Utenti/aggiornaUtenti ESITO", esito)
      if (esito == true) {
        result.status(200).json({
          statusText: 'OK'
        });
      }
      else if (esito == false) {
        result.status(202).json({
          statusText: 'HANDLE ERROR GENERIC'
        });

      }
    })
  }
  catch (e) {
    console.log("[LOG SERVER] /Utenti/aggiornaUtenti", e)
    result.status(202).json({
      statusText: 'INTERNAL SERVER ERROR'
    });
  }

})

///////////////////////////////////-------------------STUDENTE---------------------------///////////////////////////////////////////
//INSERIMENTO PRENOTAZIONE  
app.get("/Prenotazione/getProfessori",keycloak.protect("studente"),function(req,result){
  console.log("[LOG SERVER] /Prenotazione/getProfessori") 
  try{
      db.getProfessori(function(risultati,esito,err){
              console.log("[LOG SERVER] /Locali/getLocali ESITO",esito)
              if (esito==true){
                  result.status(200).send(risultati)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })
}
catch(e){
        console.log("[LOG SERVER] /Prenotazione/getProfessori ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
}
})

////INSERIMENTO PROFESSORI E DATA PER PRENOTAZIONE POSTO 
app.post("/Prenotazione/ViewPostiDisponibili", keycloak.protect("studente"),function(req,result){
nome = req.body.prof;
giorno = req.body.giorno;
console.log("req.bod",req.body)
console.log("[LOG SERVER] /Prenotazione/ViewPostiDisponibili") 

try{
    var data = new Date();
    var gg, mm, aaaa;
    gg = data.getDate() ;
    mm = data.getMonth() + 1 ;
    aaaa = data.getFullYear();  
    console.log("calcolo giorno ",gg)
    if (parseInt(giorno.substring(0, 4)) < aaaa) {
      console.log("[SERVER GET VIEW POSTI DISPONIBILI ]ANNO SBAGLIATO")
      result.status(202).json({
        statusText: 'DATA INCORRETTA'
      });
    }
    else if (parseInt(giorno.substring(0, 4)) == aaaa && parseInt(giorno.substring(5, 7)) < mm) {
      result.status(202).json({
        statusText: 'DATA INCORRETTA'
      });
    }
    else if (parseInt(giorno.substring(0, 4)) == aaaa && parseInt(giorno.substring(5, 7)) == mm && parseInt(giorno.substring(8, 10)) < gg) {
      result.status(202).json({
        statusText: 'DATA INCORRETTA'
      });

    }
    else {
    db.visualizzaAule(nome,giorno,function(risultati,esito,err){
            console.log("[LOG SERVER] /Prenotazione/ViewPostiDisponibili",esito)
            if (esito==true){
                result.status(200).send(risultati)
             }
             else if(esito == false || err.code == "ER_WRONG_VALUE"){
              result.status(202).json({
              statusText: 'DATA INCORRETTA'
          });
        }
             
            else if(esito == false ){
                  result.status(202).json({
                  statusText: 'HANDLE ERROR GENERIC'
              });
            }
})
    }
}
catch(e){
      console.log("[LOG SERVER] /Prenotazione/getProfessori ",e)
        result.status(202).json({
        statusText: 'INTERNAL SERVER ERROR'
      });
}
})

app.post("/PrenotaPosto/AulePrenotate", keycloak.protect("studente"), function(req, result) {
let vettore =[]
console.log("[LOG SERVER] /PrenotaPosto/AulePrenotate") 
email=req.body.email
console.log("REQBODY",req.body.email)
try{
    db.getAulePrenotate(email,function(risultati,esito,err){
            console.log("[LOG SERVER] /PrenotaPosto/AulePrenotate ESITO",esito)
            if (esito==true){
              for(let i=0; i<risultati.length; i++) {
                vettore.push(risultati[i].PRENOTAZIONE)
              }
                
                result.status(200).send(vettore)
             }
            else if(esito == false ){
                  result.status(202).json({
                  statusText: 'HANDLE ERROR GENERIC'
              });
            }
})
}
catch(e){
      console.log("[LOG SERVER] /PrenotaPosto/AulePrenotate ",e)
        result.status(202).json({
        statusText: 'INTERNAL SERVER ERROR'
      });
}
})

app.post("/PostiDisponibili/PrenotaPosto",keycloak.protect("studente"),function(req,result){
  console.log("[LOG SERVER] /PostiDisponibili/PrenotaPosto") 
  console.log(req.body)
  data_prenotazione = req.body.data_prenotazione;
  data_richiesta = req.body.data_richiesta;
  descrizione = req.body.descrizione;
  idPRENOTAZIONE = req.body.idPRENOTAZIONE;
  nomeLocale = req.body.local;
  OraInizio = req.body.ora_iniziale;
  OraFinale = req.body.ora_finale;
  postidisp = req.body.posti_disponibili;
  email = req.body.email;
  try{
    db.prenotaPosto(idPRENOTAZIONE, data_prenotazione, data_richiesta, OraInizio, OraFinale, email ,nomeLocale, descrizione,function(esito,err){
            console.log("[LOG SERVER] /PostiDisponibili/PrenotaPosto ESITO",esito)
            if (esito==true){
                result.status(200).send("OK")
             }
             else if(esito == false && err.code=="ER_SIGNAL_EXCEPTION"){
              console.log("ERR.CIDE",err.code)
              result.status(202).json({
              statusText: 'POSTI FINITI'
          });
        }
            else if(esito == false ){
                  console.log("ERR.CIDE",err.code)
                  result.status(202).json({
                  statusText: 'HANDLE ERROR GENERIC'
              });
            }
    })
    }
    catch(e){
      console.log("[LOG SERVER] /PostiDisponibili/PrenotaPosto ",e)
        result.status(202).json({
        statusText: 'INTERNAL SERVER ERROR'
      });
}

})

app.post("/PrenotaPosto/visualizzaPrenotazioni", keycloak.protect("studente"), function(req, result) {
console.log("[LOG SERVER] /PrenotaPosto/visualizzaPrenotazioni") 
email=req.body.email
try{
    db.visualizzaPrenotazioni(email,function(risultati,esito,err){
            console.log("[LOG SERVER] /PrenotaPosto/visualizzaPrenotazioni",esito)
            if (esito==true){              
                result.status(200).send(risultati)
             }
            else if(esito == false ){
                  result.status(202).json({
                  statusText: 'HANDLE ERROR GENERIC'
              });
            }
})
}
catch(e){
      console.log("[LOG SERVER] /PrenotaPosto/visualizzaPrenotazioni ",e)
        result.status(202).json({
        statusText: 'INTERNAL SERVER ERROR'
      });
}
})

app.post("/Prenotazione/EliminaPosto", keycloak.protect("studente"), function(req, result) {
console.log("[LOG SERVER] /Prenotazione/EliminaPosto") 
riga = req.body.riga

try{
    db.eliminaPosto(riga,function(esito,err){
            console.log("[LOG SERVER] /Prenotazione/EliminaPosto",esito)
            if (esito==true){
              
                result.status(200).send("OK")
             }
            else if(esito == false ){
                  result.status(202).json({
                  statusText: 'HANDLE ERROR GENERIC'
              });
            }
})
}
catch(e){
      console.log("[LOG SERVER] /Prenotazione/EliminaPosto ",e)
        result.status(202).json({
        statusText: 'INTERNAL SERVER ERROR'
      });
      
}
})


///////////////////////////////////-------------------DOCENTE---------------------------///////////////////////////////////////////
app.post("/Prenotazione/CheckDisponibilita", keycloak.protect("docente"), function(req, result) {
  console.log("DENTRO VISUALIZZA AULE DISPONIBILI", req.body)
  riga=req.body
  console.log("riga",req.body)
    try{
      
      var data = new Date();
      var gg, mm, aaaa;
      gg = data.getDate() ;
      mm = data.getMonth() + 1 ;
      aaaa = data.getFullYear();  
      minuti=moment().minutes()
      ore=moment().hours()
      input_anno = parseInt(riga.giorno.substring(0,4))
      input_mese = parseInt(riga.giorno.substring(5,7))
      input_giorno = parseInt(riga.giorno.substring(8,10))
      input_ora_ingresso = parseInt(riga.ora_ingresso.substring(0,3))
      input_ora_uscita = parseInt(riga.ora_uscita.substring(0,3))
      input_minuti_ingresso = parseInt(riga.ora_ingresso.substring(3,5))
      input_minuti_uscita = parseInt(riga.ora_uscita.substring(3,5))
      console.log("giorno moderno", gg)
      console.log("mese moderno", mm)
      console.log("anno moderno", aaaa)
      console.log("input_anno", input_anno)
      console.log("input_mese", input_mese)
      console.log("input_giorno", input_giorno)
      console.log("input_ora_ingresso", input_ora_ingresso)
      console.log("input_ora_uscita", input_ora_uscita)


      
      if( input_anno < aaaa ){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      if( input_anno == aaaa && input_mese < mm ){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      if( input_anno == aaaa && input_mese == mm && input_giorno < gg){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      else if( input_anno == aaaa && input_mese == mm && input_giorno == gg && ( ore > input_ora_ingresso ||  ore > input_ora_uscita)) {                  
                console.log("errore su ora giorno uguale")
                result.status(202).json({
                  statusText: 'ORA INCORRETTA'
              });   
      }
      else if( input_anno == aaaa && input_mese == mm && input_giorno == gg && ( input_ora_ingresso == input_ora_uscita) && ( input_minuti_ingresso >= input_minuti_uscita )) { 

        console.log("errore su minuti giorno uguale")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });   
      }
      else if( input_ora_ingresso > input_ora_uscita) {
        console.log("errore ora giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
            
      }
      else if( input_ora_ingresso == input_ora_uscita && input_minuti_ingresso >= input_minuti_uscita) {
        console.log("errore minuti giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
      }
    
      else if( input_ora_ingresso == null || input_minuti_ingresso == null) {
        console.log("errore minuti giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
      }

      else
      {
      db.getAulePrenotabili(riga,function(risultati,esito,err){
              console.log("[LOG SERVER] /Prenotazione/CheckDisponibilita",esito)
              if (esito==true){                
                  result.status(200).send(risultati)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })
}
  }
  catch(e){
        console.log("[LOG SERVER] /Prenotazione/CheckDisponibilita ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
        
  }
})

//aule già prenotate
app.post("/Prenotazione/getAulePrenotateDocente", keycloak.protect("docente"), function(req, result) {
  console.log("DENTRO VISUALIZZA AULE DISPONIBILI", req.body)
  riga=req.body

    try{
      gg = data.getDate() ;
      mm = data.getMonth() + 1 ;
      aaaa = data.getFullYear();  
      minuti=moment().minutes()
      ore=moment().hours()
      input_anno = parseInt(riga.giorno.substring(0,4))
      input_mese = parseInt(riga.giorno.substring(5,7))
      input_giorno = parseInt(riga.giorno.substring(8,10))
     
      /*
      input_ora_ingresso = parseInt(ora_ingresso.substring(0,3))
      input_ora_uscita = parseInt(ora_uscita.substring(0,3))
      input_minuti_ingresso = parseInt(ora_ingresso.substring(3,5))
      input_minuti_uscita = parseInt(ora_uscita.substring(3,5))
      console.log("giorno moderno", gg)
      console.log("mese moderno", mm)
      console.log("anno moderno", aaaa)
      console.log("input_anno", input_anno)
      console.log("input_mese", input_mese)
      console.log("input_giorno", input_giorno)
      console.log("input_ora_ingresso", input_ora_ingresso)
      console.log("input_ora_uscita", input_ora_uscita)

      */

      
      if( input_anno < aaaa ){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      if( input_anno == aaaa && input_mese < mm ){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      if( input_anno == aaaa && input_mese == mm && input_giorno < gg){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }

      /*
      else if( input_anno == aaaa && input_mese == mm && input_giorno == gg && ( ore > input_ora_ingresso ||  ore > input_ora_uscita)) {                  
                console.log("errore su ora giorno uguale")
                result.status(202).json({
                  statusText: 'ORA INCORRETTA'
              });   
      }
      else if( input_anno == aaaa && input_mese == mm && input_giorno == gg && ( input_ora_ingresso == input_ora_uscita) && ( input_minuti_ingresso >= input_minuti_uscita )) { 

        console.log("errore su minuti giorno uguale")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });   
      }
      else if( input_ora_ingresso > input_ora_uscita) {
        console.log("errore ora giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
            
      }
      else if( input_ora_ingresso == input_ora_uscita && input_minuti_ingresso >= input_minuti_uscita) {
        console.log("errore minuti giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
      }
      */
      else
      {
      db.getAulePrenotateDocente(riga,function(risultati,esito,err){
              console.log("[LOG SERVER] /Prenotazione/CheckDisponibilita",esito)
              if (esito==true){                
                  result.status(200).send(risultati)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })
}
  }
  catch(e){
        console.log("[LOG SERVER] /Prenotazione/EliminaPosto ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
        
  }
})

app.post("/Prenotazioni/getPrenotazioni", keycloak.protect("docente"), function (req, result) {

  console.log("[LOG SERVER] /Prenotazioni/getPrenotazioni")
  try {
    email = req.body.email
    db.getPrenotazioni(email, function (risultati, esito, err) {
      console.log("[LOG SERVER] /Prenotazioni/getPrenotazioni ESITO", esito)
      if (esito == true) {
        console.log("[GE PRENOTAZIONI] risultati", risultati)
        result.status(200).send(risultati)
      }
      else if (esito == false) {
        result.status(202).json({
          statusText: 'HANDLE ERROR GENERIC'
        });
      }
    })
  }
  catch (e) {
    console.log("[LOG SERVER] /Prenotazioni/getPrenotazioni ", e)
    result.status(202).json({
      statusText: 'INTERNAL SERVER ERROR'
    });
  }
})

app.post("/Prenotazioni/aggiornaprenotazione", keycloak.protect("docente"), function (req, result) {

  console.log("[LOG SERVER] /Prenotazioni/aggiornaprenotazione")
  try {
    id_prenotazione_q = req.body.id_prenotazione;
    data_prenotazione_q = req.body.data_prenotazione;
    data_richiesta_q = req.body.data_richiesta;
    ora_inizio_q = req.body.ora_inizio;
    ora_fine_q = req.body.ora_fine;
    richiedente_q = req.body.richiedente;
    numero_persone_q = req.body.numero_persone;
    locale_q = req.body.locale;
    descrizione_q = req.body.descrizione
    
    giorno=data_richiesta_q;
    ora_ingresso = ora_inizio_q
    ora_uscita = ora_fine_q
    console.log("GIORNO",giorno)
    console.log("ORA INGRESSO",ora_ingresso)
    console.log("GIORNO",ora_uscita)
    var data = new Date();
      var gg, mm, aaaa;
      gg = data.getDate() ;
      mm = data.getMonth() + 1 ;
      aaaa = data.getFullYear();  
      minuti=moment().minutes()
      ore=moment().hours()
      input_anno = parseInt(giorno.substring(0,4))
      input_mese = parseInt(giorno.substring(5,7))
      input_giorno = parseInt(giorno.substring(8,10))
      input_ora_ingresso = parseInt(ora_ingresso.substring(0,3))
      input_ora_uscita = parseInt(ora_uscita.substring(0,3))
      input_minuti_ingresso = parseInt(ora_ingresso.substring(3,5))
      input_minuti_uscita = parseInt(ora_uscita.substring(3,5))
      console.log("giorno moderno", gg)
      console.log("mese moderno", mm)
      console.log("anno moderno", aaaa)
      console.log("input_anno", input_anno)
      console.log("input_mese", input_mese)
      console.log("input_giorno", input_giorno)
      console.log("input_ora_ingresso", input_ora_ingresso)
      console.log("input_ora_uscita", input_ora_uscita)


      
      if( input_anno < aaaa ){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      if( input_anno == aaaa && input_mese < mm ){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      if( input_anno == aaaa && input_mese == mm && input_giorno < gg){
        
        console.log("errore data")
        result.status(202).json({
          statusText: 'DATA INCORRETTA'
        });
      }
      else if( input_anno == aaaa && input_mese == mm && input_giorno == gg && ( ore > input_ora_ingresso ||  ore > input_ora_uscita)) {                  
                console.log("errore su ora giorno uguale")
                result.status(202).json({
                  statusText: 'ORA INCORRETTA'
              });   
      }
      else if( input_anno == aaaa && input_mese == mm && input_giorno == gg && ( input_ora_ingresso == input_ora_uscita) && ( input_minuti_ingresso >= input_minuti_uscita )) { 

        console.log("errore su minuti giorno uguale")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });   
      }
      else if( input_ora_ingresso > input_ora_uscita) {
        console.log("errore ora giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
            
      }
      else if( input_ora_ingresso == input_ora_uscita && input_minuti_ingresso >= input_minuti_uscita) {
        console.log("errore minuti giorno diverso")
        result.status(202).json({
          statusText: 'ORA INCORRETTA'
      });
      }
    else{
    db.updateprenotazione(id_prenotazione_q,data_prenotazione_q,data_richiesta_q,ora_inizio_q,ora_fine_q,richiedente_q,numero_persone_q,locale_q,descrizione_q, function (esito, err) {
      console.log("[LOG SERVER] /Prenotazioni/aggiornaprenotazione ESITO", esito)

      if (esito == true) {
        result.status(200).json({
          statusText: 'OK'
        });
      }
      else if (esito == false && err.sqlState == 50000) {

        result.status(202).json({
          statusText: 'ALREADY USE'
        });

      }
      else if (esito == false && err.sqlState == 60000) {

        result.status(202).json({
          statusText: 'LOCALE CHIUSO'
        });

      }
      else if (esito == false && err.sqlState == 70000) {

        result.status(202).json({
          statusText: 'PERSONE ECCESSIVE'
        });

      }
      else if (esito == false) {

        result.status(202).json({
          statusText: 'HANDLE ERROR GENERIC'
        });

      }
    })
  }
  }
  catch (e) {
    console.log("[LOG SERVER] /Prenotazioni/aggiornaprenotazione ", e)
    result.status(202).json({
      statusText: 'INTERNAL SERVER ERROR'
    });
  }

})

app.post("/Prenotazioni/eliminaprenotazione", keycloak.protect("docente"), function (req, result) {
  console.log("[LOG SERVER] Prenotazioni/eliminaprenotazione")
  idprenotazioni = req.body.idprenotazioni
  var risposta = false
  try {
    db.deleteprenotazioni(idprenotazioni, function (esito, err) {
      console.log("[LOG SERVER] Prenotazioni/eliminaprenotazione ESITO", esito)
      if (esito == true && risposta == false) {
        result.status(200).json({
          statusText: 'OK'
        });
        risposta = true
      }
      else if (esito == false && risposta == false) {
        result.status(202).json({
          statusText: 'HANDLE ERROR GENERIC'
        });
        risposta = true
      }
    })
  }
  catch (e) {
    console.log("[LOG SERVER] Prenotazioni/eliminaprenotazione ", e)
    result.status(202).json({
      statusText: 'INTERNAL SERVER ERROR'
    });
  }


})

app.post("/Docente/updatefoto", keycloak.protect("docente"), function (req, result) {
  console.log("[LOG SERVER] Docente/updatefoto")
  
 
  try {
    db.updatefoto(req.body, function (esito, err) {
      console.log("[LOG SERVER] Docente/updatefoto ESITO", esito)
      if (esito == true) {
        result.status(200).json({
          statusText: 'OK'
        });

      }
      else if (esito == false ) {
        result.status(202).json({
          statusText: 'HANDLE ERROR GENERIC'
        });
     
      }
    })
  }
  catch (e) {
    console.log("[LOG SERVER]  Docente/updatefoto ", e)
    result.status(202).json({
      statusText: 'INTERNAL SERVER ERROR'
    });
  }


})




//buildPrenotazione
app.post("/Prenotazione/InserimentoPrenotazione", keycloak.protect("docente"), function(req, result) {
  console.log("Prenotazione/InserimentoPrenotazione", req.body)
  nome_locale = req.body.id_locale
  giorno = req.body.giorno
  ora_ingresso = req.body.ora_ingresso
  ora_uscita = req.body.ora_uscita
  numero_partecipanti = req.body.numero_partecipanti
  area_text = req.body.descrizione
  email_q = req.body.email
    try{
      db.buildPrenotazioni(nome_locale, giorno, ora_ingresso, ora_uscita, numero_partecipanti, area_text ,email_q,function(esito,err){
              console.log("[LOG SERVER] Prenotazione/InserimentoPrenotazione",esito)
              if (esito==true){                
                  result.status(200).send("OK")
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }

              else if (esito == false && err.sqlState == 50000) {
                result.status(202).json({
                  statusText: 'NON PUOI PRENOTARE'
                });
              }

              else if (esito == false && err.sqlState == 60000) {
                result.status(202).json({
                  statusText: 'LOCALE CHIUSO'
                });
              }

              else if (esito == false && err.sqlState == 70000) {
                result.status(202).json({
                  statusText: 'PERSONE ECCESSIVE'
                });
              }
  })

  }
  catch(e){
        console.log("[LOG SERVER] Prenotazione/InserimentoPrenotazione ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
        
  }
})

app.get("/Prenotazione/getAuleChiuse", keycloak.protect("docente"), function(req, result) {
  console.log("DENTRO get aule chiuse", req.body)
  console.log("riga",req.body)
    try{
      
     
      db.getAuleChiuse(function(risultati,esito,err){
              console.log("[LOG SERVER] /Prenotazione/getAuleChiuse",esito)
              if (esito==true){                
                  result.status(200).send(risultati)
               }
              else if(esito == false ){
                    result.status(202).json({
                    statusText: 'HANDLE ERROR GENERIC'
                });
              }
  })

  }
  catch(e){
        console.log("[LOG SERVER] /Prenotazione/getAuleChiuse ",e)
          result.status(202).json({
          statusText: 'INTERNAL SERVER ERROR'
        });
        
  }
})



app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).json({
    statusText: 'La pagina non esiste amico'
});
});


app.listen(8000, "0.0.0.0");
console.log("YOU ARE UP on 8000 port");
