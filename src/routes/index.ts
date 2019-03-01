'use strict'

import express = require('express')
const api = express.Router()
const GeneralCtl = require('../controllers/GeneralCtl')
const DatosCtl = require('../controllers/DatosCtl')

const General = new GeneralCtl.GeneralCtl()
const Datos = new DatosCtl.DatosCtl()
const multer = require('multer');
const upload = multer();

api.get('/', General.inicio)
api.get('/cliente',General.getcliente)
api.get('/clienteg',General.getclienteGeo)
api.get('/ingresar', Datos.inicio)
api.get('/tablas/:tipo', Datos.getelementos)
api.post('/tablas/:tipo', Datos.newelementos)
// api.post('/partidos/:partidoId', upload.none(), Partido.actualizar_partido)
api.get('/nuevo',General.crear)


api.post('/cliente',upload.none(),General.newcliente)
api.post('/clientes', upload.none(), General.getclientes)

api.get('/*', General.inicio)
export = api
