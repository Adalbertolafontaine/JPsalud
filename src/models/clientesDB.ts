'use strict'

import mongoose from "mongoose";

const clienteShema = new mongoose.Schema({

    codigo: {
        type: String,
        lowercase: true
    },
    nombre: {
        type: String,
        lowercase: true
    },
    categoria: {
        type: String,
        lowercase: true
    },

    direccion: {
        type: String,
        lowercase: true
    },
    enlace: {
        type: String,
        lowercase: true
    },

    cliente: {
        type: Boolean,
        default: false
    },

    x: { type: Number },
    y: { type: Number }


})

const ClientesDB = mongoose.model('clientes', clienteShema)

export default ClientesDB 