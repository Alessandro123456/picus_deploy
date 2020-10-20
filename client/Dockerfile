FROM node:10 AS ui-build

WORKDIR /root/

COPY Client/ ./

# add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
RUN npm install 
RUN npm install react-scripts@3.4.1 -g

ARG REACT_APP_HOST_IP_ADDRESS_SERVER

ENV REACT_APP_HOST_IP_ADDRESS_SERVER $REACT_APP_HOST_IP_ADDRESS_SERVER

RUN npm run build

EXPOSE 3000

CMD [ "npm" , "start" ]
