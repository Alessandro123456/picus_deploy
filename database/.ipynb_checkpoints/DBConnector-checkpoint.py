import mysql.connector
from mysql.connector import Error
import datetime

class DBConnectionManager:
    # private attriute
    __instance = None
    __dbport = 3306
    __host = "localhost"
    __user = "root"
    __pwd = ""
    __dbname = 'monitoringDIETI'


    @staticmethod
    def getInstance():
        """ Static access method. """
        if DBConnectionManager.__instance == None:
            DBConnectionManager()
        return DBConnectionManager.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DBConnectionManager.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            DBConnectionManager.__instance = self

    # ----------------------UTENTE---------------------------------------
    def insertUtente(self, email, nome, cognome, ruolo, telefono, password, tipologia):

        try:

            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                #db_Info = connection.get_server_info()
                #print("Connected to MySQL Server version ", db_Info)

                mySql_query = "INSERT INTO UTENTE (email,nome,cognome,ruolo,telefono,password,tipologia) \
                VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s')" % \
                (email, nome, cognome,ruolo,telefono,password,tipologia)

                cursor = connection.cursor()
                cursor.execute(mySql_query)
                connection.commit()

                print(cursor.rowcount, "Record inserted successfully into UTENTE table")
                cursor.close()

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

    def getUtenti(self):
        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT * from UTENTE "


                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()

                print(cursor.rowcount, "Retrive users list")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    def getUtente(self, email):
        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT * FROM UTENTE where email ='" + email+"'"


                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()

                print(cursor.rowcount, "Retrive specific user")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    #DELETE NON HA SENSO - DOPO CANCELLO TUTTE LE PRENOTAZIONI E LOCALI ASSOCIATI E ALTRI UTENTI COINVOLTI?
    '''
    def deleteUtente(selfs, email):
        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                #db_Info = connection.get_server_info()
                #print("Connected to MySQL Server version ", db_Info)

                mySql_query = "DELETE FROM UTENTE WHERE email ='"+email+"'"

                cursor = connection.cursor()
                cursor.execute(mySql_query)
                connection.commit()

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")
    '''

    # ----------------------LOCALE---------------------------------------
    def insertLocale(self, idLocale, numero_tel, tipologia, condiviso, indirizzo, superficie, capienza, dipartimento, responsabile):

        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "INSERT INTO LOCALE \
                (idLocale, numero_tel,tipologia,condiviso,indirizzo,superficie,capienza_massima,dipartimento,responsabile) \
                VALUES ('%s', '%s', '%s', '%d', '%s', '%d', '%d', '%s', '%s')" % \
                (idLocale, numero_tel, tipologia, condiviso, indirizzo, superficie, capienza, dipartimento, responsabile)

                cursor = connection.cursor()
                cursor.execute(mySql_query)
                connection.commit()

                print(cursor.rowcount, "Record inserted successfully into LOCALE table")
                cursor.close()

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

    def getCapacitaDisponibile(self, locale):
        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT capienza_massima from LOCALE where idLocale ='"+str(locale)+"'"


                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()
                records = records[0][0]
                print(cursor.rowcount, "Retrive capability")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    def getLocali(selfs):
        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT * from LOCALE "


                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()

                print(cursor.rowcount, "Retrive list locali")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    def getLocaliPrenotabili(self, email):
        try:
            connection = mysql.connector.connect(host=DBConnectionManager.__host, user=DBConnectionManager.__user,
                                                 password=DBConnectionManager.__pwd,
                                                 database=DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT * from LOCALE WHERE responsabile='"+email+"' OR condiviso=TRUE"

                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()

                print(cursor.rowcount, "Retrive list locali prenotabili")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    def getResponsabile(self, locale):
        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT email, nome, cognome FROM LOCALE,UTENTE WHERE idLocale ='"+str(locale)+"' AND responsabile=email"


                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()
                records = records[0][0]
                print(cursor.rowcount, "Retrive responsabile")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    #----------------------PRENOTAZIONE----------------------------------
    def insertPrenotazione(self, email, locale, giorno, oraIngresso, oraUscita, numeroPartecipanti, descrizione):

        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                #db_Info = connection.get_server_info()
                #print("Connected to MySQL Server version ", db_Info)
                data_odierna = datetime.datetime.now().date()
                data_odierna = data_odierna.strftime('%Y-%m-%d')
                mySql_query = "INSERT INTO PRENOTAZIONE \
                (data_prenotazione,data_richiesta,ora_inizio,ora_fine,richiedente,numero_persone,locale,descrizione) \
                VALUES ('%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s')" % \
                (data_odierna, giorno, oraIngresso, oraUscita, email, numeroPartecipanti, locale, descrizione)
                cursor = connection.cursor()

                cursor.execute(mySql_query)
                connection.commit()
                print(cursor.rowcount, "Record inserted successfully into Laptop table")
                cursor.close()


        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

    def getPrenotazioniUtente(self, email):

        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = "SELECT * FROM PRENOTAZIONE WHERE richiedente='" + email+"' AND data_richiesta >= CURDATE() ;"


                cursor = connection.cursor()

                cursor.execute(mySql_query)
                records = cursor.fetchall()
                print(cursor.rowcount, "Record inserted successfully into Laptop table")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")

    #def getPrenotazioniOperatore(email):

    def deletePrenotazione(self, idPrenotazione):

        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                #db_Info = connection.get_server_info()
                #print("Connected to MySQL Server version ", db_Info)

                mySql_query = "DELETE FROM PRENOTAZIONE WHERE idPrenotazione ="+str(idPrenotazione)+" ;"

                cursor = connection.cursor()
                cursor.execute(mySql_query)
                connection.commit()

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

    def editPrenotazione(self, id, email, locale, giorno, oraIngresso, oraUscita, numeroPartecipanti, descrizione):

        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                #db_Info = connection.get_server_info()
                #print("Connected to MySQL Server version ", db_Info)

                data_odierna = datetime.datetime.now().date()
                data_odierna = data_odierna.strftime('%Y-%m-%d')

                mySql_query = ("UPDATE PRENOTAZIONE SET "+"data_prenotazione ='"+data_odierna+"',data_richiesta ='"+giorno+"',locale ='"
                               +locale+"',ora_inizio ='"+oraIngresso+"',ora_fine ='"+oraUscita+"',numero_persone ="+str(numeroPartecipanti)+
                               ",descrizione ='"+descrizione+"',richiedente ='"+email+"' where  idPrenotazione = "+str(id)+ ";")

                cursor = connection.cursor()
                cursor.execute(mySql_query)
                connection.commit()

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

    def contaPresenze(self, locale, giorno, oraIngresso, oraUscita):

        try:
            connection = mysql.connector.connect(host = DBConnectionManager.__host,user = DBConnectionManager.__user, password = DBConnectionManager.__pwd,database= DBConnectionManager.__dbname)
            if connection.is_connected():
                # db_Info = connection.get_server_info()
                # print("Connected to MySQL Server version ", db_Info)

                mySql_query = ("SELECT sum(numero_persone) FROM PRENOTAZIONE WHERE "+
                        "locale ='"+locale+
                        "' AND data_richiesta = '"+giorno+
                        "' AND (ora_inizio BETWEEN '"+oraIngresso+"' AND '"+oraUscita+"' OR ora_fine BETWEEN '"+oraIngresso+"' AND '"+oraUscita+"')")

                print(mySql_query)
                cursor = connection.cursor()
                cursor.execute(mySql_query)
                records = cursor.fetchall()
                records = records[0][0]
                if records is None:
                    records = 0
                print(cursor.rowcount, "Record inserted successfully into Laptop table")
                cursor.close()
                return records

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                return records
                print("MySQL connection is closed")




    def FAI_QUALCOSA(self):
        try:
            connection = mysql.connector.connect(
                host="localhost",
                user="root",
                passwd="Antonio94",
                database='monitoringDIETI'
            )
            if connection.is_connected():
                db_Info = connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                cursor = connection.cursor()
                cursor.execute("select database();")
                record = cursor.fetchone()
                print("You're connected to database: ", record)

        except Error as e:
            print("Error while connecting to MySQL", e)

        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")



if __name__ == '__main__':

    dc = DBConnectionManager.getInstance()
    #print(dc)
    #dc.insertUtente('anto.test@unina.it','antonio','test','dott','3334080672','test','utente')
    #dc.insertLocale('cl_4.15', '3334657876', 'Ufficio', 0, 'via claudio 21', 12, 2, 'DIETI', 'anto.test@unina.it')
    #dc.insertPrenotazione('anto.test@unina.it', 'cl_4.10', '2020-05-04', '11:00', '12:00', 2, 'michela.g@unina.it')
    #dc.getPrenotazioniUtente('anto.test@unina.it')
    #dc.deletePrenotazione(1)
    #dc.editPrenotazione(2, 'anto.test@unina.it', 'cl_4.10', '2020-05-04', '11:00', '12:00', 3, 'michela.g@unina.it,anna@unina.it')
    #record = dc.contaPresenze('cl_4.10', '2020-05-04', '10:00', '12:00')
    #record = dc.getCapacitaDisponibile('cl_4.10')
    #record = dc.getUtenti()
    #record = dc.getUtente('anto.test@unina.it')
    #record= dc.getLocaliPrenotabili('giovanni.test@unina.it')
    #record = dc.getLocali()
    record = dc.getResponsabile('cl_4.12')
    print(record)
    #dc = DBConnectionManager()
    #dc.FAI_QUALCOSA()
    #dc.FAI_QUALCOSA()
