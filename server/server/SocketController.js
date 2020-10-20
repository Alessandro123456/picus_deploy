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
      ws.send("Benvenuto "+req.params.nome+ " sono Picus, il tuo chatbot personale 🤖. Vedo che sei "+req.params.ruolo+". Hai la possibilità di : \n"+
      "1) Visualizzare la lista di aule prenotate \n"+
      "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
      "... \n"+
      "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
    
      cont++
      }
      else {
        switch(req.params.ruolo) {
          
          case "superadmin":
            console.log("entro in superadmin")
            console.log("msg", messaggio)
            

           let msg = messaggio.toLowerCase()

           let presente = false
           for(let i=0; i<array.length; i++) {
             if(msg.includes(array[i])) {
               console.log("dentro parolaccia")
               presente = true
             }
           }

            
            if(cont == 2 &&  (msg.includes("ciao") || msg.includes("ehi") || msg.includes("we") || msg.includes("salve" ) || msg.includes("ohi") || msg.includes("hello") || msg.includes("hi"))) {
              ws.send("Ehi! Mi sbaglio o ci siamo già salutati? 🤣")
            }
            else if(cont == 2  &&(msg.includes("mmm") || msg.includes("non lo so") || msg.includes("bho") || msg.includes("boh" ) || msg.includes("cosa puoi fare")) ) {
              ws.send("Se hai dei dubbi posso ricordarti io cosa sono in grado di fare: \n"+ 
              "1) Posso riportarti la lista delle aule che hai prenotato \n"+
              "... \n"+
              "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza' - 'prenotate' - 'mie aule'..");
            }

            else if(cont == 2  &&  (msg.includes("si") || msg.includes("ok") || msg.includes("va bene"))) {
              ws.send("Aspetta, prima fammi qualche richiesta 🤨")
            }

            else if(cont == 2  && (msg.includes("lista") || msg.includes("1") || msg.includes("visualizzare") || msg.includes("visualizza") || msg.includes("mie aule") || msg.includes("vedere") || msg.includes("prenotate"))){
               ws.send("Vorresti visualizzare le aule prenotate?")
               cont = "visualizza"

            }
           else if(cont == "visualizza" && (msg.includes("si") || msg.includes("yes") || msg.includes("ok") || msg.includes("va bene"))) {
              ws.send("Ok, vado a controllare la lista di aule che hai prenotato 😄")
                cont = "preleva e post"
     
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
                        } 
                        cont = 2              
                       }
                      else if(esito == false ){
                        cont = "preleva e post"
                      }
          })
        
          }
          catch(e){
            console.log("errore catch", e)
                cont = "preleva e post"
                
          }
        }


             else if (cont == "visualizza" && ! (msg.includes("si") || msg.includes("ok") || msg.includes("va bene"))){
              ws.send("Mi dispiace, ho annullato la richiesta 😥. Hai scritto, ad esempio, 'si' oppure 'ok' ? Rifammi la richiesta dall'inizio se vuoi 😅")
              cont = 2
             }
            
            
      
            else if (msg =="closed") {
                console.log("SOCKET CHIUSA ")                
                ws.terminate()

            }     

            else {
                if (presente)
                    ws.send("Ehi "+req.params.nome+"! Non essere così cattivo con me 😞")
                else
                    ws.send("Mi dispiace, ma non sono stato programmato per poter gestire questo tipo di richieste 😎")

            }

                         break;


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
             else if(cont == 2  &&(msg_docente.includes("mmm") || msg_docente.includes("non lo so") || msg_docente.includes("bho") || msg_docente.includes("boh" ) || msg_docente.includes("cosa puoi fare")) ) {
               ws.send("Se hai dei dubbi posso ricordarti io cosa sono in grado di fare: \n"+ 
               "1) Posso riportarti la lista delle aule che hai prenotato \n"+
               "2) Posso mostrarti la lista degli studenti che si sono prenotati \n"+
               "... \n"+
               "Puoi inserire o il numero relativo o utilizzare qualche parola chiave, come 'visualizza aule' - 'visualizza studenti' - 'studenti' - 'prenotate' - 'mie aule'..");
             }
 
             else if(cont == 2  &&  (msg_docente.includes("si") || msg_docente.includes("ok") || msg_docente.includes("va bene"))) {
               ws.send("Aspetta, prima fammi qualche richiesta 🤨")
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


          case "operatore":

          
        }
        
     

      }

    });
 
}