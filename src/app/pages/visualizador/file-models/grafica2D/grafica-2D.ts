import { FileModelInterface } from '../file-model-interface';
import Chart from 'chart.js/auto'; // se importa la libreria chart.js 
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Color, Line } from 'three';

declare var CanvasJS: any; // otra libreria para graficar
declare var $: any;

export class Grafica2D implements FileModelInterface {

    private chart: any;

    constructor(public json: any, public canvas: any) {
        this.json = json;
        this.canvas = canvas;
    }

    // Detectar el id del canvas donde está el Visualizador
    dateId = new Date();
    idVisualizador = this.dateId.getTime();
    id = this.dateId.getTime();

    draw(json: any, c: any) {
        /* chart.render(); */

        const errores = this.validaJSON(json);
        let noErrores = 0;
        for (let i = 0; i < errores.length; i++) {
            if (errores[i] != "correcto") {
                noErrores++;
            }
        }

        if (noErrores == 0) {
            switch (json.type) {
                case "bar":
                    this.renderChartBar(json, c);
                    break;
                case "pie":
                    this.renderChartPie(json, c);
                    break;
                case "line":
                    this.renderChartLine(json, c);
                    break;
                case "bubble":
                    this.renderChartBubble(json, c);
                    break;
                default:
                    alert("---ERROR---");
                    break;
            }
        } else {
            alert(`Tipo: ${errores[0]} \nEtiquetas: ${errores[1]} \nDatos: ${errores[2]}`); 
            window.location.reload();
        }
        
    }

