'use strict'

import mongoose from "mongoose";

const municipioShema = new mongoose.Schema({
    codigo: {
        type: String,
        lowercase: true
    },
    nombre: {
        type: String,
        lowercase: true
    }
    
})

const MunicipioDB = mongoose.model('municipio', municipioShema)

export default  MunicipioDB 