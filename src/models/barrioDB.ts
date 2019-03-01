'use strict'

import mongoose from "mongoose";

const barrioShema = new mongoose.Schema({
    codigo: {
        type: String,
        lowercase: true
    },
    nombre: {
        type: String,
        lowercase: true
    }
    
})

const BarrioDB = mongoose.model('barrio', barrioShema)

export default BarrioDB 