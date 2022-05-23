import { FileModelInterface } from '../file-model-interface';
import * as THREE from 'three';
import Chart from 'chart.js/auto';

declare var Parser:any;
declare var CanvasJS:any;
declare var $:any;

export class Particulas implements FileModelInterface{

    constructor(public json:any, public canvas:any) {  }
    
    // Variables que seran usadas para la creación de las particulas
    mySelf = this;
    paso: any = 1;
    particulas:any = 0;
    funciones: any = 0;
    pars: any = [];//particulas (objetos)
    color: any = [];//colores
    trays: any = [];//posiciones de cada particula
    trayso: any = [];//lineas
    colorTrayectoria: any = []; //rreglo para almacenar el color de la trayectoria de una particula aislada
    play: any = false; //Para detener o reanudar la simulacion
    aislar: any = false;//Guarda si la particula es aislada
    numeroParticula: any = null; //Numero de particula que ha sido aislada
    // Se crea la escena sobre la que se pintaran las particulas, ademas de la camara
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    //variable que sera usada para identificar el menu principal e indivudual
    dateId = new Date();
    idVisualizador = this.dateId.getTime();
    //Varible usada para cambiar el icono de play a pause y viceversa
    public pausaAnimacion: boolean = false; // Al inicio se pone en False pues no queremos que este pausada.
    
