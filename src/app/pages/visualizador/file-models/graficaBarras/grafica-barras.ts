import { FileModelInterface } from '../file-model-interface';
import Chart from 'chart.js/auto'; // se importa la libreria chart.js 

declare var CanvasJS: any; // otra libreria para graficar
declare var $: any;

export class GraficaBarras implements FileModelInterface {

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
            colors.push(json.p[i].color);
        }
        var xValues = arrXValues;//["Italy", "France", "Spain", "USA", "Argentina"]; //json.data.labels;
        var yValues = arrYValues;//[55, 49, 44, 24, 15];//json.data.data;
        var barColors = colors;//["red", "green", "blue", "orange", "brown"]; // json.data.backgroundColor;//
        var tipo = json.type; // se obtiene el tipo de grafica [bar, line, ...]
    
        this.chart = new Chart(c, {
          type: tipo,
          data: {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: json.title,
              }
            }
          }
        });
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
                                        "<input type='checkbox' class='form-check-input' id='checkAzul'>" +
                                        "<label class='form-check-label' for='checkAzul'><span></span></label>" +
                                        "<span> Change chart </span>" +
                                    "</div>" +
                                "</li>" +
                            "</ul>" +
                        "</div>"+
                    "</div>";


        $('#menu' + mySelf.id).append(item);
        $('#menu' + mySelf.id).css({ "visibility": "visible", "width": "250" })
        /******************************************************************************** */
    }
}
