'use strict'

import mongoose from "mongoose";

const categoriaShema = new mongoose.Schema({
    codigo: {
        type: String,
        lowercase: true
    },
    nombre: {
        type: String,
        lowercase: true
    }
    
})

const CategoriaDB = mongoose.model('categoria', categoriaShema)

export default CategoriaDB 