var mysql = require('mysql');
var dateFormat = require('dateformat');
const { get } = require('http');
const Errors = require('errors');
var now = new Date();
let DB_USER = process.env.DB_USER
let DB_PORT = process.env.PORT_DB
let DB_IP = process.env.IP_ADDRESS_DB
let DB_NAME = 'monitoringdieti'
let DB_PWD = process.env.DB_PASSWORD


var dbConfig = {
    host: DB_IP,
    user: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
    port: DB_PORT,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnection: true,
    dateStrings: true
   
};

console.log("dbconfig", dbConfig)

var conn = mysql.createPool(dbConfig);

module.exports = {
    ///////////////////////////////////-------------------OPERATORE---------------------------///////////////////////////////////////////
    
    buildLocali : function(idLocale, numero_tel,tipologia,condiviso,indirizzo,superficie,capienza_massima,dipartimento,responsabile,callback){
    idLocale_query = String(idLocale)
    numero_tel_query = String(numero_tel)
    tipologia_query = String(tipologia)
    indirizzo_query = String(indirizzo)
    dipartimento_query = String(dipartimento)
    responsabile_query = String(responsabile)
    capienza_query=parseInt(capienza_massima)
    superficie_query=parseInt(superficie)
   
    sql = "INSERT INTO LOCALE (idLocale, numero_tel,tipologia,condiviso,indirizzo,superficie,capienza_massima,dipartimento,responsabile,stato_locale) VALUES ('"+idLocale_query+"', '"+numero_tel_query+"', '"+tipologia_query+"', '"+condiviso+"', '"+indirizzo_query+"', '"+superficie_query+"', '"+capienza_query+"', '"+dipartimento_query+"', '"+responsabile_query+"', '"+"chiuso"+"')" 
    try{
    conn.getConnection(function(err,connection) {
      if (err) {
           const dateTime = new Date().getTime();
           const timestamp = Math.floor(dateTime / 1000);
           console.log("[LOG buildLocali "+timestamp+"] Error while connecting to MySQL",err)
           return callback(false,err);    
      }
      console.log("Connected Insert Locale!");
      connection.query(sql, function (err, result) {
      connection.release()
      if (err){ 
                 const dateTime = new Date().getTime();
                 const timestamp = Math.floor(dateTime / 1000);
                 console.log("[LOG buildLocali "+timestamp+"] Error while inserti to MySQL",err)
                 return callback(false,err);
      }
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG buildLocali "+timestamp+"] Inserti Success",err)
      return callback(true);
    });
  });
  }
  catch(e){
    const dateTime = new Date().getTime();
    const timestamp = Math.floor(dateTime / 1000);
    console.log("[LOG buildLocali "+timestamp+"] ECCEZIONE LANCIATA")
    return callback(false,err);
  }
  finally{
    console.log("QUI ALCUNI SU INTERNET CHIUDONO LA CONNESSIONE/POOL MA DEVO CHIEDERE AL MASTO")
  }
    },
    getReferenti : function(callback){
        sql = "SELECT email FROM monitoringdieti.UTENTE; "
        try{
        conn.getConnection(function(err,connection) {
            if (err) {
                    const dateTime = new Date().getTime();
                    const timestamp = Math.floor(dateTime / 1000);
                    console.log("[LOG getReferenti "+timestamp+"] Error while connecting to MySQL",err)
                    return callback("NOT_FOUND",false,err);
                   
            }
            console.log("Connected getReferenti!");
            connection.query(sql, function (err, result) {
            connection.release();
              if (err){ 
                      const dateTime = new Date().getTime();
                      const timestamp = Math.floor(dateTime / 1000);
                      console.log("[LOG getReferenti "+timestamp+"] Error while get dati from database",err)
                      return callback("NOT_FOUND",false,err);
              
                  }
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG getReferenti "+timestamp+"] query ok")
              return callback(result,true)
            });
          });
        }
        catch(e){
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getReferenti "+timestamp+"] ECCEZIONE LANCIATA")

          return callback("NOT_FOUND",false,err);
        }
        finally{
          console.log("QUI ALCUNI SU INTERNET CHIUDONO LA CONNESSIONE/POOL MA DEVO CHIEDERE AL MASTO DEL DATABASE")
        }
          
    },
    getLocali : function(callback){
      sql = "SELECT * from LOCALE"
      try{
      conn.getConnection(function(err,connection) {
          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG getLocali "+timestamp+"] Error while connecting to MySQL",err)
            return callback("NOT_FOUND",false,err);
                 
          }
          console.log("Connected getLocali!");
          connection.query(sql, function (err, result) {
          connection.release()
            if (err){ 
                         const dateTime = new Date().getTime();
                          const timestamp = Math.floor(dateTime / 1000);
                          console.log("[LOG getLocali "+timestamp+"] Error while get dati from database",err)
                          return callback("NOT_FOUND",false,err);
            
                }
            console.log("QUERY GET LOCALI FATTA !")
            
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG getLocali "+timestamp+"] query ok")
            return callback(result,true)
          });
        });
      }
      catch(e){
        const dateTime = new Date().getTime();
        const timestamp = Math.floor(dateTime / 1000);
        console.log("[LOG getLocali "+timestamp+"] ECCEZIONE LANCIATA")

        return callback("NOT_FOUND",false,err);
      }
      finally{
        console.log("QUI ALCUNI SU INTERNET CHIUDONO LA CONNESSIONE/POOL MA DEVO CHIEDERE AL MASTO DEL DATABASE")
      }
    },
    deleteLocali : function(idLocale,callback){
    sql = "DELETE FROM locale WHERE "
    for(let j=0;j<idLocale.length;j++){
      if(j!=idLocale.length-1){
        sql = sql + "idLOCALE = '" + idLocale[j] + "' OR "
      }
        else sql = sql + "idLOCALE = '" + idLocale[j] + "';"
      }
    try{
    conn.getConnection(function(err,connection) {
      
        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG deleteLocali "+timestamp+"] Error while connecting to MySQL",err)
          return callback(false,err);
               
        }
        console.log("Connected deleteLocali!");
        connection.query(sql, function (err, result) {
          connection.release()
          if (err){ 
                       const dateTime = new Date().getTime();
                        const timestamp = Math.floor(dateTime / 1000);
                        console.log("[LOG deleteLocali "+timestamp+"] Error while get dati from database",err)
                        return callback(false,err);
          
              }
          console.log("QUERY deleteLocali FATTA !")
          
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG deleteLocali "+timestamp+"] query ok")
          return callback(true)
        });
      });
    }
    catch(e){
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG deleteLocali "+timestamp+"] ECCEZIONE LANCIATA")

      return callback(false,err);
    }
    finally{
      console.log("QUI ALCUNI SU INTERNET CHIUDONO LA CONNESSIONE/POOL MA DEVO CHIEDERE AL MASTO DEL DATABASE")
    }
    },
    updatelocali : function(req,callback){
      console.log(req)
      idLOCALE = req.idLOCALE
      numero_tel = req.numero_tel
      tipologia = req.tipologia
      condiviso = req.condiviso
      indirizzo = req.inidirizzo
      superficie = req.superficie
      capienza_massima = req.capienza_massima
      dipartimento = req.dipartimento
      responsabile = req.responsabile
      stato_locale = req.stato_locale
      id_vecchio = req.id_vecchio;
      idLocale_query    = String(idLOCALE)
      numero_tel_query   = String(numero_tel)
      tipologia_query    = String(tipologia)
      indirizzo_query    = String(indirizzo)
      dipartimento_query = String(dipartimento)
      responsabile_query = String(responsabile)
      condiviso_query    =String(condiviso)
      stato_locale_query =String(stato_locale)
      id_vecchio_query = String(id_vecchio)

      sql = "UPDATE LOCALE SET idLOCALE ='"+ idLocale_query +"',numero_tel ='"+ numero_tel_query +"',tipologia ='"+ tipologia_query+
            "',condiviso ='"+condiviso_query+"',indirizzo ='"+indirizzo_query+
            "',superficie ="+parseInt(superficie)+",capienza_massima ="+parseInt(capienza_massima)+
            ",dipartimento ='"+dipartimento_query+"',  responsabile='"+responsabile_query+"',  stato_locale='"+stato_locale_query+
            "' where idLOCALE = '"+id_vecchio_query+ "';"
      console.log("sql",sql)
        console.log("try")
            try{
              conn.getConnection(function(err,connection) {
                
                  if (err) {
                    const dateTime = new Date().getTime();
                    const timestamp = Math.floor(dateTime / 1000);
                    console.log("[LOG updatelocali "+timestamp+"] Error while connecting to MySQL",err)
                    return callback(false,err);
                         
                  }
                  console.log("Connected updatelocali!");
                  connection.query(sql, function (err, result) {
                  connection.release()
                    
                    if (err){ 
                                 const dateTime = new Date().getTime();
                                  const timestamp = Math.floor(dateTime / 1000);
                                  console.log("[LOG updatelocali "+timestamp+"] Error while get dati from database",err)
                                  
                                  
                                  return callback(false,err);
                                  
                    
                        }
                    console.log("QUERY updatelocali FATTA !")
                    
                    const dateTime = new Date().getTime();
                    const timestamp = Math.floor(dateTime / 1000);
                    console.log("[LOG updatelocali "+timestamp+"] query ok")
                   
                    
                    return callback(true)
                    
                  });
                });
              }
              catch(e){
                const dateTime = new Date().getTime();
                const timestamp = Math.floor(dateTime / 1000);
                console.log("[LOG updatelocali "+timestamp+"] ECCEZIONE LANCIATA",e)
                return callback(false,e);
              }
              
    },
    update_user: function (req, callback) {
      console.log(req)
      
  
      var valori=""
      try {
        for(let i=0;i<req.email_user.length;i++){
          if(i!=req.email_user.length-1){
             valori = valori + "('"+  req.email_user[i]+  "','"+req.nome_user[i]+"'),"
          }
          else 
          valori = valori + "('"+  req.email_user[i]+"','"+req.nome_user[i]+  "')"
        }
        console.log("VALORI" , valori)
        sql = "INSERT INTO UTENTE(email,NOME) values "+valori+" ON DUPLICATE KEY UPDATE email=email";
      console.log("sql", sql)
      console.log("try")
        conn.getConnection(function (err, connection) {
  
          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG update_user " + timestamp + "] Error while connecting to MySQL", err)
            return callback(false, err);
  
          }
          console.log("Connected update_user!");
          connection.query(sql, function (err, result) {
            connection.release()
  
            if (err) {
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG update_user " + timestamp + "] Error while get dati from database", err)
  
  
              return callback(false, err);
  
  
            }
            console.log("QUERY update_user FATTA !")
  
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG update_user " + timestamp + "] query ok")
  
  
            return callback(true)
  
          });
        });
      }
      catch (e) {
        const dateTime = new Date().getTime();
        const timestamp = Math.floor(dateTime / 1000);
        console.log("[LOG update_user " + timestamp + "] ECCEZIONE LANCIATA", e)
        return callback(false, e);
      }
  
    },
    
  
    ///////////////////////////////////-------------------STUDENTE---------------------------///////////////////////////////////////////
    getProfessori : function (callback){  
        sql = "SELECT NOME FROM UTENTE";
        try{
        conn.getConnection(function(err,connection) {
            if (err) {
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG getProfessori "+timestamp+"] Error while connecting to MySQL",err)
              return callback("NOT_FOUND",false,err);
                   
            }
            console.log("Connected getProfessori!");
            connection.query(sql, function (err, result) {
            connection.release()
              if (err){ 
                           const dateTime = new Date().getTime();
                            const timestamp = Math.floor(dateTime / 1000);
                            console.log("[LOG getProfessori "+timestamp+"] Error while get dati from database",err)
                            return callback("NOT_FOUND",false,err);
              
                  }
              console.log("QUERY getProfessori FATTA !")
              
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG getProfessori "+timestamp+"] query ok")
              return callback(result,true)
            });
          });
        }
        catch(e){
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getProfessori "+timestamp+"] ECCEZIONE LANCIATA")
  
          return callback("NOT_FOUND",false,err);
        }
        


    },
    
    visualizzaAule : function(nome_prof, giorno, callback){
        sql = "SELECT * FROM (PRENOTAZIONE P JOIN UTENTE U on p.richiedente = u.email) WHERE p.data_richiesta = '"+giorno+"' AND u.NOME = '"+nome_prof+"';"
        console.log("sql",sql)
        try{
        conn.getConnection(function(err,connection) {
            if (err) {
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG visualizzaAule "+timestamp+"] Error while connecting to MySQL",err)
              return callback("NOT_FOUND",false,err);
                   
            }
            console.log("Connected visualizzaAule!");
            connection.query(sql, function (err, result) {
            connection.release()
              if (err){ 
                           const dateTime = new Date().getTime();
                            const timestamp = Math.floor(dateTime / 1000);
                            console.log("[LOG visualizzaAule "+timestamp+"] Error while get dati from database",err)
                            return callback("NOT_FOUND",false,err);
              
                  }
              console.log("QUERY visualizzaAule FATTA !")
              
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG visualizzaAule "+timestamp+"] query ok")
              return callback(result,true)
            });
          });
        }
        catch(e){
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG visualizzaAule "+timestamp+"] ECCEZIONE LANCIATA")
  
          return callback("NOT_FOUND",false,err);
        }
  
    },
    getAulePrenotate : function(email,callback) {
        
        sql = "SELECT PRENOTAZIONE FROM PRENOTAZIONE_STUDENTE where studente='"+email+"'";
        console.log("sql",sql)
        try{
        conn.getConnection(function(err,connection) {
            if (err) {
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG getAulePrenotate "+timestamp+"] Error while connecting to MySQL",err)
              return callback("NOT_FOUND",false,err);
                   
            }
            console.log("Connected getAulePrenotate!");
            connection.query(sql, function (err, result) {
            connection.release()
              if (err){ 
                           const dateTime = new Date().getTime();
                            const timestamp = Math.floor(dateTime / 1000);
                            console.log("[LOG getAulePrenotate "+timestamp+"] Error while get dati from database",err)
                            return callback("NOT_FOUND",false,err);
              
                  }
              console.log("QUERY getAulePrenotate FATTA !")
              
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime / 1000);
              console.log("[LOG getAulePrenotate "+timestamp+"] query ok")
              return callback(result,true)
            });
          });
        }
        catch(e){
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getAulePrenotate "+timestamp+"] ECCEZIONE LANCIATA")
  
          return callback("NOT_FOUND",false,err);
        }
    },
    prenotaPosto : function(prenotazione, datapre,dataric,orainiz,orafin,stud,local,descrizion,callback) {
      
    sql = "INSERT INTO PRENOTAZIONE_STUDENTE (PRENOTAZIONE,data_prenotazione, data_richiesta,ora_inizio,ora_fine, studente,locale, descrizione) values  ("+prenotazione+",'"+datapre.substring(0,10)+"','"+dataric.substring(0,10)+"','"+orainiz+"','"+orafin+"','"+stud+"','"+local+"','"+descrizion+"')";
    console.log("sql",sql)
    try{
    conn.getConnection(function(err,connection) {
        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG prenotaPosto "+timestamp+"] Error while connecting to MySQL",err)
          return callback(false,err);
               
        }
        console.log("Connected prenotaPosto!");
        connection.query(sql, function (err, result) {
        connection.release()
          if (err){ 
                       const dateTime = new Date().getTime();
                        const timestamp = Math.floor(dateTime / 1000);
                        console.log("[LOG prenotaPosto "+timestamp+"] Error while get dati from database",err)
                        return callback(false,err);
          
              }
          console.log("QUERY prenotaPosto FATTA !")
          
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG prenotaPosto "+timestamp+"] query ok")
          return callback(true)
        });
      });
    }
    catch(e){
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG prenotaPosto "+timestamp+"] ECCEZIONE LANCIATA")

      return callback("NOT_FOUND",false,err);
    }
    },
    visualizzaPrenotazioni : function(mail,callback) {
          sql = "SELECT ps.idPrenotazione_studente, u.NOME, ps.locale, ps.data_richiesta, ps.ora_inizio,u.url_foto from (prenotazione p join prenotazione_studente ps on p.idPRENOTAZIONE=ps.PRENOTAZIONE join utente u on p.richiedente=u.email) where ps.studente='"+mail+"'"
        
          console.log("sql",sql)
          try{
          conn.getConnection(function(err,connection) {
              if (err) {
                const dateTime = new Date().getTime();
                const timestamp = Math.floor(dateTime / 1000);
                console.log("[LOG visualizzaPrenotazioni "+timestamp+"] Error while connecting to MySQL",err)
                return callback("NOT_FOUND",false,err);
                     
              }
              console.log("Connected visualizzaPrenotazioni!");
              connection.query(sql, function (err, result) {
              connection.release()
                if (err){ 
                             const dateTime = new Date().getTime();
                              const timestamp = Math.floor(dateTime / 1000);
                              console.log("[LOG visualizzaPrenotazioni "+timestamp+"] Error while get dati from database",err)
                              return callback("NOT_FOUND",false,err);
                
                    }
                console.log("QUERY visualizzaPrenotazioni FATTA !")
                
                const dateTime = new Date().getTime();
                const timestamp = Math.floor(dateTime / 1000);
                console.log("[LOG visualizzaPrenotazioni "+timestamp+"] query ok")
                return callback(result,true)
              });
            });
          }
          catch(e){
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG visualizzaPrenotazioni "+timestamp+"] ECCEZIONE LANCIATA")
    
            return callback("NOT_FOUND",false,err);
          }
    },
    eliminaPosto : function(riga, callback) {
    sql = "DELETE FROM prenotazione_studente WHERE idPRENOTAZIONE_STUDENTE='"+riga+"';";
    console.log("sql",sql)
    try{
    conn.getConnection(function(err,connection) {
        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG eliminaPosto "+timestamp+"] Error while connecting to MySQL",err)
          return callback(false,err);
               
        }
        console.log("Connected eliminaPosto!");
        connection.query(sql, function (err, result) {
        connection.release()
          if (err){ 
                       const dateTime = new Date().getTime();
                        const timestamp = Math.floor(dateTime / 1000);
                        console.log("[LOG eliminaPosto "+timestamp+"] Error while get dati from database",err)
                        return callback(false,err);
          
              }
          console.log("QUERY eliminaPosto FATTA !")
          
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG eliminaPosto "+timestamp+"] query ok")
          return callback(true)
        });
      });
    }
    catch(e){
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG prenotaPosto "+timestamp+"] ECCEZIONE LANCIATA")

      return callback("NOT_FOUND",false,err);
    }
    },
   
    ///////////////////////////////////-------------------DOCENTE---------------------------///////////////////////////////////////////
    getAulePrenotabili : function(parametro, callback){

      ora_ingresso = parametro.ora_ingresso + ":00"
      ora_uscita = parametro.ora_uscita + ":00"
     
      sql = "select idLOCALE,tipologia,capienza_massima FROM locale where '"
      +parametro.numero_partecipanti+"' <= capienza_massima and stato_locale= 'aperto' and idLOCALE not in "+
      "(select locale from prenotazione where data_richiesta = '"+parametro.giorno+"' and"+ 
      "((ora_fine > '"+ora_ingresso+"' and ora_fine < '"+ora_uscita+"') OR (ora_inizio > '"+ora_ingresso+"' and ora_inizio< '"+ora_uscita+"') OR (ora_inizio <= '"+ora_ingresso+"' and ora_fine >= '"+ora_uscita+"')));"

      console.log("sql",sql)
      try{
      conn.getConnection(function(err,connection) {
          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG getAulePrenotabili "+timestamp+"] Error while connecting to MySQL",err)
            return callback("NOT_FOUND",false,err);
                 
          }
          console.log("Connected getAulePrenotabili!");
          connection.query(sql, function (err, result) {
          connection.release()
            if (err){ 
                         const dateTime = new Date().getTime();
                          const timestamp = Math.floor(dateTime / 1000);
                          console.log("[LOG getAulePrenotabili "+timestamp+"] Error while get dati from database",err)
                          return callback("NOT_FOUND",false,err);
            
                }
            console.log("QUERY getAulePrenotabili FATTA !")
            
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG getAulePrenotabili "+timestamp+"] query ok")
            return callback(result,true)
          });
        });
      }
      catch(e){
        const dateTime = new Date().getTime();
        const timestamp = Math.floor(dateTime / 1000);
        console.log("[LOG getAulePrenotabili "+timestamp+"] ECCEZIONE LANCIATA")
  
        return callback("NOT_FOUND",false,err);
      }
    },  

    buildPrenotazioni : function(nome_locale, giorno, ora_ingresso, ora_uscita, numero_partecipanti, area_text ,email,callback){
      //SANIFICAZIONE DELL'INPUT
      //idLocale ( non so come deve essere nello specifico ma per adesso non sarà effettuato)
      //telefono
      //indirizzo
      //capienza/condiviso/superf
      ora_ingresso = ora_ingresso + ":00"
      ora_uscita = ora_uscita + ":00"
      data_odierna = dateFormat(now, 'yyyy-mm-dd')
      sql = "INSERT INTO PRENOTAZIONE "+
      "(data_prenotazione,data_richiesta,ora_inizio,ora_fine,richiedente,numero_persone,locale,descrizione) values "+
      "('"+data_odierna+"','"+giorno+"','"+ora_ingresso+"','"+ora_uscita+"', '"+email+"','"
      +numero_partecipanti+"', '"+ nome_locale+"', '"+area_text+"')"
      console.log("sql",sql)
      try{
      conn.getConnection(function(err,connection) {
          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG buildPrenotazioni "+timestamp+"] Error while connecting to MySQL",err)
            return callback(false,err);
                 
          }
          console.log("Connected buildPrenotazioni!");
          connection.query(sql, function (err, result) {
          connection.release()
            if (err){ 
                         const dateTime = new Date().getTime();
                          const timestamp = Math.floor(dateTime / 1000);
                          console.log("[LOG buildPrenotazioni "+timestamp+"] Error while get dati from database",err)
                          return callback(false,err);
            
                }
            console.log("QUERY buildPrenotazioni FATTA !")
            
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG buildPrenotazioni "+timestamp+"] query ok")
            return callback(true)
          });
        });
      }
      catch(e){
        const dateTime = new Date().getTime();
        const timestamp = Math.floor(dateTime / 1000);
        console.log("[LOG buildPrenotazioni "+timestamp+"] ECCEZIONE LANCIATA")
  
        return callback(false,err);
      }
  },     


  /*
  getAuleChiuse : function(callback) {
        
    sql = "SELECT idLOCALE FROM locale where stato_locale = 'chiuso';"  
    console.log("sql",sql)
    try{
    conn.getConnection(function(err,connection) {
        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getAuleChiuse "+timestamp+"] Error while connecting to MySQL",err)
          return callback("NOT_FOUND",false,err);
               
        }
        console.log("Connected getAuleChiuse!");
        connection.query(sql, function (err, result) {
        connection.release()
          if (err){ 
                       const dateTime = new Date().getTime();
                        const timestamp = Math.floor(dateTime / 1000);
                        console.log("[LOG getAuleChiuse "+timestamp+"] Error while get dati from database",err)
                        return callback("NOT_FOUND",false,err);
          
              }
          console.log("QUERY getAuleChiuse FATTA !")
          
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getAuleChiuse "+timestamp+"] query ok")
          return callback(result,true)
        });
      });
    }
    catch(e){
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG getAuleChiuse "+timestamp+"] ECCEZIONE LANCIATA")

      return callback("NOT_FOUND",false,err);
    }
},
*/

  getAulePrenotateDocente : function(email, callback){

   
    sql = " select locale,data_richiesta, ora_inizio, ora_fine, idPRENOTAZIONE from prenotazione where richiedente = '"+email+"' and ((ora_fine >= '00:00:00' and ora_fine <= '23:59:59') OR (ora_inizio >=  '00:00:00' and ora_inizio <= '23:59:59'));"

    console.log("sql",sql)
    try{
    conn.getConnection(function(err,connection) {
        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getAulePrenotateDocente "+timestamp+"] Error while connecting to MySQL",err)
          return callback("NOT_FOUND",false,err);
               
        }
        console.log("Connected getAulePrenotateDocente!");
        connection.query(sql, function (err, result) {
        connection.release()
          if (err){ 
                       const dateTime = new Date().getTime();
                        const timestamp = Math.floor(dateTime / 1000);
                        console.log("[LOG getAulePrenotateDocente "+timestamp+"] Error while get dati from database",err)
                        return callback("NOT_FOUND",false,err);
          
              }
          console.log("QUERY getAulePrenotateDocente FATTA !")
          
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getAulePrenotateDocente "+timestamp+"] query ok")
          return callback(result,true)
        });
      });
    }
    catch(e){
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG getAulePrenotateDocente "+timestamp+"] ECCEZIONE LANCIATA")

      return callback("NOT_FOUND",false,err);
    }
  },
  getPrenotazioni: function (email, callback) {

    try {
      sql = "SELECT * FROM prenotazione where richiedente = '" + email + "'"
      console.log("SQL", sql)
      conn.getConnection(function (err, connection) {
        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getLocali " + timestamp + "] Error while connecting to MySQL", err)
          return callback("NOT_FOUND", false, err);

        }
        console.log("Connected getLocali!");
        connection.query(sql, function (err, result) {
          connection.release()
          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG getLocali " + timestamp + "] Error while get dati from database", err)
            return callback("NOT_FOUND", false, err);

          }
          console.log("QUERY GET LOCALI FATTA !")

          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG getLocali " + timestamp + "] query ok")
          return callback(result, true)
        });
      });
    }
    catch (e) {
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG getLocali " + timestamp + "] ECCEZIONE LANCIATA")

      return callback("NOT_FOUND", false, err);
    }
    finally {
      console.log("QUI ALCUNI SU INTERNET CHIUDONO LA CONNESSIONE/POOL MA DEVO CHIEDERE AL MASTO DEL DATABASE")
    }
  },

  get_utenti_prenotati : function(id_prenotazione,callback){
    
    try{
    sql = "SELECT studente FROM prenotazione_studente where PRENOTAZIONE='"+id_prenotazione+"';"
    conn.getConnection(function(err,connection) {
      if (err) {
           const dateTime = new Date().getTime();
           const timestamp = Math.floor(dateTime / 1000);
           console.log("[LOG get_utenti_prenotati "+timestamp+"] Error while connecting to MySQL",err)
           return callback("NOT_FOUND",false,err);    
      }
      console.log("Connected get_utenti_prenotati !");
      connection.query(sql, function (err, result) {
      connection.release()
      if (err){ 
                 const dateTime = new Date().getTime();
                 const timestamp = Math.floor(dateTime / 1000);
                 console.log("[LOG get_utenti_prenotati "+timestamp+"] Error while inserti to MySQL",err)
                 return callback("NOT_FOUND",false,err);
      }
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG get_utenti_prenotati "+timestamp+"] Inserti Success",err)
      return callback(result, true);
    });
  });
  }
  catch(e){
    const dateTime = new Date().getTime();
    const timestamp = Math.floor(dateTime / 1000);
    console.log("[LOG get_utenti_prenotati "+timestamp+"] ECCEZIONE LANCIATA")
    return callback(result,false,err);
  }
  
    },

  updateprenotazione: function (id_prenotazione_q,data_prenotazione_q,data_richiesta_q,ora_inizio_q,ora_fine_q,richiedente_q,numero_persone_q,locale_q,descrizione_q, callback) {
 
    

    sql = "UPDATE PRENOTAZIONE SET data_prenotazione ='" + data_prenotazione_q + "',data_richiesta ='" + data_richiesta_q +
      "',ora_inizio ='" + ora_inizio_q + "',ora_fine ='" + ora_fine_q +
      "',richiedente ='" + richiedente_q + "',numero_persone =" + numero_persone_q +
      ",locale ='" + locale_q + "',  descrizione='" + descrizione_q + "'" +
      " where idPRENOTAZIONE = '" + id_prenotazione_q + "';"
    console.log("sql", sql)

    try {
      conn.getConnection(function (err, connection) {

        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG updateprenotazione " + timestamp + "] Error while connecting to MySQL", err)
          return callback(false, err);

        }
        console.log("Connected updateprenotazione!");
        connection.query(sql, function (err, result) {
          connection.release()

          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG updateprenotazione " + timestamp + "] Error while get dati from database", err)


            return callback(false, err);


          }
          console.log("QUERY updateprenotazione FATTA !")

          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG updateprenotazione " + timestamp + "] query ok")


          return callback(true)

        });
      });
    }
    catch (e) {
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG updateprenotazione " + timestamp + "] ECCEZIONE LANCIATA", e)
      return callback(false, e);
    }

  },
  deleteprenotazioni: function (idprenotazioni, callback) {
    sql = "DELETE FROM PRENOTAZIONE WHERE "
    for (let j = 0; j < idprenotazioni.length; j++) {
      if (j != idprenotazioni.length - 1) {
        sql = sql + "idPRENOTAZIONE = '" + idprenotazioni[j] + "' OR "
      }
      else sql = sql + "idPRENOTAZIONE = '" + idprenotazioni[j] + "';"

    }
    console.log("sql", sql)
    try {
      conn.getConnection(function (err, connection) {

        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG deleteprenotazioni " + timestamp + "] Error while connecting to MySQL", err)
          return callback(false, err);

        }
        console.log("Connected deleteprenotazioni!");
        connection.query(sql, function (err, result) {
          connection.release()
          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG deleteprenotazioni " + timestamp + "] Error while get dati from database", err)
            return callback(false, err);

          }
          console.log("QUERY deleteprenotazioni FATTA !")

          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG deleteprenotazioni " + timestamp + "] query ok")
          return callback(true)
        });
      });
    }
    catch (e) {
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG deleteprenotazioni " + timestamp + "] ECCEZIONE LANCIATA")

      return callback(false, err);
    }

  },
  
  updatefoto: function (req, callback) {
   url = req.url_user
   email = req.email_user
    

    sql =" UPDATE UTENTE SET url_foto='"+url+"' WHERE email = '"+email+"';"
    console.log("sql", sql)

    try {
      conn.getConnection(function (err, connection) {

        if (err) {
          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG updatefoto " + timestamp + "] Error while connecting to MySQL", err)
          return callback(false, err);

        }
        console.log("Connected updatefoto!");
        connection.query(sql, function (err, result) {
          connection.release()

          if (err) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime / 1000);
            console.log("[LOG updatefoto " + timestamp + "] Error while get dati from database", err)


            return callback(false, err);


          }
          console.log("QUERY updatefoto FATTA !")

          const dateTime = new Date().getTime();
          const timestamp = Math.floor(dateTime / 1000);
          console.log("[LOG updatefoto " + timestamp + "] query ok")


          return callback(true)

        });
      });
    }
    catch (e) {
      const dateTime = new Date().getTime();
      const timestamp = Math.floor(dateTime / 1000);
      console.log("[LOG updatefoto " + timestamp + "] ECCEZIONE LANCIATA", e)
      return callback(false, e);
    }

  },



}