    renderChartBar(json: any, c: any){

        let arrXValues = []; // arreglo que guarda los valores de la etiqueta X
        let datasetValues = []; // arreglo que guarda los valores de la etiqueta Y
        let dataObjects = []  // arreglo que guarda los valores de los colores de las graficas

        arrXValues = json.xdata;

        for (let i = 0; i < json.p.length; i++) {
            datasetValues.push(json.p[i]);

            const datos = {
                label: datasetValues[i].dataname,
                data: datasetValues[i].ydata,
                backgroundColor: datasetValues[i].color,
                borderColor: datasetValues[i].color,
                borderWidth: 1
            }

            if (datasetValues[i].hasOwnProperty('color') == false || datasetValues[i].color == "") {
                console.log("no existe color");
                
                datos.backgroundColor = "blue";
            }
           
            
            dataObjects.push(datos);
        }

        
        var xValues = arrXValues;//["Italy", "France", "Spain", "USA", "Argentina"]; //json.data.labels;
        var tipo = json.type; // se obtiene el tipo de grafica [bar, line, ...]

        const data = {
            labels: xValues,
            datasets: dataObjects      
        }

        const options = {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: json.title,
              },
              legend:{
                display: true //oculta las etiquetas de los dataset
              }
            },
            scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Cantidad'
                  }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Número de columna'
                    }
                },
              }          
          }

        this.chart = new Chart(c, { type: tipo, data, options});

    }

    renderChartPie(json: any, c: any){

        let arrXValues = []; // arreglo que guarda los valores de la etiqueta X
        let arrYValues = []; // arreglo que guarda los valores de la etiqueta Y
        let colors = []; // arreglo que guarda los valores de los colores de las graficas
        // Se itera sobre el arreglo de puntos para obtener sus valores
        for (let i = 0; i < json.p[0].length; i++) {
            arrXValues.push(json.p[0][i].x);
            arrYValues.push(json.p[0][i].y);
            
            if (json.p[0][i].hasOwnProperty('color') == false || json.p[0][i].color == "") {
                colors.push("#3B34A6");    
            } else {
                colors.push(json.p[0][i].color);    
            }
        }
        var xValues = arrXValues;//["Italy", "France", "Spain", "USA", "Argentina"]; //json.data.labels;
        var yValues = arrYValues;//[55, 49, 44, 24, 15];//json.data.data;
        var barColors = colors;//["red", "green", "blue", "orange", "brown"]; // json.data.backgroundColor;//
        var tipo = json.type; // se obtiene el tipo de grafica [bar, line, ...]
        let porcentajes: any [] = [];
        let sumaTotal = 0;

        for (let i = 0; i < yValues.length; i++) {
            sumaTotal = sumaTotal + Number(yValues[i]) 
        }

        for (let i = 0; i < yValues.length; i++) {
            porcentajes.push((yValues[i]*100/sumaTotal).toFixed(2));
        }

        console.log(porcentajes);

        const data = {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              label: undefined,
              data: porcentajes
            }]
        }

        const options = {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: json.title,
              },
              legend:{
                display: false //oculta las etiquetas de los dataset
              },
              datalabels: {
                /* anchor puede ser "start", "center" o "end" */
                anchor: "center",
                formatter: (data: string) => data + "%",
                color: "black",
                font: {
                  family: '"Times New Roman", Times, serif',
                  size: "16",
                  weight: "bold",
                },
              }
            },
            scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Cantidad'
                  }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Número de columna'
                    }
                },
              }          
          }

        this.chart = new Chart(c, { plugins: [ChartDataLabels], type: tipo, data, options});

    }


    renderChartLine(json: any, c: any){

        let arrXValues = []; // arreglo que guarda los valores de la etiqueta X
        let arrYValues = []; // arreglo que guarda los valores de la etiqueta Y
        let colors = []; // arreglo que guarda los valores de los colores de las graficas
        // Se itera sobre el arreglo de puntos para obtener sus valores
        for (let i = 0; i < json.p[0].length; i++) {
            arrXValues.push(json.p[0][i].x);
            arrYValues.push(json.p[0][i].y);
            
            if (json.p[0][i].hasOwnProperty('color') == false || json.p[0][i].color == "") {
                colors.push("#3B34A6");    
            } else {
                colors.push(json.p[0][i].color);    
            }
        }
        var xValues = arrXValues;//["Italy", "France", "Spain", "USA", "Argentina"]; //json.data.labels;
        var yValues = arrYValues;//[55, 49, 44, 24, 15];//json.data.data;
        var barColors = colors;//["red", "green", "blue", "orange", "brown"]; // json.data.backgroundColor;//
        var tipo = json.type; // se obtiene el tipo de grafica [bar, line, ...]

        const data = {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              label: undefined,
              data: yValues
            }]
        }

        const options = {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: json.title,
              },
              legend:{
                display: false //oculta las etiquetas de los dataset
              }
            },
            scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Cantidad'
                  }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Número de columna'
                    }
                },
              }          
          }

        this.chart = new Chart(c, { type: tipo, data, options});

    }

    renderChartBubble(json: any, c: any){

        let arrXValues = []; // arreglo que guarda los valores de la etiqueta X
        let arrYValues = []; // arreglo que guarda los valores de la etiqueta Y
        let colors = []; // arreglo que guarda los valores de los colores de las graficas
        // Se itera sobre el arreglo de puntos para obtener sus valores
        for (let i = 0; i < json.p[0].length; i++) {
            arrXValues.push(json.p[0][i].x);
            arrYValues.push(json.p[0][i].y);
            
            if (json.p[0][i].hasOwnProperty('color') == false || json.p[0][i].color == "") {
                colors.push("#3B34A6");    
            } else {
                colors.push(json.p[0][i].color);    
            }
        }
        var xValues = arrXValues;//["Italy", "France", "Spain", "USA", "Argentina"]; //json.data.labels;
        var yValues = arrYValues;//[55, 49, 44, 24, 15];//json.data.data;
        var barColors = colors;//["red", "green", "blue", "orange", "brown"]; // json.data.backgroundColor;//
        var tipo = json.type; // se obtiene el tipo de grafica [bar, line, ...]

        const data = {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              label: undefined,
              data: yValues
            }]
        }

        const options = {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: json.title,
              },
              legend:{
                display: false //oculta las etiquetas de los dataset
              }
            },
            scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Cantidad'
                  }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Número de columna'
                    }
                },
              }          
          }

        this.chart = new Chart(c, { type: tipo, data, options});

    }

    validaJSON(datosJSON: any): any {
        
        let errores: any[] = [];
        errores.push(this.validaTipo(datosJSON)); 
        errores.push(this.validaEncabezados(datosJSON));
        //errores.push(this.validaDatos(datosJSON));
        console.log(errores);
        return errores;
    }

    validaTipo(json:any): String {
        if (json.type == "bar") {
            return "correcto";    
        } else if (json.type == "pie"){
            return "correcto";  
        } else if (json.type == "line"){
            return "correcto";  
        } else if(json.type == "bubble"){
            return "correcto";  
        } else {
           return "error-tipo";
        }      
    }


    validaEncabezados(json: any):String{
        if (json.title == "" || json.xlabel == "" || json.ylabel == "" || json.hasOwnProperty('title') == false || json.hasOwnProperty('xlabel') == false || json.hasOwnProperty('ylabel') == false) {
            return "error-encabezados";
        } else{
            return "correcto";
        }
    }


    validaDatos(json: any):String{
        if (json.p.length == 0) {
            return "error-datos";
        } else {
            let aux = 0;
            for (let i = 0; i < json.p.length; i++) {
                if (json.p[i].length == 0) {
                    aux++;
                }
                for (let j = 0; j < json.p[i].length; j++) {
                    if (json.p[i][j].hasOwnProperty('x') == false || json.p[i][j].hasOwnProperty('y') == false ) {
                        aux++;
                    }
                }
            }

            if (aux > 0) {
                return "error-datos";
            } else {
                return "correcto";
            }
        }
    }

    mostrarMenu(idVisualizador: any): void {
        // Cambiar scope
        var mySelf = this;
        // ID del canvas del visualizador
        mySelf.id = idVisualizador;

        // Contenedor del menú y el visualizador
        var contenedor = "<div class='row' id='visualizador" + mySelf.id + "'" + ">" +
                            " <div class='container col-sm-10' id='" + mySelf.id + "'" + "></div> " +
                            "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu" + mySelf.id + "'" + "></div>" +
                         "</div>";

        $('.menu__default').after(contenedor);

        var item =  "<div id = 'particulasMenu'" + "class='particulasMenu' >" +
                        "<h3 class='align-text-top section__subtitle' id='titulo'><span>Graphics Menu</span></h3>" +
                        "<div id = 'particulasMenu' class='particulasMenu' >" +
                            "<ul class='nav flex-column' id='vor'>" +

                                "<li class='nav-item'>" +
                                    "<div class='form-check'>" +
                                        "<input type='checkbox' class='form-check-input' id='checkPuntos'>" +
                                        "<label class='form-check-label' for='checkPuntos'><span></span></label>" +
                                        "<span> Grafica de puntos </span>" +
                                    "</div>" +
                                "</li>" +

                                "<li class='nav-item'>" +
                                    "<div class='form-check'>" +
                                        "<input type='checkbox' class='form-check-input' id='checkLineas'>" +
                                        "<label class='form-check-label' for='checkLineas'><span></span></label>" +
                                        "<span> Grafica de Líneas </span>" +
                                    "</div>" +
                                "</li>" +

                                "<li class='nav-item'>" +
                                    "<div class='form-check'>" +
                                        "<input type='checkbox' class='form-check-input' id='checkPastel'>" +
                                        "<label class='form-check-label' for='checkPastel'><span></span></label>" +
                                        "<span> Grafica de Pastel </span>" +
                                    "</div>" +
                                "</li>" +

                            "</ul>" +
                            "<button id='botonDescarga' class='btn btn-primary'>Descargar</button>"+
                        "</div>"+
                    "</div>";


        $('#menu' + mySelf.id).append(item);
        $('#menu' + mySelf.id).css({ "visibility": "visible", "width": "250" })
        /******************************************************************************** */

        //Se utiliza Jquery para detectar los cambios en el formulario de check
        $('document').ready(
            // Al seleccionar el checkBox llamado Puntos cambiara el tipo de grafica
            $('#checkPuntos').change(function(){
                var check:any = document.getElementById('checkPuntos');
                if(check.checked) {
                    $('#checkLineas').prop("checked",false);
                    $('#checkPastel').prop("checked",false);
                    mySelf.setTipo(!check, "puntos"); // Esto funciona por alguna razón cuando esta activo el check mandara punto
                }else{
                    mySelf.setTipo(check, "barras"); // cuando este desactivado mandara barras el cual nos servir
                }
            }),
            $('#checkLineas').change(function(){
                var check:any = document.getElementById('checkLineas');
                if(check.checked) {
                    $('#checkPuntos').prop("checked",false);
                    $('#checkPastel').prop("checked",false);
                    mySelf.setTipo(!check, "lineas"); // Esto funciona por alguna razón cuando esta activo el check mandara punto
                }else{
                    mySelf.setTipo(check, "barras"); // cuando este desactivado mandara barras el cual nos servir
                }
            }),
            $('#checkPastel').change(function(){
                var check:any = document.getElementById('checkPastel');
                if(check.checked) {
                    $('#checkLineas').prop("checked",false);
                    $('#checkPuntos').prop("checked",false);
                    mySelf.setTipo(!check, "pastel"); // Esto funciona por alguna razón cuando esta activo el check mandara punto
                }else{
                    mySelf.setTipo(check, "barras"); // cuando este desactivado mandara barras el cual nos servir
                }
            }),

            $('#botonDescarga').click(function(){
                mySelf.descarga();
            }),
        );

    }

    descarga():void {
        console.log("Descargando imagen");
        const imageLink = document.createElement('a');
        const canvasLink = document.getElementById('myCanvas') as HTMLCanvasElement;
        imageLink.download = 'canvas.png';
        console.log(canvasLink);
        imageLink.href = canvasLink.toDataURL('image/png', 1);
        imageLink.click();
    } // FIN descarga()

    //Esta funcion nos ayudara a colocar el tipo de grafico que queremos gracias a los eventos del menu
    setTipo(checkbox:any, tipo:string):void {

        //Creamos una copia del canvas y del json ya que el canvas será elominado y el json modificado en la copia
        var newCanvas = this.canvas;
        var newJson = this.json;

        //llegara el check y dependiendo la posicion modificara el tipo de la grafica ya sea de barras bar o de puntos bubble

        switch (tipo) {
            case "puntos":
                newJson.type = "bubble";
              break;
            case "lineas":
                newJson.type = "line";
              break;
            case "pastel":
                newJson.type = "pie";
              break;
            case "barras":
                newJson.type = "bar";
              break;
            default:
              break;
          }

        //destruimos el canvas anterior
        this.chart.render();
        this.chart.destroy();
        
        console.log("La grafica será de tipo:", newJson.type);
        //dibujamos nuevamente 
        this.draw(newJson, newCanvas);
        
    } // FIN setTipo()
}
