'use strict'
import express from 'express';
import ClientesDB from '../models/clientesDB';
import ProvinciaDB from '../models/provinciasDB';

import clientes from '../controllers/ClienteClass';

function buscar(consulta: any) {
    let decode = new Promise((resol, rejec) => {
        ClientesDB.find(consulta, (err: any, encuestas: any) => {
            if (err) return rejec({ message: `Error al realizar la petición: ${err}` })
            if (!encuestas) return rejec({ message: 'No existen' })
            let lista = []
            return resol(encuestas)
        })

    })

    return decode
}




class GeneralCtl {
    Cliente = clientes
    constructor(parameters: any) {


    }



    /**
     * inicio
     */

    public inicio(req: express.Request, res: express.Response) {

        ProvinciaDB.find({}, (err: any, encuestas: any) => {
            res.render('home', {
                title: 'Inicio',
                datos: encuestas
            })
        }).sort('codigo')

    }

    /**
     * crear
     */
    public crear(req: express.Request, res: express.Response) {

        ProvinciaDB.find({}, (err: any, encuestas: any) => {
            res.render('nuevo', {
                title: 'Nuevo Cliente',
                datos: encuestas
            })
        }).sort('codigo')
    }

    /**
     * newcliente
     */
    public newcliente(req: express.Request, res: express.Response) {
        let datos = []
        datos = req.body

        if (!Array.isArray(datos)) {

            if (datos['provincia'] !== '0') {

                if (datos['municipio'] !== '0') {

                    if (datos['barrio'] !== '0') {
                        datos['enlace'] = datos['barrio']

                    } else {
                        datos['enlace'] = datos['municipio'];
                    }

                } else {
                    datos['enlace'] = datos['provincia'];
                }

            }


            datos = [datos]
        }


        ClientesDB.insertMany(datos, function (err: any) {
            if (err) return res.status(200).send(err);
            return res.status(200).send({ condiccion: 'correcto' })
        });
    }

    /**
     * Buscar Clientes
     */
    public getcliente(req: express.Request, res: express.Response) {
        let consulta = {}
        consulta = req.query

        buscar(consulta).then(encuestas => {
            return res.status(200).send(encuestas)
        })

    }

    public getclientes(req: express.Request, res: express.Response) {
        let consulta = {}
        let datos = req.body
        let campos = Object.keys(req.body)
        let contador = 0
        function QUITAR(campo) {
            let pos = campos.indexOf(campo);

            if (pos > -1) {
                campos.splice(pos, 1);

            }
        }


        if (datos['provincia'] !== '0') {

            if (datos['municipio'] !== '0') {

                if (datos['barrio'] !== '0') {
                    consulta['enlace'] = datos['barrio']
                    QUITAR('barrio')
                } else {
                    consulta['enlace'] = new RegExp(`\^${datos['municipio']}`);
                }
                QUITAR('municipio')
            } else {

                consulta['enlace'] = new RegExp(`\^${datos['provincia']}`);
            }
            QUITAR('provincia')

        }


        campos.forEach(element => {
            if (datos[element] === "" || datos[element] === "0" || datos[element] === "false") {
                contador++
            } else {

                let data = datos[element].toLowerCase()
                if (element === "nombre") {
                    consulta[element] = new RegExp(`${data}`);
                } else {
                    consulta[element] = data;
                }

            }

        });
       
        if (contador === campos.length) {
            return res.status(200).send({})
        } else {
            buscar(consulta).then(encuestas => {
                
                return res.status(200).send(encuestas)
            })

        }

    }

    getclienteGeo(req: express.Request, res: express.Response) {

        let consulta = {}
        consulta = req.query

        buscar(consulta).then(encuestas => {
            let datos: any
            datos = encuestas

            let geojson = {
                "type": "FeatureCollection",
                "name": "Clientes",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": []
            }

            datos.forEach((element: { codigo: any; nombre: any; categoria: any; x: any; y: any; enlace: any, direccion: string }) => {

                let temp = {
                    "type": "Feature", "properties": {
                        id: element['id'],
                        codigo: element.codigo,
                        nombre: element.nombre,
                        categoria: element.categoria,
                        enlace: element.enlace,
                        direccion: element.direccion
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [element.x, element.y]
                    }
                }
                geojson.features.push(temp)
            });


            return res.status(200).send(geojson)
        })



    }


}

module.exports = {
    GeneralCtl
}