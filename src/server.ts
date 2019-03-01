'use strict'

import mongoose  from 'mongoose'
import config from './config';
import app = require('./app')


// mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
mongoose.connect(config.db, {
    useNewUrlParser: true
});

mongoose.Promise = require('bluebird');




app.default.start(()=>{console.log(`Servidor corriendo en http://localhost:${config.port}`);})  