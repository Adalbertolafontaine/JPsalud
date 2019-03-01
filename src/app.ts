'use strict'

import express from "express";
import bodyParser = require('body-parser')
import exphbs = require('express-handlebars');
import path = require('path')
const  helpersconfi = require('./helpers');
import config from './config';

/*const server = require('http').Server(app);
const io = require('socket.io')(server);*/


class Server{
     public app: express.Application
     constructor( private port : number){

         this.app =express()
     }

     static init(port: any) : Server{
         return new Server(port)
     }

     start(callback : Function){
         this.app.listen(config.port,callback)
     }
}


import api from './routes';

var server = Server.init(config.port);

server.app.use(bodyParser.urlencoded({
    extended: false
}))
server.app.use(bodyParser.json())



server.app.engine('.hbs', exphbs({
    defaultLayout: 'defaul',
    extname: '.hbs',
    helpers: helpersconfi
}));

server.app.disable('x-powered-by');

server.app.set("view engine", ".hbs");
server.app.use(express.static(path.join(__dirname,'public')));
server.app.use('', api)
//app.set("port", process.env.PORT || 3000);


export default server