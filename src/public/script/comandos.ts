export default class Comandos {

    informacion: any;
    encuestas: any

    constructor() {


    }

    ajustardiv() {

        let altura = window.innerHeight;
        let ventanas
        ventanas = document.getElementsByClassName('aside')



        for (let i = 0; i < ventanas.length; i++) {
            ventanas[i].style.height = `${altura - 10}px`;

        }


    }


    llenadoSL(datos: [{ nombre: string, codigo: string }], seleccion: string) {

        let sl = <HTMLSelectElement>document.getElementById(seleccion);
        for (let i = sl.options.length; i > 0; i--) {
            sl.options.remove(1);
        }
        sl.disabled = true;
        if (datos.length > 0) {

            datos.forEach(element => {
                var opcion;
                if (typeof element === 'string') {
                    opcion = new Option(element, element);
                }
                else {
                    opcion = new Option(element.nombre.toUpperCase(), element.codigo);
                }
                sl.options.add(opcion);
            });
            sl.disabled = false;
        }
    }

    enviar(metodo, dirrecion, datos, tipo) {
        let promesa = new Promise((resolve, reject) => {
            var myHeaders = new Headers();
            if (datos === '') {
                datos = { estatus: 'ok' };
            }
            let paquete = {
                method: metodo,
                headers: {
                    'Content-Type': tipo,
                    mode: 'cors',
                }
            };
            if (metodo == 'POST') {
                paquete['body'] = JSON.stringify(datos);
            }
            fetch(dirrecion, paquete)
                .then(res => res.json())
                .then(data => {
                    resolve(data);
                });
        });
        return promesa;
    }

    crearTabla(datos, divS) {
        let titulos = Object.keys(datos[0]);

        //crear elementos de la Tabla
        let tabla = document.createElement("table");
        tabla.setAttribute("class", "tablaES");
        let header = tabla.createTHead();
        let Hrow = header.insertRow(0);
        let tblBody = document.createElement("tbody");
        let tblFoot = document.createElement("tfoot");
        let divT = document.getElementById(divS)
        divT.innerHTML = ""


        let pos = titulos.indexOf('id');
        let id = false
        if (pos > -1) {
            titulos.splice(pos, 1);
            id = true
        }


        //definicion titulo
        for (var i_1 of titulos) {
            let nombre = i_1.replace('_', ' ');
            let z = document.createElement("TH");
            let t = document.createTextNode(nombre);
            z.appendChild(t);
            Hrow.appendChild(z);
        }


        var totales = {};
        




        for (let i of datos) {
            var hilera = document.createElement("tr");
            hilera.setAttribute("class", "filas");

            if (id) {
                hilera.setAttribute("id", i['id']);
            }



            for (let j of titulos) {
                if (totales[j]) {
                    totales[j] = 0;
                }
                var celda = document.createElement("td");
                var valor;
                let clase = '';

                if (i[j]) {
                    let valor1 =i[j];
                    if (typeof valor1 === 'object') {
                        valor = valor1['valor'];
                        clase = valor1['clase'];
                    }
                    else {
                        valor = valor1;
                    }
                }
                else {
                    valor = 0;
                }


                let textoCelda;
                if (isNaN(valor)) {
                    textoCelda = document.createTextNode(valor);
                    celda.setAttribute("class", `tablaEST ${clase}`);
                }
                else {


                    totales[j] += valor;

                    textoCelda = document.createTextNode(new Intl.NumberFormat().format(valor));
                    celda.setAttribute("class", `tablaESN ${clase}`);
                }

                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            }

            tblBody.appendChild(hilera);
        }

        tabla.appendChild(tblBody);

        /****Totales  */
        var hilera = document.createElement("tr");
        for (let total of titulos) {
            var celda = document.createElement("td");
            var valor = totales[total];
            if (isNaN(valor)) {
                var textoCelda = document.createTextNode(valor);
                celda.setAttribute("class", "tablaEST");
            }
            else {
                var textoCelda = document.createTextNode(new Intl.NumberFormat().format(valor));
                celda.setAttribute("class", "tablaESN");
            }
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        console.log(totales)

        tblFoot.appendChild(hilera);
        divT.appendChild(tabla)
        // return tabla;
    }

    leerArchivo(e) {
        (<HTMLButtonElement>document.getElementById('btleer')).disabled = false;
        var archivo = e.target.files[0];
        if (!archivo) {
            return;
        }


        var lector = new FileReader();
        lector.onload = function (e: any) {
            localStorage.setItem('informacion', e.target.result);

        };
        lector.readAsText(archivo);
    }

    leer() {
        let diferencia = [];
        let largo = 0;
        let largot = 0;

        let contenido = localStorage.getItem('informacion').toLowerCase();
        let datos = [];
        let datos_tabla = [];
        let lineas = contenido.split("\r\n");
        let campos = [];
        let separador = (<HTMLSelectElement>document.getElementById('separador')).value;
        let TABLAE = (<HTMLSelectElement>document.getElementById('sltabla')).value;

        if (separador !== '0' && TABLAE !== '0') {

            lineas.forEach(element => {
                campos.push(element.split(separador));
            });
            let cabezera;
            cabezera = campos[0];

            for (let i = 1; i < campos.length; i++) {
                let temporar = {};
                let temp = {};
                for (let k = 0; k < cabezera.length; k++) {
                    let texto = cabezera[k];

                    let nnombre;

                    nnombre = texto;

                    temporar[nnombre] = campos[i][k];
                    temp[nnombre] = { valor: temporar[nnombre] = campos[i][k], clase: campos[i][0].toUpperCase() };
                }
                temp['validado'] = { valor: 'Sin Validar', clase: campos[i][0].toUpperCase() };
                if (lineas[i] !== "") {
                    datos.push(temporar);
                    datos_tabla.push(temp);
                }

            }
            var renglones = { 'Colegios': [] };
            document.getElementById('cantidad').innerHTML = datos.length.toString();

            let contador;
            if (datos.length < 101) {
                contador = datos.length;
            }
            else {
                contador = 100;
            }
            for (let i = 0; i < contador; i++) {
                renglones.Colegios.push(datos_tabla[i]);
            }

            (<HTMLButtonElement>document.getElementById('btenviar')).disabled = false;
            (<HTMLButtonElement>document.getElementById('btcancelar')).disabled = false;

            return datos

        } else {
            return [{ "Informacion": 'No se a selecionado' }]
        }
    }

    llenadoFormulario(datos) {
        let titulos = Object.keys(datos);

        titulos.forEach(element => {

            let elemento
            elemento = document.getElementsByName(element)

            for (let i = 0; i < elemento.length; i++) {

                if (element == 'x' || element === 'y' || datos[element] === undefined) {

                } else {

                    elemento[i].value = datos[element].toUpperCase()
                }


            }


        });

    }

    seleccionSL(seleccion: string, valor: string) {
        let sl = <HTMLSelectElement>document.getElementById(seleccion);

        for (let i = sl.options.length - 1; i > 0; i--) {
            if (sl.options[i].value === valor) {
                sl.selectedIndex = i
                return
            }
        }

    }


    mostrar(datos) {
        console.log(datos);
    }
}

