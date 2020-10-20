FROM node:10 AS server

WORKDIR /root/

ADD ./server ./

RUN npm install express
RUN npm install cors
RUN npm install body-parser
RUN npm install keycloak-connect
RUN npm install express-ws
RUN npm install moment
RUN npm install dateformat
RUN npm install mysql
RUN npm install errors
RUN npm install italian-badwords-list

EXPOSE 8000

CMD [ "node" , "server.js" ]
