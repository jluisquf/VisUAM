import { FileModelInterface } from '../file-model-interface';
import Chart from 'chart.js/auto'; // se importa la libreria chart.js 

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
        let arrXValues = []; // arreglo que guarda los valores de la etiqueta X
        let arrYValues = []; // arreglo que guarda los valores de la etiqueta Y
        let colors = []; // arreglo que guarda los valores de los colores de las graficas
        // Se itera sobre el arreglo de puntos para obtener sus valores
        for (let i = 0; i < json.p.length; i++) {
            arrXValues.push(json.p[i].x);
            arrYValues.push(json.p[i].y);
            
            if (json.p[i].hasOwnProperty('color') == false || json.p[i].color == "") {
                colors.push("#3B34A6");    
            } else {
                colors.push(json.p[i].color);    
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


        const errores = this.validaJSON(json);
        let noErrores = 0;
        for (let i = 0; i < errores.length; i++) {
            if (errores[i] != "correcto") {
                noErrores++;
            }
        }

        if (noErrores == 0) {
            this.chart = new Chart(c, { type: tipo, data, options});    
        } else {
            console.log("Errores encontrados: " , errores);
            // window.location.reload();
        }
        
    }


    validaJSON(datosJSON: any): any {
        
        let errores: any[] = [];
        errores.push(this.validaTipo(datosJSON)); 
        errores.push(this.validaPuntos(datosJSON));
        errores.push(this.validaEncabezados(datosJSON));
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

    validaPuntos(json:any): String {
        let contador = 0;

        if (json.p.length == 0) {
            contador++;
        }

        for (let i = 0; i < json.p.length; i++) {

            if (json.p.length == 0) {
                contador++;
            }
            
            // if (json.p[i].length == 0) {
            //     contador++;
            // }
        }    

        if (contador > 0) {
            return "error-datos";
        } else{
            return "correcto";
        }
    }

    validaEncabezados(json: any):String{
        if (json.title == "" || json.xlabel == "" || json.ylabel == "" || json.hasOwnProperty('title') == false || json.hasOwnProperty('xlabel') == false || json.hasOwnProperty('ylabel') == false) {
            return "error-encabezados";
        } else{
            return "correcto";
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