    draw(json: any, c: any): void {

        var points: any = [];
        var objParticulas = this.mySelf;
        
        objParticulas.scene.background = new THREE.Color( 0xD3D3D3 );
        /**
         * Metodo encargado de crear el lugar donde se visualizara la simulacion, este metodo crea
         * -> La escena
         * -> Las paredes del lugar de la visualizacion
         */
        function dibujaCanal() {
            objParticulas.camera.position.set(0, 0, 1);//Si se desea que se observe mas grande el canal disminuir en z
            objParticulas.renderer.setSize(window.innerWidth, window.innerHeight);
            objParticulas.play = true; //Si la escena se ha creado correctamente podemos comenzar la animacion
            objParticulas.funciones = json.canal;
            var barizq = objParticulas.funciones.LBarrier.value;//Estos valores se obtienen de particulas.json
            var barder = objParticulas.funciones.RBarrier.value;//Estos valores se obtienen de particulas.json

            var xRange = barder - barizq;
            var h = xRange / 1000; //si se requiere mas detalle en las funciones hacer mas pequeño este valor
            var x = barizq;
            var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 200 });//azul
            var mat2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 200 });//rojo

            var formaCanal = new THREE.Shape();

            // definiendo funciones
            var funciont = objParticulas.funciones.TWall.function;//Accedemos a la funcion que se encuentra en el .json
            var tWall = objParticulas.texttoFunction(funciont);//Convierte la función extraida del json a una funcion de javascript
            var funcionb = objParticulas.funciones.BWall.function;
            var bWall = objParticulas.texttoFunction(funcionb);

            //TWALL es la pared superior del canal
            var tgeometry = new THREE.BufferGeometry();
            var p0 = tWall(x);//evalua la función twall en el punto x = 0
            formaCanal.moveTo(x + h, p0); // punto inicial de la forma del canal
            while (x < barder) {
                var y = tWall(x);
                points.push(new THREE.Vector3(x, y, 0));
                tgeometry.setFromPoints(points);
                x += h;
                if (x <= barder) { formaCanal.lineTo(x, y - h); } //menos h para que no tape la linea de la frontera

            }
            if (objParticulas.funciones.TWall.isReflec) {
                var funt = new THREE.Line(tgeometry, material);//azul
            } else {
                var funt = new THREE.Line(tgeometry, mat2);//rojo
            }

            var y;
            //RBarrier
            y = tWall(barder);
            var rgeometry = new THREE.BufferGeometry();
            points.push(new THREE.Vector3(barder, y, 0));
            rgeometry.setFromPoints(points);
            formaCanal.lineTo(barder - h, y);
            
            y = bWall(barder);
            points.push(new THREE.Vector3(barder, y, 0));
            rgeometry.setFromPoints(points);
            formaCanal.lineTo(barder - h, y);
            
            if (objParticulas.funciones.RBarrier.isReflec) {
                var barr = new THREE.Line(rgeometry, material);
            } else {
                var barr = new THREE.Line(rgeometry, mat2);
            }

            //BWALL
            var bgeometry = new THREE.BufferGeometry();
            x = barder;
            while (x >= barizq - h) {
                var y = bWall(x);
                points.push(new THREE.Vector3(x, y, 0));
                bgeometry.setFromPoints(points);
                x -= h;
                if (x >= barizq) { formaCanal.lineTo(x, y + 3 * h); }// mas 3h para que no tape la linea del canal
            }
            if (objParticulas.funciones.BWall.isReflec) {
                var funb = new THREE.Line(bgeometry, material);
            } else {
                var funb = new THREE.Line(bgeometry, mat2);
            }

            //LBarrier, solo cortan en twall y bwall
            y = bWall(barizq);
            var lgeometry = new THREE.BufferGeometry();
            points.push(new THREE.Vector3(barizq, y, 0));
            lgeometry.setFromPoints(points);
            formaCanal.lineTo(barizq + h, y);
            
            y = tWall(barizq);
            points.push(new THREE.Vector3(barizq, y, 0));
            lgeometry.setFromPoints(points);
            formaCanal.lineTo(barizq + h, y);

            if (objParticulas.funciones.LBarrier.isReflec) {
                var barl = new THREE.Line(lgeometry, material);
            } else {
                var barl = new THREE.Line(lgeometry, mat2);
            }

            //crea canal y agrega a escena, luego agrega barreras del canal
            var cgeometry = new THREE.ShapeGeometry(formaCanal);
            var materialc = new THREE.MeshBasicMaterial({ color: 0x9B9B9B });
            var canal = new THREE.Mesh(cgeometry, materialc);

            objParticulas.scene.add(canal);
            objParticulas.scene.add(funt);
            objParticulas.scene.add(barr);
            objParticulas.scene.add(funb);
            objParticulas.scene.add(barl);
        }//Fin dibuja canal

        /**
         * Metodo encargado de dibujar cada una de las particulas
         */
        function dibujaParticulas() {
            dibujaCanal();
            //Generamos un color pseudoaleatorio
            var color = 1 + objParticulas.numeroParticula * 100;
            //Nos aseguramos que el objeto este vacio
            objParticulas.particulas = {};
            //Si la particula es aislada
            if (objParticulas.aislar) {

                //Leemos las propeidades de archivo JSON
                objParticulas.particulas = json.particles.particle[objParticulas.numeroParticula];
                //Obtenemos solo los pasos de una particula
                var x = objParticulas.particulas.pasos[0].x;
                var y = objParticulas.particulas.pasos[0].y;
                //Creamos las esferas
                var p = new THREE.SphereGeometry(.01,10,10); //(radio, ..., ...)
                var aux = color * 111111; //Generamos el color
                objParticulas.color.push(aux);//Guardamos el color en el arreglo
                //Asignamos el color a la particula
                var material = new THREE.MeshBasicMaterial({ color: aux });
                //Creamos la esfera y le asignamos su tamaño y color
                var sphere = new THREE.Mesh(p, material);
                //Asignamos las posiciones para la esfera
                sphere.position.x = parseFloat(x);
                sphere.position.y = parseFloat(y);
                //Agregamos la esfera al visualizador         
                objParticulas.scene.add(sphere);
                objParticulas.pars.push(sphere);//Se guarda la particula en el arreglo this.pars = [] 
                //Guardamos las trayectorias de la esfera
                objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
            } else { //Si la particula no es aislada
                objParticulas.particulas = json.particles.particle;//se guarda el arreglo de las particulas del json a la var particulas

                //dibuja particulas y las coloca en la primer posicion
                objParticulas.particulas.forEach(function (particula: any) {//para cada particula se realiza

                    var x = particula.pasos[0].x;
                    var y = particula.pasos[0].y;
                    var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                    var aux = color * 111111;
                    objParticulas.color.push(aux);

                    var material = new THREE.MeshBasicMaterial({ color: aux });
                    var sphere = new THREE.Mesh(p, material);

                    sphere.position.x = parseFloat(x);//convierte a flota la cadena x del json
                    sphere.position.y = parseFloat(y);
                    objParticulas.scene.add(sphere);
                    objParticulas.pars.push(sphere);
                    objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
                    color += 100;
                });
            }
            objParticulas.animate(objParticulas.scene, objParticulas);
        }//FIN dibujaParticulas();
        dibujaParticulas();
    }//FIN draw(json,canvas);
    
    /** Funcion animate **/
    animate(scene:any,objParticulas:any):void{
        function avanza() {
            if (objParticulas.play != false) {
                objParticulas.paso++;
                objParticulas.setPos(objParticulas.aislar, objParticulas);
            }
            objParticulas.renderer.render(scene, objParticulas.camera);
            requestAnimationFrame(avanza);
        }
        requestAnimationFrame(avanza);
    }//FIN animate(escena,particulas)
    
    /**
    * Metodo encargado de guardar cada una de la posiciones de las particulas
    * @params
    * aislar : Indica si la particula sera aislada
    * objParticulas: Es el objeto que contiene toda la informacion de la particula.
    */
    setPos(aislar = false, objParticulas:any): void {
        //Si la particula NO es aislada
        if (aislar == false) {
            var checkID = "Checkpt1"+this.idVisualizador;

            //Recorremos el arreglo de cada una de las particulas
            for (var i = 0; i < objParticulas.particulas.length; i++) {
                if (objParticulas.paso < objParticulas.particulas[i].pasos.length) {
                    //Guardamos cada posicion
                    var x = parseFloat(objParticulas.particulas[i].pasos[objParticulas.paso].x);
                    var y = parseFloat(objParticulas.particulas[i].pasos[objParticulas.paso].y);
                    //Metemos cada posicion en el arreglo pars 
                    objParticulas.pars[i].position.setX(x);
                    objParticulas.pars[i].position.setY(y);
                    //Guardamos en el arreglo trays cada uno de los puntos
                    objParticulas.trays[i].push({ "x": x, "y": y });
                }
            }
            var checkID = "Checkpt1"+this.idVisualizador;
            var checkbox = document.getElementById(checkID);
            //Si Trayectoria esta marcado, se mostraran las traqyectorias de las particulas
            if (checkbox) {
                //objParticulas.muestraTray(checkbox);
                objParticulas.muestraTray(checkbox, aislar);
            }
        } else {//La particula es aislada, repetimos el procedimiento anterior pero solo para una particula
            if (objParticulas.paso < objParticulas.particulas.pasos.length) {
                var x = parseFloat(objParticulas.particulas.pasos[objParticulas.paso].x);
                var y = parseFloat(objParticulas.particulas.pasos[objParticulas.paso].y);
                objParticulas.pars[0].position.setX(x);
                objParticulas.pars[0].position.setY(y);
                objParticulas.trays[0].push({ "x": x, "y": y });
            }
            var checkID = "Checkpt1"+this.idVisualizador;
            var checkbox = document.getElementById(checkID);
            if (checkbox) {
                objParticulas.muestraTray(checkbox,aislar);
            }
        }
    }//FIN setPos(aislar,objParticulas)

    /**
    * Metodo encargado de mostrar las trayectoria de cada una de las
    * particulas, funciona para particula aislada y para todo el arreglo
    * de particulas
    */
    muestraTray(checkbox:any, aislar:any): void {
        this.trayso = [];
        var vertices = [];//Puntos que seran unidos para generar la linea de la trayectoria
        let xP = 1000;//Punto en el que la particula cambiara de color su trayectoria
        
        if (checkbox.checked == true) {//Posiciones de cada particula

            for (var i = 0; i < this.trays.length; i++) {
                
                if(aislar == true && this.trays.length == 1) {
                    var geometry = new THREE.BufferGeometry();
                    var colorLinea = [];
                    for (var j = 0; j < this.trays[i].length; j++) {
                        var x = this.trays[i][j].x;
                        var y = this.trays[i][j].y;
                        vertices.push(x, y, 0);
                        if (j < xP) {
                            // Color de la linea: Rojo
                            colorLinea.push(255, 0, 0);
                        } else {
                            // Color de la linea: Blanco
                            colorLinea.push(51, 255, 85);
                        }
                    }
                    //Pasamos las posiciones
                    var arrayVertices = new Float32Array(vertices);
                    geometry.setAttribute('position',new THREE.BufferAttribute(arrayVertices,3));
                    // Pasamos el color
                    var arrayColors = new Float32Array(colorLinea);
                    geometry.setAttribute('color',new THREE.BufferAttribute(arrayColors,3));

                    var material = new THREE.LineBasicMaterial({color: 0xffffff,vertexColors: true});
                    var tray = new THREE.Line(geometry, material);
                    this.scene.add(tray);

                } else { //Si la particula no esta aislada
                    var points = [];
                    var geometry = new THREE.BufferGeometry();
                    var material = new THREE.LineBasicMaterial({ color: this.color[i], linewidth: 0.1 });
                    for (var j = 0; j < this.trays[i].length; j++) {
                        var x = this.trays[i][j].x;
                        var y = this.trays[i][j].y;
                        points.push(new THREE.Vector3(x, y, 0));
                        geometry.setFromPoints(points);
                    }
                    var tray = new THREE.Line(geometry, material);
                    this.scene.add(tray);
                    this.trayso.push(tray);
                }
            }
        }
    }//FIN muestraTray*/
    
    //Metodos para interactuar con el menu
    pause(){
        if (this.play == true) {
            this.play = false;
        } else {
            this.play = true;
        }
    }

    //regresa 5 pasos
    regresar(){
        this.play = false;
        this.paso -= 5;
        this.setPos(this.aislar, this.mySelf);
        this.renderer.render(this.scene, this.camera);
    }

    //avanza 5 pasos
    avanzar(){
        this.play = false;
        this.paso += 5;
        this.setPos(this.aislar, this.mySelf);
        this.renderer.render(this.scene, this.camera);
    }

    mostrarMenu(nuevoId:any, stringCanvas='myCanvas'):void {
        var objParticulas = this.json;
        var mySelf = this;
        mySelf.idVisualizador = nuevoId;
        var contenedor= "<div class='row' id='visualizador" + mySelf.idVisualizador + "'>"+
                            //"<div class='container col-sm-10' id='"+ mySelf.idVisualizador + "'></div> " +
                            "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+ mySelf.idVisualizador + "'></div>" +
                        "</div>";

        var Tau= this.json.tiempos[0].valor.toFixed(2);
        var Loop= this.json.tiempos[1].valor.toFixed(2);
        var Direct= this.json.tiempos[2].valor.toFixed(2);

        if(stringCanvas == 'myCanvas'){//Se coloca para el menuPrincipal
            $('.menu__default').after(contenedor);
        }else{//si se aislo una particula
            $('.'+stringCanvas).after(contenedor);
        }
        
        var item = 
            "<div id = 'particulasMenu"+mySelf.idVisualizador + "' class='particulasMenuPrincipal'>" +
                "<h3 class='align-text-top section__subtitle' id='tituloPrincipal'><span>Menu Particulas</span></h3>"+
                "<ul class='nav flex-column'>" +
                    "<li class='nav-item'>" +
                        "<div class='form-check'>" +
                            "<button  type='button' class='btn btn-primary' id='regresar" +mySelf.idVisualizador+ "'> <i class='bx bx-skip-previous'></i> </button>"+
                            "<button  type='button' class='btn btn-primary' id='pausa" +mySelf.idVisualizador+ "'> <i id='iconBtn' class='bx bx-pause'></i> </button>"+
                            "<button  type='button' class='btn btn-primary' id='avanzar" +mySelf.idVisualizador+ "'> <i class='bx bx-skip-next'></i> </button>"+
                        "</div>" +
                    "</li>" +
                    
                    "<li class='nav-item'>"+
                        "<div class='form-check'>" +
                            "<input type='checkbox' class='form-check-input' id='Checkpt1"+mySelf.idVisualizador+"'>" +
                            "<label class='form-check-label' for='Checkpt1" + mySelf.idVisualizador + "'><span></span></label>" +
                            "<span>Ver Trayectorias</span>" +
                        "</div>" +
                    "</li><br>" +

                    "<li class='nav-item'>" +
                        "<div class='aisla-particula' id='aislaParticula" +mySelf.idVisualizador+ "'>"+
                            "<label><b>Aislar Particula</b></label><br>" +
                            "<input type='number' min='0' max='4'  size='4' id='particula' placeholder='Elija particula' style='width:115px;'>" +
                            "<button class='btn-aceptar' type='submit' id='aceptar'>Aceptar</button>" + //BOTON ACEPTAR: AGREGAR HOVER Y ESTILOS
                        "</div>" +
                    "</li>" +
        
                    "<li class='nav-item'  id='Resultado" +mySelf.idVisualizador+ "'>" +
                        "<div class='result'>"+ 
                            "<h4 class='subtitulo_particulas'>Tiempos</h4>"+
                            "<label class='label-particula'>Tau Time: </label>"+
                            "<input type='text' id='Tau' name='fname' readonly size='5' value='"+Tau+"'><br><br>"+
                            "<label class='label-particula'>Direct Time: </label> "+
                            "<input type='text' id='direcTime'  readonly size='5' value='"+Direct+"'><br><br>"+
                            "<label class='label-particula'>Looping Time: </label>"+  
                            "<input type='text' id='LoopingTime'  readonly size='5' value='"+Loop+"'><br>"+
                            "<div class='btn-grafica'>" +
                                "<button  type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModalCenter' id='btngrafica" +mySelf.idVisualizador+ "'>"+
                                    "Generar grafica" +
                                "</button>" +
                            "</div>"+
                        "</div>"+
                    "</li>" +
                "</ul>" + 
            "</div>";
        //boton
        $("#menu" + mySelf.idVisualizador).append(item);
        $("#menu" + mySelf.idVisualizador).css({ "visibility": "visible", "height": "600px", "width": "250", "display":"inline" })
        /************************************************************************************************ */
        var check = document.getElementById('Checkpt1'+ mySelf.idVisualizador);
        
        //EvenListeners: Se usa Jquery para capturar los eventos
        $('document').ready(
            $('#pausa' + mySelf.idVisualizador).click(function(){
                if(mySelf.pausaAnimacion === true){
                    $('#iconBtn').removeClass("bx-play");
                    $('#iconBtn').addClass("bx-pause");
                    mySelf.pausaAnimacion = false;
                }else{
                    $('#iconBtn').removeClass("bx-pause");
                    $('#iconBtn').addClass("bx-play");
                    mySelf.pausaAnimacion = true;
                }
                mySelf.pause();
            }),

            $('#regresar' + mySelf.idVisualizador).click(function () {
                mySelf.regresar();
            }),

            $('#avanzar' + mySelf.idVisualizador).click(function () {
                mySelf.avanzar();
            }),
            //Si el checkbox esta marcado muestra las trayectorias
            $('#Checkpt1'+mySelf.idVisualizador).change(function(){
                if($(objParticulas).is(":checked")){
                    mySelf.muestraTray(check,mySelf.aislar);
                }
            }),       
      
            $('#aceptar').click(function(e:any){
                var valor = $('#particula').val();
                //Si el input es vacio
                if( valor == ''){   
                    e.preventDefault();//No mandamos nada
                } else {//En otro caso
                    //Creasmo la nueva particula
                    mySelf.aislaParticula(valor);
                    $('#particula').val('');//Limpiamos el campo para poder ingresar otra particula     
                }
            }),
            //Envento click para el boton que genera la grafica
            $('#btngrafica' + mySelf.idVisualizador).click(() =>{
                
                var modalPrueba = 
                '<div class="modal">'+
                    '<div class="modal__content" style="max-width:850px;">'+
                        '<div class="modal__header">'+
                            '<h2 class="section__title text-center">Datos Estadisticos</h2>'+
                            '<button class="close-btn close" data-dismiss="modal" aria-label="Close">'+
                                '<i class="bx bx-x"></i>'+
                            '</button>'+
                        '</div>'+
                        '<div class="modal__body">'+
                            '<div class="modal__buttons">'+
                                '<button class="btn btn-primary" id="bt-char1">Histograma de Tiempos</button>'+
                                '<button class="btn btn-primary" id="bt-char2">Histograma de Golpes</button>'+
                            '</div>' +
                            '<div class="modal-canvas" id="chart-1" style="display: block; height: 300px; width: 100%;"></div>'+
                            '<div class="modal-canvas" id="chart-2" style="height: 300px; width: 100%;"></div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
                
                $("#menu").after(modalPrueba);
                $('.close').click(function(){
                    $(".modal").hide();
                });
                $('#bt-char1').click(function() {
                    $('#chart-1').css("display","block");
                    $('#chart-2').css("display","none");
                    chart.render();
                    //console.log("BT-CHART1");
                });
                $('#bt-char2').click(function() {
                    $('#chart-2').css("display","block");
                    $('#chart-1').css("display","none");
                    chart2.render();
                    //console.log("BT-CHART2");
                });
                
                let TiemposNW = [];
                let Golpes = [];

                for (var index = 0; index < this.json.golpes.length; index++) {
                    Golpes.push({ "y": this.json.golpes[index].valor, "label": this.json.golpes[index].nomPared});
                }
                
                for (var index = 0; index < this.json.tiempos.length; index++) {
                        TiemposNW.push({ "y": this.json.tiempos[index].valor, "label": this.json.tiempos[index].time});
                }

                var div1 = document.getElementById('chart-1');
                let chart = new CanvasJS.Chart(div1, {
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light2",
                    title: {
                        text: "Histograma de Tiempos"
                    },
                    axisY:{
                        title:"Tiempos",
                        includeZero:true,
                    },
                    data: [{
                        type: "column",
                        dataPoints: TiemposNW
                    }]
                });
                chart.render();
                var div2 = document.getElementById('chart-2');
                let chart2 = new CanvasJS.Chart(div2, {
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light2",
                    title: {
                        text: "Histograma de golpes en fronteras reflejantes"
                    },
                    axisY:{
                        title:"Número de golpes",
                        includeZero:true,
                    },
                    data: [{
                        type: "column",
                        dataPoints: Golpes
                    }]
                });

            }),
        );        
    }//Fin funcion mostrar menu

    /**
     * Metodo que crea un visulizador nuevo y ademas un menu cuando
     * la particula se aisla
     */
    aislaParticula(particula:any):any{
        
        //Si la particula no existe en el arreglo
        if( particula >= this.particulas.length ){
            //Mensaje de error al ingresar un numero no valido
            const mensaje = "<div id = 'mensaje'>"+
                                "<h3>Valor inválido</h3>"
                            "</div>";
            //Al presionar el boton aceptar aparecera el mensaje de error y desaperecera despues de 1.5 seg.
            $('#aceptar').after(mensaje); 
            setTimeout( () => {
                $('#mensaje').remove();
            },1500 );
            return false;
        }
        this.colorTrayectoria=[];

        //Se crea el menu de la particula
        var nuevoItem = "<div class='nuevo' id ='particula"+ particula +"'>"+
                            "<div class='text-center'>"+
                                //"<div style='width: 100%; background: #57a519; border-radius: 0; text-color: #FDFEFE;'>Particula " + particula + "</div>" +
                                "<button class='btn btn-titulo' disabled> <span class='titulo-particulas'>Particula " + particula + "</span> </button>" +
                            "</div>" +
                        "</div>";       
        //Creamos las variebles para el nuevo canvas
        var canvas2:any = document.createElement('canvas');
        canvas2.id = "canvas"+particula;
        canvas2.class = "bg-light border";
        canvas2.style = "width: 100vh";
        //Se crea el objeto en es te caso de tipo Particula
        var object:any = new Particulas(this.json, canvas2);
        //Se indica que la particula sera aislada
        object.aislar = true;
        //Guardamos el numero de la particula que ha sido aislada
        object.numeroParticula = particula;
        //Pasamos el metodo draw() el archivo JSON que contiene la informacion de la particula aislada
        object.draw(this.json,canvas2);
        //Agregamos el nuevo visualizador al nevegador
        $('#myCanvas').after(nuevoItem);
        $('#particula'+particula).after(canvas2);
        this.mostrarMenuIndividual(particula, object);
        
        //##########################PARA USAR EL MENU PRINCIPAL#############################
        /*var nuevoID = new Date();
        object.idVisualizador = nuevoID.getTime();
        object.mostrarMenu(object.idVisualizador, 'div-canvas');
        $('.div-canvas').after(nuevoItem);
        $('#particula'+particula).after(canvas2);
        $('#aislaParticula'+object.idVisualizador).remove();//Quitamos los elementos que no deben estar en menus hijos visualizador1
        $('#Resultado'+object.idVisualizador).remove();//*/
        //##########################FIN PARA USAR EL MENU PRINCIPAL#############################

        //Con ayuda de Jquery capturamos el evento cuando el usuario desee elminar el visualizador del navegador
        $('#quitar'+ particula ).click(function():any{
            var respuesta = confirm("Desea eliminar el visualizador de particula #" + particula);
            if( respuesta ) {//Si se recibe una respuesta
                object = {};
                $('#particula'+ particula ).remove();
                $('#canvas'+particula).remove();
                $('#visualizador'+particula).remove();//descomentar si se usa mostrarMenuIndividual
                //$('#visualizador'+object.idVisualizador).remove();//para usar el menu principal*/
            } else {//Si el usuario cancela sólo retornamos false
                return false;
            }
        });
    }//FIN aislarParticula*/

    mostrarMenuIndividual(numParticula:any, object:any){
        var mySelf = this;
        var pausaAnimacionAislada = false;
        var contenedor= "<div class='row' id='visualizador" + numParticula + "'>" +
                            "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu" + numParticula + "'></div>" +
                        "</div>";
        
        $("#particula"+numParticula).after(contenedor);

        var item = 
            "<div id = 'particulasMenu" + numParticula + "'"+ "class='particulasMenu' >" +
                "<h3 class='align-text-top' id='titulo"+numParticula+"'><span>Menu Particula "+numParticula+"</span></h3>"+
                "<ul class='nav flex-column'>" +
                    "<li class='nav-item'>" +
                        "<div class='form-check'>" +
                            "<button  type='button' class='btn btn-primary' id='regresar" + numParticula + "'> <i class='bx bx-chevrons-left' ></i> </button>"+
                            "<button  type='button' class='btn btn-primary ' id = 'pausa" + numParticula + "'> <i id='iconBtnAislado' class='bx bx-pause'></i> </button>"+
                            "<button  type='button' class='btn btn-primary'  id='avanzar" + numParticula + "'> <i class='bx bx-chevrons-right'></i> </button>"+
                        "</div>" +
                        "<div class='form-check'>" +
                            "<input type='checkbox' class='form-check-input' id='Checkpt1" + object.idVisualizador + "'>" +
                            "<label class='form-check-label' for='Checkpt1" + object.idVisualizador + "'><span></span></label>" +
                            "<span>Ver Trayectorias</span>"+
                        "</div>" +
                        "<div>"+
                            "<button class='btn btn-eliminar' id='quitar"+ numParticula +"'> Quitar </button>" +
                        "</div>"+
                    "</li>" +
                "</ul>" + 
            "</div>";
        //Agregamos el menu
        $("#menu"+ numParticula).append(item);
        $("#menu"+ numParticula).css({ "visibility": "visible", "width": "250" });
        /************************************************************************************************ */
        var check:any = document.getElementById('Checkpt1'+ object.idVisualizador);
        //Metodos para interactuar con el menu
        function pause(){
            if (object.play == true) {
                object.play = false;
            } else {
                object.play = true;
            }
        }

        //regresa 5 pasos
        function regresar(){
            object.play = false;
            object.paso -= 5;
            object.setPos(object.aislar, object.mySelf);
            object.renderer.render(object.scene, object.camera);
        }

        //avanza 5 pasos
        function avanzar(){
            object.play = false;
            object.paso += 5;
            object.setPos(object.aislar, object.mySelf);
            object.renderer.render(object.scene, object.camera);
        }
        //EvenListeners: Se usa Jquery para capturar los eventos
        $('document').ready(
            $('#pausa' + numParticula).click(function(){
                if(pausaAnimacionAislada === true){
                    $('#iconBtnAislado').removeClass("bx-play");
                    $('#iconBtnAislado').addClass("bx-pause");
                    pausaAnimacionAislada = false;
                }else{
                    $('#iconBtnAislado').removeClass("bx-pause");
                    $('#iconBtnAislado').addClass("bx-play");
                    pausaAnimacionAislada = true;
                }
                pause();
            }),

            $('#regresar' + numParticula).click(function () {
                regresar();
            }),

            $('#avanzar' + numParticula).click(function () {
                avanzar();
            }),
            //Si el checkbox esta marcado muestra las trayectorias
            $('#Checkpt1'+object.idVisualizador).change(function(){
                if($(mySelf).is(":checked")){
                //if(check.checked) {
                    mySelf.muestraTray(check, object.aislar);
                }
            })
        );
    }
    
    texttoFunction(funcion: any) {
        return Parser.parse(funcion).toJSFunction(['x']);
    }
}