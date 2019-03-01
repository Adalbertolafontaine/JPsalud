import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';



//import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import Comandos from './comandos'


let comandos = new Comandos()
var informacion = []
let contador = 0
let clientesGeo = []
let leerdv = document.getElementById('file-input')
let mapdv = document.getElementById('map')
let SLprovincia = <HTMLSelectElement>document.getElementById('Slprovincia')
let SLmunicipio = <HTMLSelectElement>document.getElementById('Slmunicipio')
let BtBuscar = <HTMLButtonElement>document.getElementById('BTbuscar')
let Dvpestana = <HTMLDivElement>document.getElementById('pestana')
let BtGuardar = <HTMLButtonElement>document.getElementById('Btguardar')
let InLongitud = <HTMLInputElement>document.getElementById('longitud')
let InLatitud = <HTMLInputElement>document.getElementById('latitud')

if (document.body.contains(leerdv)) {
    document.getElementById('file-input').addEventListener('change', comandos.leerArchivo, false);
    document.getElementById('btleer').addEventListener('click', BTleer);
    document.getElementById('validar').addEventListener('click', enviarP);
    (<HTMLButtonElement>document.getElementById('btenviar')).addEventListener('click', BTenviar);



}


if (document.body.contains(SLprovincia)) {
    SLprovincia.addEventListener('change', Bmunicipios);
    SLmunicipio.addEventListener('change', Bbarrios)
}


if (document.body.contains(Dvpestana)) {


    let pestanas
    pestanas = document.getElementsByClassName('pestana1')
    var testDivs = Array.prototype.filter.call(pestanas, element => {

        return element.nodeName === 'DIV';
    });

    activar('formularios')

    testDivs.forEach(element => {
        element.addEventListener('click', event => {
            activar(element.id)
        })
    });




}

if (document.body.contains(BtBuscar)) {
    let formLogin = <HTMLFormElement>document.querySelector('#formulario')
    formLogin.addEventListener('submit', event => {

        let formData = new FormData(formLogin)
        event.preventDefault()
        
        fetch(`/clientes`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                let datos = data
                let registros = []

                if (datos.length > 0) {

                    datos.forEach(element => {
                        registros.push({ id: element['_id'], codigo: element['codigo'], nombre: element['nombre'], categoria: element['categoria'] })
                    });

                    comandos.crearTabla(registros, 'plistado')
                    fila()
                    activar('listado')
                } else {

                }
            })


    })
}

if (document.body.contains(BtGuardar)) {
    let formLogin = <HTMLFormElement>document.querySelector('#formulario')
    formLogin.addEventListener('submit', event => {

        let formData = new FormData(formLogin)
        event.preventDefault()

        fetch(`/cliente`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                comandos.mostrar(data)
            })


    })
}



function fila() {
    let filas: HTMLCollectionOf<Element>
    filas = document.getElementsByClassName('filas')
    var filasTR = Array.prototype.filter.call(filas, element => {

        return element.nodeName === 'TR';
    });


    filasTR.forEach((element: { addEventListener: (arg0: string, arg1: (event: any) => void) => void; id: string; }) => {
        element.addEventListener('click', event => {

            centro(element.id)
        })
    });
}




var Farnaciai = new CircleStyle({
    radius: 5,
    fill: new Fill({
        color: '#32CD32'  //'#F57382'
    }),
    stroke: new Stroke({ color: '#D1D2D4', width: 2 })
});

var distribuidorai = new CircleStyle({
    radius: 5,
    fill: new Fill({
        color: '#FFA500'
    }),
    stroke: new Stroke({ color: '#D1D2D4', width: 2 })
});

var laboratorioi = new CircleStyle({
    radius: 5,
    fill: new Fill({
        color: '#1E90FF'
    }),
    stroke: new Stroke({ color: '#D1D2D4', width: 2 })
});



var styles = {
    'farmacia': new Style({
        image: Farnaciai
    }),
    'distribuidora': new Style({
        image: distribuidorai
    }),
    'laboratorio': new Style({
        image: laboratorioi
    }),

};

var styleFunction = function (feature) {
    let id = feature.get('nombre')
    if (clientesGeo.indexOf(id) === -1) {
        clientesGeo.push(id)
    }
    return styles[feature.get('categoria')];
};

var style = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new Stroke({
        color: '#319FD3',
        width: 1
    }),
    /*text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: '#000'
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 3
      })
    })*/
});

let source = new VectorSource({
    url: '../clienteg',
    format: new GeoJSON()
})

var vectorLayer = new VectorLayer({
    source: source,
    style: styleFunction
});


let view = new View({
    projection: 'EPSG:4326',
    center: [-70.1538, 18.7071],
    zoom: 8
})

var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        vectorLayer
    ],
    target: 'map',
    view: view
});


