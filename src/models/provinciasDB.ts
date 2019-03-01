'use strict'

import mongoose from "mongoose";

const provinciaShema = new mongoose.Schema({
    codigo: {
        type: String,
        lowercase: true
    },
    nombre: {
        type: String,
        lowercase: true
    }
    
})

const ProvinciaDB = mongoose.model('provincia', provinciaShema)

export default ProvinciaDB 