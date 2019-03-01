'use strict'
import express from 'express';
import CategoriaDB from '../models/categoria';
import BarrioDB from '../models/barrioDB';
import MunicipioDB from '../models/municipioDB';
import ProvinciaDB from '../models/provinciasDB';

class DatosCtl {
    constructor(parameters) {

    }

    /**
     * inicio
     */

    public inicio(req: express.Request, res: express.Response) {
        res.render('ingresar', {
            title: 'Inicio'
        })
    }

    /**
     * newcliente
     */
    public newelementos(req: express.Request, res: express.Response) {
        let datos = (!Array.isArray(req.body)) ? [req.body] : req.body


        let BaseDB: any

        switch (req.params.tipo) {
            case 'provincia':
                BaseDB = ProvinciaDB
                break;
            case 'municipio':
                BaseDB = MunicipioDB
                break;
            case 'barrio':
                BaseDB = BarrioDB
                break;
            case 'categoria':
                BaseDB = CategoriaDB
                break;

            default:
                break;
        }


        BaseDB.insertMany(datos, function (err) {
            if (err) return res.status(200).send(err);
            return res.status(200).send({ condiccion: 'correcto' })
        });
    }

    /**
     * Buscar en tablas
     */
    public getelementos(req: express.Request, res: express.Response) {
        let consulta
        if (req.query.codigo && req.query.codigo !== '0' ) {
            let regex = new RegExp(`\^${req.query.codigo}`);
            consulta = { codigo: regex }
        } else {
            return res.status(200).send({})
        }


        let BaseDB: any

        switch (req.params.tipo) {
            case 'provincia':
                BaseDB = ProvinciaDB
                break;
            case 'municipio':
                BaseDB = MunicipioDB
                break;
            case 'barrio':
                BaseDB = BarrioDB
                break;
            case 'categoria':
                BaseDB = CategoriaDB
                break;

            default:
                break;
        }

        BaseDB.find(consulta, (err, encuestas: any) => {
            if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` })
            if (!encuestas) return res.status(404).send({ message: 'No existen partido' })
            let lista = []
            return res.status(200).send(encuestas)
        }).sort('codigo')


    }


}

module.exports = {
    DatosCtl
}