map.on('click', function (evt) {
    displayFeatureInfo(evt.pixel);
});

if (document.body.contains(InLongitud)) {
    map.on('singleclick', function (evt) {
        var coordinate = evt.coordinate;
        InLongitud.value = coordinate[0].toFixed(4)
        InLatitud.value = coordinate[1].toFixed(4)

    });
}



var displayFeatureInfo = function (pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
    });


    if (feature) {

        let nombre = feature.get('nombre');

        if (nombre !== undefined) {

            let campos = ['codigo', 'nombre', 'categoria', 'direccion', 'enlace', 'x', 'y']

            let datas = {}

            campos.forEach(element => {
                datas[element] = feature.get(element)
            });

            comandos.llenadoFormulario(datas)

            comandos.seleccionSL('Slcategoria', feature.get('categoria'))
            enlaceSL(feature.get('enlace'))
        }
    }
}


function centro(cliente: string) {

    let feature = source.forEachFeature(elemento => {

        let featurei = elemento.get('id')

        if (featurei === cliente) {

            return elemento
        }
    })

    var point = (feature.getGeometry());

    var size = (map.getSize());


    map.getView().animate({ projection: 'EPSG:4326', center: point.getCoordinates(), zoom: 18 })

}

function enlaceSL(enlace: string) {

    let provincia = enlace.substring(0, 2);
    let municipio = enlace.substring(0, 6);
    localStorage.setItem('municipio', municipio)
    localStorage.setItem('barrio', enlace)

    comandos.seleccionSL('Slprovincia', provincia)
    Bmunicipios()

}


function activar(ventana: string) {

    document.getElementsByClassName

    var x
    x = document.getElementsByClassName("ventana");
    var y
    y = document.getElementsByClassName("pestana1");

    for (let i = 0; i < x.length; i++) {

        y[i].style.backgroundColor = "#dbd5d5";
        x[i].style.display = "none";
    }



    var selececto = document.getElementById('p' + ventana);
    var selecectop = document.getElementById(ventana);
    selececto.style.display = 'block';
    selececto.style.backgroundColor = 'white'
    selecectop.style.display = 'block';
    selecectop.style.backgroundColor = 'white'

}

function BTleer() {
    informacion = comandos.leer()

    let renglones = []
    let largo = (informacion.length > 100) ? 100 : informacion.length

    for (let i = 0; i < largo; i++) {
        renglones.push(informacion[i])

    }
    comandos.crearTabla(renglones, 'estadistica')

}

function BTenviar() {
    let TABLAE = (<HTMLSelectElement>document.getElementById('sltabla')).value;
    let final = ((informacion.length) < 100) ? informacion.length : 100;

    let r = [];
    for (let i = 0; i < final; i++) {
        r.push(informacion[0]);

        informacion.shift();

    }
    contador += 1

    comandos.enviar('POST', `/${TABLAE}`, r, 'application/json; charset=utf-8').then(data => {

        if (informacion.length > 0) {

            BTenviar();
        }
        else {
            document.getElementById('estadistica').innerHTML = "Enviados";
            localStorage.removeItem('informacion')
        }

    });

}


function enviarP() {
    let TABLAE = (<HTMLSelectElement>document.getElementById('sltabla')).value;

    comandos.enviar('GET', `/${TABLAE}`, 'r', 'application/json; charset=utf-8').then(data => {
        let datos: any
        datos = data
        let renglones = []

        if (datos.length > 0) {


            let largo = (datos.length > 100) ? 100 : datos.length

            for (let i = 0; i < largo; i++) {
                renglones.push(datos[i])

            }


        } else {
            renglones = [{ informacion: "Sin Datos" }]
        }
        comandos.crearTabla(renglones, 'estadistica')
    })



}

function Bmunicipios() {
    let provincia = SLprovincia.value;

    comandos.enviar('GET', `tablas/municipio?codigo=${provincia}`, 'r', 'application/json; charset=utf-8').then(data => {
        let datos
        datos = data
        comandos.llenadoSL(datos, 'Slmunicipio')
        let municipio = localStorage.getItem('municipio')

        if (municipio) {

            comandos.seleccionSL('Slmunicipio', municipio)
            localStorage.removeItem('municipio')

        }
        Bbarrios()
    })
}

function Bbarrios() {
    let municipio = SLmunicipio.value;

    comandos.enviar('GET', `tablas/barrio?codigo=${municipio}`, 'r', 'application/json; charset=utf-8').then(data => {
        let datos
        datos = data
        comandos.llenadoSL(datos, 'Slbarrio')

        let barrio = localStorage.getItem('barrio')

        if (barrio !== null) {
            comandos.seleccionSL('Slbarrio', barrio)
            localStorage.removeItem('barrio')
        }


    })
}

comandos.ajustardiv();
