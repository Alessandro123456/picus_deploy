let list = require('italian-badwords-list')
var db = require("./gestoreDB.js")
var moment = require('moment')


let array = list.array
let appoggio = []

module.exports = (ws, req) => {
  console.log("SOCKET AVVIATA")
  let cont = 1;

    ws.on("message", messaggio => {
      if(cont ==1) {      
        //var stringArray = messaggio.split(/(\s+)/);
        //console.log("riga", stringArray)
        //for(let i=0; i<stringArray.length; i++) {


        //}
      console.log("req.params.nome", req.params.nome)
      console.log("req.params.email", req.params.email)
      console.log("req.params.ruolo", req.params.ruolo)
      ws.send("Benvenuto "+req.params.nome+ " sono Picus, il tuo chatbot personale 🤖. Vedo che sei "+req.params.ruolo+" .\n"+
      "Vuoi che ti aiuti?");
      cont++
      }
      else {
        switch(req.params.ruolo) {
          
         


          case "docente":
            console.log("entro in docente")

            console.log("msg", messaggio)
            

            let msg_docente = messaggio.toLowerCase()
 
            let presente_docente = false
            for(let i=0; i<array.length; i++) {
              if(msg_docente.includes(array[i])) {
                console.log("dentro parolaccia")
                presente_docente = true
              }
            }
 
             
             if(cont == 2 &&  (msg_docente.includes("ciao") || msg_docente.includes("ehi") || msg_docente.includes("we") || msg_docente.includes("salve" ) || msg_docente.includes("ohi") || msg_docente.includes("hello") || msg_docente.includes("hi"))) {
               ws.send("Ehi! Mi sbaglio o ci siamo già salutati? 🤣")
             }

             else if(cont == 2  &&(msg_docente.includes("si") || msg_docente.includes("ok") || msg_docente.includes("va bene") || msg_docente.includes("d'accordo" ) || msg_docente.includes("daccordo") || msg_docente.includes("cosa sai fare")) ) {
               ws.send("In quanto docente, ti elenco le funzionalità che posso fare per te: \n"+ 
               "1) Posso riportarti la lista delle aule che hai prenotato \n"+
               "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
               "... \n"+
               "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
               
             }
             
           
             else if(cont == 2 &&(msg_docente.includes("no") || msg_docente.includes("nono") || msg_docente.includes("no grazie") || msg_docente.includes("statt zitt"))) {
              ws.send("Ok buon lavoro ! \n"+
              "Io inizio a fumare un sigaro \n"+
              "Qualora ti servisse aiuto scrivimi Ehi Picus" );
              cont = "attesa";
              
             }
             else if(cont == 2  &&  (msg_docente.includes("emojichat"))) {
              ws.send("Ma che bella questa emoji 👏👏")
            }
             else if(cont == "attesa" &&(msg_docente.includes("Ehi Picus") || msg_docente.includes("EHI PICUS") || msg_docente.includes("ehi picus") || msg_docente.includes("picus") || msg_docente.includes("ehi Picus"))) {
              ws.send("Rieccomi Prof " +req.params.nome+ " ti elenco le funzionalità che posso fare per te: \n"+ 
              "1) Posso riportarti la lista delle aule che hai prenotato \n"+
              "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
              "... \n"+
              "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
              cont=2;
             }
            
 
             
 
             else if(cont == 2  && (msg_docente.includes("lista") || msg_docente.includes("1") || msg_docente.includes("visualizzare") || msg_docente.includes("visualizza aule") || msg_docente.includes("mie aule") || msg_docente.includes("vedere") || msg_docente.includes("prenotate"))){
              ws.send("Vorresti visualizzare le aule prenotate?")
              cont = "visualizza"

           }

            else if(cont == 2  && (msg_docente.includes("studenti") || msg_docente.includes("2") || msg_docente.includes("visualizza studenti") || msg_docente.includes("lista studenti"))){
                ws.send("Vorresti visualizzare la lista degli studenti?")
                cont = "studenti"
 
             }

             else if(cont == "studenti" && (msg_docente.includes("si") || msg_docente.includes("yes") || msg_docente.includes("ok") || msg_docente.includes("va bene"))) {
              ws.send("Ok, ti do una mano nella ricerca. Tu hai prenotate le sequenti aule:")
              try{
               
                db.getAulePrenotateDocente(req.params.email,function(risultati,esito,err){
                        console.log("[LOG SERVER] /Prenotazione/VisualizzaAulePrenotateDocente",esito)
                        if (esito==true){  
  
                          if(risultati.length !=0) {
                            ws.send("Voilà! \n")
                            for(let i=0; i<risultati.length; i++) {
                              ws.send("Aula: ["+risultati[i].locale +"] con ID = "+risultati[i].idPRENOTAZIONE +"\n"+
                              "Giorno della prenotazione: "+ risultati[i].data_richiesta +" \n"+
                              "Dalle: "+ risultati[i].ora_inizio +" alle: "+ risultati[i].ora_fine)
                              appoggio.push(risultati[i].idPRENOTAZIONE)
                              
                            }
                            console.log("appoggio", appoggio)
                            ws.send("Ecco qui! Ora mi servirebbe l' ID della prenotazione che hai scelto. \n")
                            cont = "termina studenti"
                          } 
                          else{
                            ws.send("Mi dispiace, ma non hai nessuna aula prenotata al momento")
                          }
                         }
                        else if(esito == false ){
                          ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova: \n"+
                          "1) Posso riportarti la lista delle aule che hai prenotato \n"+
               "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
               "... \n"+
               "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
                          cont = 2
                        }
            })
          
            }
            catch(e){
              console.log("errore catch", e)
              ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova \n"+
              "1) Posso riportarti la lista delle aule che hai prenotato \n"+
               "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
               "... \n"+
               "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
              cont = 2
                  
            }

           }

           else if (cont == "termina studenti" && appoggio.includes(parseInt(msg_docente))) {

            try{
               
              db.get_utenti_prenotati(msg_docente,function(risultati,esito,err){
                      console.log("[LOG SERVER] get_utenti_prenotati",esito)
                      if (esito==true){ 

                        if(risultati.length !=0) {
                          ws.send("Voilà! \n")
                          for(let i=0; i<risultati.length; i++) {
                            ws.send("Studente: "+risultati[i].studente)
                          }
                          ws.send("Fatto! Se vuoi posso: \n" +
                          "1) Posso riportarti la lista delle aule che hai prenotato \n"+
                          "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
                          "... \n"+
                          "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
                          cont = 2
                        } 
                        else {
                          ws.send("Mi dispiace ma non ci sono studenti prenotati per questo ID")
                          cont = 2

                        }
                       }
                      else if(esito == false ){
                        ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova: \n"+
                        "1) Posso riportarti la lista delle aule che hai prenotato \n"+
             "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
             "... \n"+
             "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
                        cont = 2
                      }
          })
        
          }
          catch(e){
            console.log("errore catch", e)
            ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova \n"+
            "1) Posso riportarti la lista delle aule che hai prenotato \n"+
             "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
             "... \n"+
             "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
            cont = 2
                
          }


           }

             
            else if(cont == "visualizza" && (msg_docente.includes("si") || msg_docente.includes("yes") || msg_docente.includes("ok") || msg_docente.includes("va bene"))) {
               ws.send("Ok, vado a controllare la lista di aule che hai prenotato 😄")      
             try{
               
               db.getAulePrenotateDocente(req.params.email,function(risultati,esito,err){
                       console.log("[LOG SERVER] /Prenotazione/VisualizzaAulePrenotateDocente",esito)
                       if (esito==true){  
 
                         if(risultati.length !=0) {
                           ws.send("Voilà! \n")
                           for(let i=0; i<risultati.length; i++) {
                             ws.send("Aula: ["+risultati[i].locale +"] \n"+
                             "Giorno della prenotazione: "+ risultati[i].data_richiesta +" \n"+
                             "Dalle: "+ risultati[i].ora_inizio +" alle: "+ risultati[i].ora_fine)
                           }
                           cont = 2              

                         }
                         else {
                           ws.send("Mi dispiace, al momento non hai aule prenotate")
                           cont = 2              
                         } 
                        }
                       else if(esito == false ){
                        ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova \n"+
                        "1) Posso riportarti la lista delle aule che hai prenotato \n"+
                         "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
                         "... \n"+
                         "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
                        cont = 2              
                      }
           })
         
           }
           catch(e){
             console.log("errore catch", e)
             ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova \n"+
             "1) Posso riportarti la lista delle aule che hai prenotato \n"+
              "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
              "... \n"+
              "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
                 cont = 2              
                 
           }
         }
 
 
              else if (cont == "visualizza" && ! (msg_docente.includes("si") || msg_docente.includes("ok") || msg_docente.includes("va bene"))){
               ws.send("Mi dispiace, ho annullato la richiesta 😥. Hai scritto, ad esempio, 'si' oppure 'ok' ? Rifammi la richiesta dall'inizio se vuoi 😅")
               cont = 2
              }
             
             
       
             else if (msg_docente =="closed") {
                 console.log("SOCKET CHIUSA ")                
                 ws.terminate()
 
             }     
 
             else {
                 if (presente_docente)
                     ws.send("Ehi "+req.params.nome+"! Non essere così cattivo con me 😞")
                 else
                     ws.send("Mi dispiace, ma non sono stato programmato per poter gestire questo tipo di richieste 😎")
 
             }

             break;


          case "studente":
            console.log("entro in studente")

            console.log("msg", messaggio)
            

            let msg_studente = messaggio.toLowerCase()
 
            let presente_studente = false
            for(let i=0; i<array.length; i++) {
              if(msg_studente.includes(array[i])) {
                console.log("dentro parolaccia")
                presente_studente = true
              }
            }
 
             
             if(cont == 2 &&  (msg_studente.includes("ciao") || msg_studente.includes("ehi") || msg_studente.includes("we") || msg_studente.includes("salve" ) || msg_studente.includes("ohi") || msg_studente.includes("hello") || msg_studente.includes("hi"))) {
               ws.send("Ehi! Mi sbaglio o ci siamo già salutati? 🤣")
             }
             else if(cont == 2  &&(msg_studente.includes("si") || msg_studente.includes("ok") || msg_studente.includes("va bene") || msg_studente.includes("d'accordo" ) || msg_studente.includes("daccordo") || msg_studente.includes("cosa sai fare") || msg_studente.includes("start")) ) {
               ws.send("In quanto studente, ti elenco le funzionalità che posso fare per te: \n"+ 
               " Posso riportarti la lista delle aule a cui ti sei prenotato \n"+
               "Ti basta digitare la parola 'posto', oppure 'mio posto ");
               cont=2;
              
             }
            
             
            
             else if(cont == 2 &&(msg_studente.includes("no") || msg_studente.includes("nono") || msg_studente.includes("no grazie") || msg_studente.includes("statt zitt"))) {
              ws.send("Ok buon lavoro ! \n"+
              "Qualora ti servisse aiuto scrivimi Ehi Picus" );
              cont = "attesa";
              
             }
             else if(cont == "attesa" &&(msg_studente.includes("Ehi Picus") || msg_studente.includes("EHI PICUS") || msg_studente.includes("ehi picus") || msg_studente.includes("picus") || msg_studente.includes("ehi Picus"))) {
              ws.send("Rieccomi  " +req.params.nome+ " ti elenco le funzionalità che posso fare per te: \n"+ 
              "1) Posso riportarti la lista delle lezioni per cui hai prenotato un posto \n"+
              "Ti basta digitare la parola 'posto', oppure 'mio posto' o anche 'visualizza posti' ");
              cont=2;
             }

             else if(cont == 2  &&  (msg_studente.includes("emojichat"))) {
              ws.send("Ma che bella questa emoji 👏👏")
            }
            
 
             
 
             else if(cont == 2  && (msg_studente.includes("lista") || msg_studente.includes("posto") || msg_studente.includes("mio posto") || msg_studente.includes("visualizza posti") )){
              ws.send("Vorresti visualizzare i posti che hai prenotato?")
              cont = "visualizza"

           }

          

             
            else if(cont == "visualizza" && (msg_studente.includes("si") || msg_studente.includes("yes") || msg_studente.includes("ok") || msg_studente.includes("va bene"))) {
               ws.send("Ok, vado a controllare la lista dei posti che hai prenotato 😄")      
             try{
               
               db.visualizzaPrenotazioni(req.params.email,function(risultati,esito,err){
                       console.log("[LOG SERVER] /Prenotazione/VisualizzaAulePrenotateDocente",esito)
                       if (esito==true){  
 
                         if(risultati.length !=0) {
                           ws.send("Voilà! \n")
                           for(let i=0; i<risultati.length; i++) {
                             ws.send("Aula: ["+risultati[i].locale +"] \n"+
                             "Giorno della prenotazione: "+ risultati[i].data_richiesta +" \n"+
                             "Dalle: "+ risultati[i].ora_inizio +" alle: "+ risultati[i].ora_fine)
                           }
                           cont = 2              

                         }
                         else {
                           ws.send("Mi dispiace, al momento non hai posti prenotati")
                           cont = 2              
                         } 
                        }
                       else if(esito == false ){
                        ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova \n"+
                        "1) Posso riportarti una lista delle tue prenotazioni  \n");
                        
                        cont = 2              
                      }
           })
         
           }
           catch(e){
             console.log("errore catch", e)
             ws.send("Qualcosa è andato storto nella richiesta 😥. Riprova \n"+
             "1) Posso riportarti la lista delle aule che hai prenotato \n");
           
                 cont = 2              
                 
           }
         }
 
 
              else if (cont == "visualizza" && ! (msg_studente.includes("si") || msg_studente.includes("ok") || msg_studente.includes("va bene"))){
               ws.send("Mi dispiace, ho annullato la richiesta 😥. Hai scritto, ad esempio, 'si' oppure 'ok' ? Rifammi la richiesta dall'inizio se vuoi 😅 \n"+
               "Digita Start");
               cont = 2
              }
              
             
             
       
             else if (msg_studente =="closed") {
                 console.log("SOCKET CHIUSA ")                
                 ws.terminate()
 
             }     
 
             else {
                 if (presente_studente)
                     ws.send("Ehi "+req.params.nome+"! Non essere così cattivo con me 😞")
                 else
                     ws.send("Mi dispiace, ma non sono stato programmato per poter gestire questo tipo di richieste 😎")
 
             }

             break;


          case "operatore":
             ws.send("Non sono state implementate funzionalità per questo ruolo")
          
        }
        
      
     

      }

    });
 
}