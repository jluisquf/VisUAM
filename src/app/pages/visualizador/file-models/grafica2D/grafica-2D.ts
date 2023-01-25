import { FileModelInterface } from '../file-model-interface';
import Chart from 'chart.js/auto'; // se importa la libreria chart.js 
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ClampToEdgeWrapping, Color, Line } from 'three';

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
                    this.renderChart(json, c, "bar");
                    this.graficaCanvas(json, c, "bar");
                    break;
                case "pie":
                    this.renderChart(json, c, "pie");
                    this.graficaCanvas(json, c, "pie");
                    break;
                case "line":
                    this.renderChart(json,  c, "line");
                    this.graficaCanvas(json, c, "line");
                    break;
                case "bubble":
                    this.renderChart(json, c, "bubble");
                    this.graficaCanvas(json, c, "bubble");
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

    renderChart(json: any, c: any, type: any){

        let arrXValues = []; // arreglo que guarda los valores de la etiqueta X
        let datasetValues = []; // arreglo que guarda los valores de la etiqueta Y
        let dataObjects = []  // arreglo que guarda los valores de los colores de las graficas

        arrXValues = json.xdata;

        if (type == "bar" || type == "pie" || type == "line") {
            for (let i = 0; i < json.p.length; i++) {
                datasetValues.push(json.p[i]);
    
                const datos = {
                    label: datasetValues[i].dataname,
                    data: datasetValues[i].ydata,
                    backgroundColor: datasetValues[i].color,
                    borderColor: "black",
                    borderWidth: 1
                }
    
                if (datasetValues[i].hasOwnProperty('color') == false || datasetValues[i].color == "") {
                    console.log("no existe color");
                    let newColor = this.generarNuevoColor();
                    json.p[i].color = newColor;
                    datos.backgroundColor = newColor;
                    datos.borderColor = "black";
                }
               
                
                dataObjects.push(datos);
            }
        } else {
            for (let i = 0; i < json.p.length; i++) {
                let puntos = [];
                datasetValues.push(json.p[i]);
    
    
                let aux = 0;
                for (let j = 0; j < json.p[i].ydata.length; j++) {
                    
    
                    const punto = {
                        x: aux,
                        y: json.p[i].ydata[j],
                        r: 10
                    }
    
                    puntos.push(punto);
                    aux++;
                }
    
    
                const datos = {
                    label: datasetValues[i].dataname,
                    data: puntos,
                    backgroundColor: datasetValues[i].color,
                    borderColor: datasetValues[i].color,
                }
    
                if (datasetValues[i].hasOwnProperty('color') == false || datasetValues[i].color == "") {
                    console.log("no existe color");
                    console.log(this.generarNuevoColor());
                    datos.backgroundColor = this.generarNuevoColor();
                }
               
                
                dataObjects.push(datos);
            }
        }
        
        var xValues = arrXValues;//["Italy", "France", "Spain", "USA", "Argentina"]; //json.data.labels;
        var tipo = json.type; // se obtiene el tipo de grafica [bar, line, ...]

        const data = {
            labels: xValues,
            datasets: dataObjects,
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
                      text: 'Número de columna',
                      
                    },
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0
                      }
                },
              }          
          }

        this.chart = new Chart(c, { type: tipo, data, options});


    }

    generarNuevoColor(){
        var simbolos, color;
        simbolos = "0123456789ABCDEF";
        color = "#";
    
        for(var i = 0; i < 6; i++){
            color = color + simbolos[Math.floor(Math.random() * 16)];
        }
        console.log(color);
        return color;
    }

    validaJSON(datosJSON: any): any {
        
        let errores: any[] = [];
        errores.push(this.validaTipo(datosJSON)); 
        errores.push(this.validaEncabezados(datosJSON));
        errores.push(this.validaDatos(datosJSON));
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
                if (json.p[i].hasOwnProperty('ydata') == false || json.p[i].ydata.length == 0) {
                    aux++;
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
        let json = this.json;
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

                                "<select name='select' id='typeOptions'>" +
                                    "<option value='' disabled >--- Selecciona una opción ---</option>" +
                                    "<option value='bar' >Barras</option>" +
                                    "<option value='line'  >Lineas</option>" +
                                    "<option value='pie' >Pastel</option>" +
                                    "<option value='bubble' >Puntos</option>" +
                                "</select>" +

                                "<div class='form-check'>" +
                                    "<input type='checkbox' class='form-check-input' id='checkPointY' >" +
                                    "<label class='form-check-label' for='checkPointY'><span></span></label>" +
                                    "<span> Ocultar eje Y </span>" +
                                "</div>";

            for (let i = 0; i < json.p.length; i++) {
                
                if (i == 0) {
                    item = item +
                    "<li class='nav-item'>"+
                        "<div class='form-check'>" +
                            "<input type='checkbox' checked='true' class='form-check-input' id='checkPointGraphic"+i+"' value="+i+">" +
                            "<label class='form-check-label' for='checkPointGraphic"+i+"'><span></span></label>" +
                            "<span> Mostrar dataset "+i+"</span>" +
                        "</div>" +    
                    "</li>"
                } else {
                    item = item +
                    "<li class='nav-item'>"+
                        "<div class='form-check'>" +
                            "<input type='checkbox' checked='true' class='form-check-input' id='checkPointGraphic"+i+"' value="+i+">" +
                            "<label class='form-check-label' for='checkPointGraphic"+i+"'><span></span></label>" +
                            "<span> Mostrar dataset "+i+"</span>" +
                        "</div>" +    
                    "</li>"
                }
               
                
            }

            item = item +
                    "</ul>"+
                "</div>"+
                "<button id='botonDescarga' class='btn btn-primary'>Descargar</button>"+
            "</div>";
                


        $('#menu' + mySelf.id).append(item);
        $('#menu' + mySelf.id).css({ "visibility": "visible", "width": "250" })
        /******************************************************************************** */

        //Se utiliza Jquery para detectar los cambios en el formulario de check
        $('document').ready(
            // Al seleccionar el checkBox llamado Puntos cambiara el tipo de grafica

            //this.graficaCanvas(),

            $('#typeOptions').change(function(){
                let tipo = $("#typeOptions option:selected").val();

                if (tipo == "bar") {
                    mySelf.setTipo("barras");
                } else if (tipo == "line") {
                    mySelf.setTipo("lineas");
                } else if (tipo == "pie") {
                    mySelf.setTipo("pastel");
                } else {
                    mySelf.setTipo("puntos");
                }
            }),

            $('#checkPointY').change(function(){
                var check:any = document.getElementById('checkPointY');
                // Para ocultar el eje y
                if(check.checked) { // Si el checkbox está presionado se oculta el eje y
                    mySelf.chart.options.scales.y.ticks.display = false;
                    mySelf.chart.options.scales.y.title.display = false;
                } else { //cuando se deselecciona se muestra el eje y
                    mySelf.chart.options.scales.y.ticks.display = true;
                    mySelf.chart.options.scales.y.title.display = true;
                }
                mySelf.chart.update();
            }),

            $('#botonDescarga').click(function(){
                mySelf.descarga();
            }),
        );

        for(let j=0;j<this.json.p.length;j++){
            $('document').ready(
                $('#checkPointGraphic'+j).change(function(){ //funcion para ocultar las graficas
                    var check:any = document.getElementById('checkPointGraphic'+j);
                    // Para quitar de gráficas del canvas 
                    if(check.checked) { // Si el checkbox está presionado se ocultan los dataset0
                        console.log("fui presionado IF quitar grafica "+j); //comprobar que si entra al if
                        mySelf.chart.options.plugins.legend.display = true;
                        mySelf.chart.show(j);
                    } else { //cuando se deselecciona se muestra el dataset 0
                        mySelf.chart.options.plugins.legend.display = true;
                        mySelf.chart.hide(j);
                    }
                })
            );
        }

      
    }

    actualizaGraficas(){

        for (let i = 0; i < this.json.p.length; i++) {
            var check:any = document.getElementById('checkPointGraphic'+i);
            if (check.checked == false) {
                this.chart.hide(i);
            }
        }
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
    setTipo(tipo:string):void {

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

        this.actualizaGraficas();
        
    } // FIN setTipo()


    graficaCanvas(json: any, c: any, type: any){
        console.log("Cargando grafica canvas");
            let canvas2 = document.getElementById("chartContainer");


            let dataPrueba = [
                { label: "banana", y: 18 },
                { label: "orange", y: 29 },
                { label: "apple", y: 40 },                                    
                { label: "mango", y: 34 },
                { label: "grape", y: 24 }
            ];

            let data = [];

            for (let i = 0; i < json.xdata.length; i++) {
                const datos = {
                    label: json.xdata[i],
                    y: 1
                }
                
            }



            var chart = new CanvasJS.Chart(canvas2, {
        
              title:{
                text: "Fruits sold in First Quarter"              
              },
              data: [//array of dataSeries              
                { //dataSeries object
        
                 /*** Change type "column" to "bar", "area", "line" or "pie"***/
                 type: "column",
                 dataPoints: dataPrueba
               }
               ]
             });
        
            chart.render();


    }

}
