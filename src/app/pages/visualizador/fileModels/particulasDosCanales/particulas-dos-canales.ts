import { FileModelInterface } from '../file-model-interface';
import * as THREE from 'three';

declare var Parser:any;
declare var CanvasJS:any;
declare var $:any;

export class ParticulasDosCanales implements FileModelInterface {

    constructor(public json:any, public canvas:any) {  }
    
    mySelf = this;
    //Para NtoW
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
    
    //Para WtoN
    pasoW: any = 1;
    particulasW:any = 0;
    funcionesW: any = 0;
    parsW: any = [];//particulas (objetos)
    colorW: any = [];//colores
    traysW: any = [];//posiciones de cada particula
    traysoW: any = [];//lineas
    colorTrayectoriaW: any = []; //rreglo para almacenar el color de la trayectoria de una particula aislada
    aislarW: any = false;//Guarda si la particula es aislada
    numeroParticulaW: any = null; //Numero de particula que ha sido aislada

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
        var pointsW: any = [];
        var objParticulas = this.mySelf;
        
        objParticulas.scene.background = new THREE.Color( 0xD3D3D3 );
        /**
         * Metodo encargado de crear el lugar donde se visualizara la simulacion, este metodo crea
         * -> La escena
         * -> Las paredes del lugar de la visualizacion
         */
        function dibujaCanal() {
            objParticulas.camera.position.set(0, 0, 1.30);//Si se desea que se observe mas grande el canal disminuir en z
            objParticulas.renderer.setSize(window.innerWidth, window.innerHeight);

            var desplazamiento = 1;

            if (objParticulas.json.hasOwnProperty('NtoW')) {

                objParticulas.play = true; //Si la escena se ha creado correctamente podemos comenzar la animacion
                
                objParticulas.funciones = objParticulas.json.NtoW.canal;
                
                var barizq = objParticulas.funciones.LBarrier.value;
                var barder = objParticulas.funciones.RBarrier.value;

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
                formaCanal.moveTo(x + h - desplazamiento, p0); // punto inicial de la forma del canal
                while (x < barder) {
                    var y = tWall(x);
                    points.push(new THREE.Vector3(x-desplazamiento, y, 0));
                    tgeometry.setFromPoints(points);
                    x += h;
                    if (x <= barder) { formaCanal.lineTo(x-desplazamiento, y - h); }//menos h para que no tape la linea de la frontera
                }
                if (objParticulas.funciones.TWall.isReflec) {
                    var funt = new THREE.Line(tgeometry, material);//azul
                } else {
                    var funt = new THREE.Line(tgeometry, mat2);//rojo
                }

                var y;
                // Barrera derecha
                y = tWall(barder);
                var rgeometry = new THREE.BufferGeometry();
                points.push(new THREE.Vector3(barder-desplazamiento, y, 0));
                rgeometry.setFromPoints(points);
                formaCanal.lineTo(barder -desplazamiento- h, y);
                y = bWall(barder);
                points.push(new THREE.Vector3(barder-desplazamiento, y, 0));
                rgeometry.setFromPoints(points);
                formaCanal.lineTo(barder-desplazamiento - h, y);
                if (objParticulas.funciones.RBarrier.isReflec) {
                    var barr = new THREE.Line(rgeometry, material);
                } else {
                    var barr = new THREE.Line(rgeometry, mat2);
                }

                // Barrera abajo
                var bgeometry = new THREE.BufferGeometry();
                x = barder;
                while (x >= barizq - h) {
                    var y = bWall(x);
                    points.push(new THREE.Vector3(x-desplazamiento, y, 0));
                    bgeometry.setFromPoints(points);
                    x -= h;
                    if (x >= barizq) { formaCanal.lineTo(x-desplazamiento, y + 3 * h); }// mas 3h para que no tape la linea del canal
                }
                if (objParticulas.funciones.BWall.isReflec) {
                    var funb = new THREE.Line(bgeometry, material);
                } else {
                    var funb = new THREE.Line(bgeometry, mat2);
                }

                // Barrera Izquierda
                y = bWall(barizq);
                var lgeometry = new THREE.BufferGeometry();
                points.push(new THREE.Vector3(barizq-desplazamiento, y, 0));
                lgeometry.setFromPoints(points);
                formaCanal.lineTo(barizq-desplazamiento + h, y);
                y = tWall(barizq);
                points.push(new THREE.Vector3(barizq-desplazamiento, y, 0));
                lgeometry.setFromPoints(points);
                formaCanal.lineTo(barizq -desplazamiento+ h, y);

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
                objParticulas.scene.add(barl);
                objParticulas.scene.add(funt); // agrega a escena
                objParticulas.scene.add(barr);
                objParticulas.scene.add(funb);
            }

            if (objParticulas.json.hasOwnProperty('WtoN')) {

                var desplazamientoW = -0.5;
                objParticulas.play = true; //Si la escena se ha creado correctamente podemos comenzar la animacion
                
                objParticulas.funcionesW = objParticulas.json.WtoN.canal;
                
                var barizqW = objParticulas.funcionesW.LBarrier.value;
                var barderW = objParticulas.funcionesW.RBarrier.value;

                var xRangeW = barderW - barizqW;
                var hW = xRangeW / 1000; //si se requiere mas detalle en las funciones hacer mas pequeño este valor
                var xW = barizqW;
                var materialW = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 300 });//azul
                var mat2W = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 200 });//rojo

                var formaCanalW = new THREE.Shape();

                // definiendo funciones
                var funciontW = objParticulas.funcionesW.TWall.function;//Accedemos a la funcion que se encuentra en el .json
                var tWallW = objParticulas.texttoFunction(funciontW);//Convierte la función extraida del json a una funcion de javascript
                var funcionbW = objParticulas.funcionesW.BWall.function;
                var bWallW = objParticulas.texttoFunction(funcionbW);

                //TWALL es la pared superior del canal
                var tgeometryW = new THREE.BufferGeometry();
                var p0W = tWallW(xW);//evalua la función twall en el punto x = 0
                formaCanalW.moveTo(xW + hW - desplazamientoW, p0W); // punto inicial de la forma del canal
                while (xW < barderW) {
                    var yW = tWallW(xW);
                    pointsW.push(new THREE.Vector3(xW-desplazamientoW, yW, 0));
                    tgeometryW.setFromPoints(pointsW);
                    xW += hW;
                    if (xW <= barderW) { formaCanalW.lineTo(xW-desplazamientoW, yW - hW); }//menos h para que no tape la linea de la frontera
                }
                if (objParticulas.funcionesW.TWall.isReflec) {
                    var funtW = new THREE.Line(tgeometryW, materialW);//azul
                } else {
                    var funtW = new THREE.Line(tgeometryW, mat2W);//rojo
                }

                var yW;
                // Barrera derecha
                yW = tWallW(barderW);
                var rgeometryW = new THREE.BufferGeometry();
                pointsW.push(new THREE.Vector3(barderW-desplazamientoW, yW, 0));
                rgeometryW.setFromPoints(pointsW);
                formaCanalW.lineTo(barderW -desplazamientoW- hW, yW);
                yW = bWallW(barderW);
                pointsW.push(new THREE.Vector3(barderW-desplazamientoW, yW, 0));
                rgeometryW.setFromPoints(pointsW);
                formaCanalW.lineTo(barderW-desplazamientoW - hW, yW);
                if (objParticulas.funcionesW.RBarrier.isReflec) {
                    var barrW = new THREE.Line(rgeometryW, materialW);
                } else {
                    var barrW = new THREE.Line(rgeometryW, mat2W);
                }

                // Barrera abajo
                var bgeometryW = new THREE.BufferGeometry();
                xW = barderW;
                while (xW >= barizqW - hW) {
                    var yW = bWallW(xW);
                    pointsW.push(new THREE.Vector3(xW-desplazamientoW, yW, 0));
                    bgeometryW.setFromPoints(pointsW);
                    xW -= hW;
                    if (xW >= barizqW) { formaCanalW.lineTo(xW-desplazamientoW, yW + 3 * hW); }// mas 3h para que no tape la linea del canal
                }
                if (objParticulas.funcionesW.BWall.isReflec) {
                    var funbW = new THREE.Line(bgeometryW, materialW);
                } else {
                    var funbW = new THREE.Line(bgeometryW, mat2W);
                }

                // Barrera Izquierda
                yW = bWallW(barizqW);
                var lgeometryW = new THREE.BufferGeometry();
                pointsW.push(new THREE.Vector3(barizqW-desplazamientoW, yW, 0));
                lgeometryW.setFromPoints(pointsW);
                formaCanalW.lineTo(barizqW-desplazamientoW + hW, yW);
                yW = tWallW(barizqW);
                pointsW.push(new THREE.Vector3(barizqW-desplazamientoW, yW, 0));
                lgeometryW.setFromPoints(pointsW);
                formaCanalW.lineTo(barizqW -desplazamientoW+ hW, yW);

                if (objParticulas.funcionesW.LBarrier.isReflec) {
                    var barlW = new THREE.Line(lgeometryW, materialW);
                } else {
                    var barlW = new THREE.Line(lgeometryW, mat2W);
                }

                //crea canal y agrega a escena, luego agrega barreras del canal
                var cgeometryW = new THREE.ShapeGeometry(formaCanalW);
                var materialcW = new THREE.MeshBasicMaterial({ color: 0x9B9B9B });
                var canalW = new THREE.Mesh(cgeometryW, materialcW);
                objParticulas.scene.add(canalW);
                objParticulas.scene.add(barrW);
                objParticulas.scene.add(barlW);
                objParticulas.scene.add(funtW); // agrega a escena
                objParticulas.scene.add(funbW);
            }
        }//Fin dibuja canal

        /**
         * Metodo encargado de dibujar cada una de las particulas
         */
        function dibujaParticulas() {
            dibujaCanal();
            var desplazamiento = 1;
            var desplazamientoW = -0.5;

            //Generamos un color pseudoaleatorio
            var color = 1 + objParticulas.numeroParticula * 100;
            //Nos aseguramos que el objeto este vacio
            objParticulas.particulas = {};
            objParticulas.particulasW = {};

            //Si la particula es aislada
            if (objParticulas.aislar) {

                if (objParticulas.json.hasOwnProperty('NtoW')) {
                    //Leemos las propeidades de archivo JSON
                    objParticulas.particulas = objParticulas.json.NtoW.particles.particle[objParticulas.numeroParticula];
                    //Obtenemos solo los pasos de una particula
                    var x = objParticulas.particulas.pasos[0].x;
                    var y = objParticulas.particulas.pasos[0].y;
                    //Creamos las esferas
                    var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                    var aux = color * 111111; //Generamos el color
                    objParticulas.color.push(aux);//Guardamos el color en el arreglo
                    //Asignamos el color a la particula
                    var material = new THREE.MeshBasicMaterial({ color: aux });
                    //Creamos la esfera y le asignamos su tamaño y color
                    var sphere = new THREE.Mesh(p, material);
                    //Asignamos las posiciones para la esfera
                    sphere.position.x = parseFloat(x) - desplazamiento;

                    sphere.position.y = parseFloat(y);
                    //Agregamos la esfera al visualizador         
                    objParticulas.scene.add(sphere);
                    objParticulas.pars.push(sphere);//Se guarda la particula en el arreglo this.pars = [] 
                    //Guardamos las trayectorias de la esfera
                    objParticulas.trays.push([{ "x": x-desplazamiento, "y": y }]);//se guarda pos para las trayectorias
                }

                if (objParticulas.json.hasOwnProperty('WtoN')) {
                    //Leemos las propeidades de archivo JSON
                    objParticulas.particulasW = objParticulas.json.WtoN.particles.particle[objParticulas.numeroParticula];
                    //Obtenemos solo los pasos de una particula
                    var xW = objParticulas.particulasW.pasos[0].x;
                    var yW = objParticulas.particulasW.pasos[0].y;
                    //Creamos las esferas
                    var pW = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                    var auxW = color * 111115; //Generamos el color
                    objParticulas.colorW.push(auxW);//Guardamos el color en el arreglo
                    //Asignamos el color a la particula
                    var materialW = new THREE.MeshBasicMaterial({ color: auxW });
                    //Creamos la esfera y le asignamos su tamaño y color
                    var sphereW = new THREE.Mesh(pW, materialW);
                    //Asignamos las posiciones para la esfera
                    sphereW.position.x = parseFloat(xW) - desplazamientoW;

                    sphereW.position.y = parseFloat(yW);
                    //Agregamos la esfera al visualizador         
                    objParticulas.scene.add(sphereW);
                    objParticulas.parsW.push(sphereW);//Se guarda la particula en el arreglo this.pars = [] 
                    //Guardamos las trayectorias de la esfera
                    objParticulas.traysW.push([{ "x": xW-desplazamientoW, "y": yW }]);//se guarda pos para las trayectorias
                }

            } else { //Si la particula no es aislada

                if (objParticulas.json.hasOwnProperty('NtoW')) {
                    objParticulas.particulas = objParticulas.json.NtoW.particles.particle;//se guarda el arreglo de las particulas del json a la var particulas
                    //dibuja particulas y las coloca en la primer posicion
                    objParticulas.particulas.forEach(function (particula: any) {//para cada particula se realiza
                        var x = particula.pasos[0].x;
                        var y = particula.pasos[0].y;

                        var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                        var aux = color * 111111;

                        objParticulas.color.push(aux);

                        var material = new THREE.MeshBasicMaterial({ color: aux });
                        var sphere = new THREE.Mesh(p, material);

                        sphere.position.x = parseFloat(x)-desplazamiento;//convierte a flota la cadena x del json
                        sphere.position.y = parseFloat(y);
                        objParticulas.scene.add(sphere);
                        objParticulas.pars.push(sphere);
                        objParticulas.trays.push([{ "x": x-desplazamiento, "y": y }]);//se guarda pos para las trayectorias
                        color += 100;
                    });
                }
                
                if (objParticulas.json.hasOwnProperty('WtoN')) {
                    
                    objParticulas.particulasW = objParticulas.json.WtoN.particles.particle;//se guarda el arreglo de las particulas del json a la var particulas
                    objParticulas.particulasW.forEach(function (particulaW: any) {//para cada particula se realiza
                        
                        var xW = particulaW.pasos[0].x;
                        var yW = particulaW.pasos[0].y;
                        var pW = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                        var auxW = color * 111115;

                        objParticulas.colorW.push(auxW);
                        var materialW = new THREE.MeshBasicMaterial({ color: auxW });
                        var sphereW = new THREE.Mesh(pW, materialW);

                        sphereW.position.x = parseFloat(xW)-desplazamientoW;//convierte a flota la cadena x del json
                        sphereW.position.y = parseFloat(yW);
                        objParticulas.scene.add(sphereW);
                        objParticulas.parsW.push(sphereW);
                        objParticulas.traysW.push([{ "x": xW-desplazamientoW, "y": yW }]);//se guarda pos para las trayectorias
                        color += 100;
                    });
                }
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
                objParticulas.pasoW++;
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
        var desplazamiento = 1;
        var desplazamientoW = -0.5;
        //Si la particula NO es aislada
        if (aislar == false) {
            /*********Esto es para NtoW***************************/
            var checkID = "Checkpt1"+this.idVisualizador;

            //Recorremos el arreglo de cada una de las particulas
            for (var i = 0; i < objParticulas.particulas.length; i++) {
                if (objParticulas.paso < objParticulas.particulas[i].pasos.length) {
                    //Guardamos cada posicion
                    var x = parseFloat(objParticulas.particulas[i].pasos[objParticulas.paso].x) - desplazamiento;
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

            /*********Esto es para WtoN***************************/
            //Recorremos el arreglo de cada una de las particulas
            for (var i = 0; i < objParticulas.particulasW.length; i++) {
                if (objParticulas.pasoW < objParticulas.particulasW[i].pasos.length) {
                    //Guardamos cada posicion
                    var xW = parseFloat(objParticulas.particulasW[i].pasos[objParticulas.pasoW].x) - desplazamientoW;
                    var yW = parseFloat(objParticulas.particulasW[i].pasos[objParticulas.pasoW].y);
                    //Metemos cada posicion en el arreglo pars 
                    objParticulas.parsW[i].position.setX(xW);
                    objParticulas.parsW[i].position.setY(yW);
                    //Guardamos en el arreglo trays cada uno de los puntos
                    objParticulas.traysW[i].push({ "x": xW, "y": yW });
                }
            }
            var checkbox = document.getElementById(checkID);

            //Si Trayectoria esta marcado, se mostraran las traqyectorias de las particulas
            if (checkbox) {
                objParticulas.muestraTray(checkbox, aislar);
            }

        } else {//La particula es aislada, repetimos el procedimiento anterior pero solo para una particula
            
            /*********Esto es para NtoW***************************/
            if (objParticulas.paso < objParticulas.particulas.pasos.length) {
                var x = parseFloat(objParticulas.particulas.pasos[objParticulas.paso].x) - desplazamiento;
                var y = parseFloat(objParticulas.particulas.pasos[objParticulas.paso].y);
                objParticulas.pars[0].position.setX(x);
                objParticulas.pars[0].position.setY(y);
                objParticulas.trays[0].push({ "x": x, "y": y });
            }
            var checkID = "Checkpt1"+this.idVisualizador;
            
            /*********Esto es para WtoN***************************/
            if (objParticulas.pasoW < objParticulas.particulasW.pasos.length) {
                var xW = parseFloat(objParticulas.particulasW.pasos[objParticulas.paso].x) - desplazamientoW;
                var yW = parseFloat(objParticulas.particulasW.pasos[objParticulas.paso].y);
                objParticulas.parsW[0].position.setX(xW);
                objParticulas.parsW[0].position.setY(yW);
                objParticulas.traysW[0].push({ "x": xW, "y": yW });
            }

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
        /***********************Esto es para NtoW*******************************/
        var mySelf = this;
        this.trayso.forEach(function(tray:any){
            mySelf.scene.remove(tray);
        });
        this.trayso = [];
        var vertices = [];//Puntos que seran unidos para generar la linea de la trayectoria

        let xP = 1000;//Punto en el que la particula cambiara de color su trayectoria
        
        if (checkbox.checked == true) {//Posiciones de cada particula
            for (var i = 0; i < this.trays.length; i++) {
                
                if(this.trays.length == 1) {
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
                    var material = new THREE.LineBasicMaterial({ color: this.color[i] });
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
        /***********************Esto es para WtoN*******************************/
        this.traysoW.forEach(function(trayW:any){
            mySelf.scene.remove(trayW);
        });
        this.traysoW = [];
        var verticesW = [];//Puntos que seran unidos para generar la linea de la trayectoria

        let xPW = 1000;//Punto en el que la particula cambiara de color su trayectoria
        
        if (checkbox.checked == true) {//Posiciones de cada particula
            for (var i = 0; i < this.traysW.length; i++) {
                
                if(this.traysW.length == 1) {
                    var geometryW = new THREE.BufferGeometry();
                    
                    var colorLineaW = [];
                    for (var j = 0; j < this.traysW[i].length; j++) {
                        var xW = this.traysW[i][j].x;
                        var yW = this.traysW[i][j].y;
                        verticesW.push(xW, yW, 0);
                        if (j < xPW) {
                            // Color de la linea: Rojo
                            colorLineaW.push(255, 0, 0);
                        } else {
                            // Color de la linea: Blanco
                            colorLineaW.push(51, 255, 85);
                        }
                    }
                    //Pasamos las posiciones
                    var arrayVerticesW = new Float32Array(verticesW);
                    geometryW.setAttribute('position',new THREE.BufferAttribute(arrayVerticesW,3));
                    // Pasamos el color
                    var arrayColorsW = new Float32Array(colorLineaW);
                    geometryW.setAttribute('color',new THREE.BufferAttribute(arrayColorsW,3));

                    var materialW = new THREE.LineBasicMaterial({color: 0xffffff,vertexColors: true});
                    var trayW = new THREE.Line(geometryW, materialW);
                    this.scene.add(trayW);

                } else { //Si la particula no esta aislada
                    var pointsW = [];
                    var geometryW = new THREE.BufferGeometry();
                    var materialW = new THREE.LineBasicMaterial({ color: this.colorW[i] });
                    for (var j = 0; j < this.traysW[i].length; j++) {
                        var xW = this.traysW[i][j].x;
                        var yW = this.traysW[i][j].y;
                        pointsW.push(new THREE.Vector3(xW, yW, 0));
                        geometryW.setFromPoints(pointsW);
                    }
                    var trayW = new THREE.Line(geometryW, materialW);
                    this.scene.add(trayW);
                    this.traysoW.push(trayW);
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
                            "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+ mySelf.idVisualizador + "'></div>" +
                        "</div>";

        //Obteniendo los valores de los tiempos para NtoW
        var TauNW= mySelf.json.NtoW.tiempos[0].valor.toFixed(2);
        var LoopNW= mySelf.json.NtoW.tiempos[1].valor.toFixed(2);
        var DirectNW= mySelf.json.NtoW.tiempos[2].valor.toFixed(2);
 
        //Obteniendo los valores de los tiempos para NtoW
        var TauWN= mySelf.json.WtoN.tiempos[0].valor.toFixed(2);
        var LoopWN= mySelf.json.WtoN.tiempos[1].valor.toFixed(2);
        var DirectWN= mySelf.json.WtoN.tiempos[2].valor.toFixed(2);
 
        //Obteniendo los valores de los golpes para NtoW
        var SuperiorNW= mySelf.json.NtoW.golpes[0].valor.toFixed(2);
        var InferiorNW= mySelf.json.NtoW.golpes[1].valor.toFixed(2);
        var OrigenNW= mySelf.json.NtoW.golpes[2].valor.toFixed(2);
 
        //Obteniendo los valores de los golpes para NtoW
        var SuperiorWN= mySelf.json.WtoN.golpes[0].valor.toFixed(2);
        var InferiorWN= mySelf.json.WtoN.golpes[1].valor.toFixed(2);
        var OrigenWN= mySelf.json.WtoN.golpes[2].valor.toFixed(2);
 
        //Total numeroParticulas
        var TotalParticulasNW= mySelf.json.NtoW.particles.total;
        var TotalParticulasWN= mySelf.json.WtoN.particles.total;

        $('.menu__default').after(contenedor);
        
        var item = 
            "<div id = 'particulasMenu"+mySelf.idVisualizador + "' class='particulasMenuPrincipal'>" +
                "<h3 class='align-text-top section__subtitle' id='tituloPrincipal'><span>Menu Particulas</span></h3>"+
                "<ul class='nav flex-column'>" +
                    "<li class='nav-item'>" +
                        "<div class='form-check'>" +
                            "<button  type='button' class='btn btn-primary' id='regresar" +mySelf.idVisualizador+ "'> <i class='bx bx-chevrons-left'></i> </button>"+
                            "<button  type='button' class='btn btn-primary' id='pausa" +mySelf.idVisualizador+ "'> <i id='iconBtn' class='bx bx-pause'></i> </button>"+
                            "<button  type='button' class='btn btn-primary' id='avanzar" +mySelf.idVisualizador+ "'> <i class='bx bx-chevrons-right'></i> </button>"+
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
                            "<input type='number' min='0' max='"+TotalParticulasNW+"' size='2' id='particula' placeholder='IDparticula' style='width:115px;'>" +
                            "<button class='btn-aceptar' type='submit' id='aceptar'>Aceptar</button>" + 
                        "</div>" +
                    "</li>" +
        
                    "<li class='nav-item resultados'  id='Resultado" +mySelf.idVisualizador+ "'>" +
                        "<div class='result' id='tabla-centrar'>"+ 
                            "<h4 class='subtitulo_particulas'>Resultados</h4>"+
                            "<table class='tabs' data-min='0' data-max='2' style='margin:0 auto;'>"+
                                "<tr>"+
                                    "<th class='tabcks'>&nbsp;</th>"+
                                    "<th class='tabck' id='tabck-0'>Tiempos</th>"+
                                    "<th class='tabcks'>&nbsp;</th>"+
                                    "<th class='tabck' id='tabck-1'>Golpes</th>"+
                                "</tr>"+
                                "<tr class='filadiv'>"+
                                    "<td  class='cont'colspan='6' id='tab-0'>"+
                                    "<div class='tabdiv' id='tabdiv-0' style='display: block;''>"+
                                        "<table class='resul'>"+
                                            "<tr class='resul'>"+
                                                "<th class='resul'></th>"+
                                                "<th class='resul'>NtoW</th>"+
                                                "<th class='resul'>WtoN</th>"+
                                            "</tr>"+
                                            "<tr class='resul'>"+
                                                "<td class='resul'>Tau</td>"+
                                                "<td class='resul'><input type='text' id='TauNW' name='fname' readonly size='5' value='"+TauNW+"'><br></td>"+
                                                "<td class='resul'><input type='text' id='TauWN' name='fname' readonly size='5' value='"+TauWN+"'><br></td>"+
                                            "</tr>"+
                                            "<tr class='resul'>"+
                                                "<td class='resul'>Direct</td>"+
                                                "<td class='resul'><input type='text' id='direcTimeNW'  readonly size='5' value='"+DirectNW+"'><br></td>"+
                                                "<td class='resul'><input type='text' id='direcTimeWN'  readonly size='5' value='"+DirectWN+"'><br></td>"+
                                            "</tr>"+
                                            "<tr class='resul'>"+
                                                "<td class='resul'>Looping</td>"+
                                                "<td class='resul'><input type='text' id='LoopingTimeNW'  readonly size='5' value='"+LoopNW+"'><br></td>"+
                                                "<td class='resul'><input type='text' id='LoopingTimeWN'  readonly size='5' value='"+LoopWN+"'><br></td>"+
                                            "</tr>"+
                                        "</table>"+
                                    "</div>"+
                                    "<div class='tabdiv' id='tabdiv-1'>"+
                                        "<table class='resul'>"+
                                            "<tr class='resul'>"+
                                                "<th class='resul'></th>"+
                                                "<th class='resul'>NtoW</th>"+
                                                "<th class='resul'>WtoN</th>"+
                                            "</tr>"+
                                            "<tr class='resul'>"+
                                                "<td class='resul'>Superior</td>"+
                                                "<td class='resul'><input type='text' id='SuperiorNW' name='fname' readonly size='5' value='"+SuperiorNW+"'><br></td>"+
                                                "<td class='resul'><input type='text' id='SuperiorWN' name='fname' readonly size='5' value='"+SuperiorWN+"'><br></td>"+
                                            "</tr>"+
                                            "<tr class='resul'>"+
                                                "<td class='resul'>Inferior</td>"+
                                                "<td class='resul'><input type='text' id='InferiorNW'  readonly size='5' value='"+InferiorNW+"'><br></td>"+
                                                "<td class='resul'><input type='text' id='InferiorWN'  readonly size='5' value='"+InferiorWN+"'><br></td>"+
                                            "</tr>"+
                                            "<tr class='resul'>"+
                                                "<td class='resul'>Origen</td>"+
                                                "<td class='resul'><input type='text' id='OrigenNW'  readonly size='5' value='"+OrigenNW+"'><br></td>"+
                                                "<td class='resul'><input type='text' id='OrigenWN'  readonly size='5' value='"+OrigenWN+"'><br></td>"+
                                            "</tr>"+
                                        "</table>"+
                                    "</div>"+
                                "</tr>"+
                            "</table>"+
                            "<button  type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModalCenter' id='btngrafica" +mySelf.idVisualizador+ "'>Generar grafica</button>" +
                        "</div>"+
                    "</li>" +
                "</ul>" + 
            "</div>";//+
            //"<script>" + "activarTab(document.getElementById('tabck-0'));" + "</script>" ;
        //boton
        $("#menu" + mySelf.idVisualizador).append(item);
        $("#menu" + mySelf.idVisualizador).css({ "visibility": "visible", "height": "600px", "width": "250", "display":"inline" })
        
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
                });
                $('#bt-char2').click(function() {
                    $('#chart-2').css("display","block");
                    $('#chart-1').css("display","none");
                    chart2.render();
                });
                
                //Arreglos para almacenar el valor de los tiempos (Tau,Direct,Looping)
                var TiemposNW= []; 
                var TiemposWN=[];
                //Arreglos para almacenar el valor de los golpes (Superior, inferior y origen)
                var GolpesNW=[];
                var GolpesWN=[];

                for (var index = 0; index < this.json.NtoW.golpes.length; index++) {
                    GolpesNW.push({ "y": this.json.NtoW.golpes[index].valor, "label": this.json.NtoW.golpes[index].nomPared});
                    GolpesWN.push({ "y": this.json.WtoN.golpes[index].valor, "label": this.json.WtoN.golpes[index].nomPared});
                }
                
                for (var index = 0; index < this.json.NtoW.tiempos.length; index++) {
                    TiemposNW.push({ "y": this.json.NtoW.tiempos[index].valor, "label": this.json.NtoW.tiempos[index].time});
                    TiemposWN.push({ "y": this.json.WtoN.tiempos[index].valor, "label": this.json.WtoN.tiempos[index].time});
                }

                var div1 = document.getElementById('chart-1');
                let chart = new CanvasJS.Chart(div1, {
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light2",
                    title: {
                        text: "Tiempos"
                    },
                    axisY:{
                        includeZero:true
                    },
                    legend:{
                        cursor: "pointer",
                        verticalAlign: "center",
                        horizontalAlign: "right",
                        itemclick: toggleDataSeriesTiempos
                    },
                    data: [
                        {
                            type: "column",
                            name: "NtoW",
                            indexLabel: "{y}",
                            yValueFormatString: "#0.##",
                            showInLegend: true,
                            dataPoints: TiemposNW
                        },{
                            type: "column",
                            name: "WtoN",
                            indexLabel: "{y}",
                            yValueFormatString: "#0.##",
                            showInLegend: true,
                            dataPoints: TiemposWN
                        }
                    ]
                });
                chart.render();

                var div2 = document.getElementById('chart-2');
                let chart2 = new CanvasJS.Chart(div2, {
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light2",
                    title: {
                        text: "Golpes"
                    },
                    axisY:{
                        inludeZero:true,
                    },
                    legend:{
                        cursor: "pointer",
                        verticalAlign: "center",
                        horizontalAlign: "right",
                        itemclick: toggleDataSeriesGolpes
                    },
                    data: [
                        {
                            type: "column",
                            name: "NtoW",
                            indexLabel: "{y}",
                            yValueFormatString: "#0.##",
                            showInLegend: true,
                            dataPoints: GolpesNW
                        },{
                            type: "column",
                            name: "WN",
                            indexLabel: "{y}",
                            yValueFormatString: "#0.##",
                            showInLegend: true,
                            dataPoints: GolpesWN
                        }
                    ]
                });

                function toggleDataSeriesTiempos(e:any){
                    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                      e.dataSeries.visible = false;
                    }
                    else{
                      e.dataSeries.visible = true;
                    }
                    chart.render();
                }
                
                function toggleDataSeriesGolpes(e:any){
                    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                      e.dataSeries.visible = false;
                    }
                    else{
                      e.dataSeries.visible = true;
                    }
                    chart2.render();
                }
            }),
            $('#tabck-0').click(() =>{
                try {
                    //Los elementos div de todas las pestañas están todos juntos en una
                    //única celda de la segunda fila de la tabla de estructura de pestañas.
                    //Hemos de buscar la seleccionada, ponerle display block y al resto
                    //ponerle display none.
                    var unTab:any = document.getElementById('tabck-0');
                    var id:any = unTab.id;
                    if (id){
                        var tr = unTab.parentNode || unTab.parentElement;
                        var tbody = tr.parentNode || tr.parentElement;
                        var table = tbody.parentNode || tbody.parentElement;
                        //Pestañas en varias filas
                        if (table.getAttribute("data-filas")!=null){
                            var filas = tbody.getElementsByTagName("tr");
                            var filaDiv = filas[filas.length-1];
                            tbody.insertBefore(tr, filaDiv);
                        }
                        //Para compatibilizar con la versión anterior, si la tabla no tiene los
                        //atributos data-min y data-max le ponemos los valores que tenían antes del
                        //cambio de versión.
                        var desde = table.getAttribute("data-min");
                        if (desde==null) desde = 0;
                        var hasta = table.getAttribute("data-max");
                        if (hasta==null) hasta = 2;
                        var idTab = id.split("tabck-");
                        var numTab = parseInt(idTab[1]);
                        //Las "tabdiv" son los bloques interiores mientras que los "tabck"
                        //son las pestañas.
                        var esteTabDiv:any = document.getElementById("tabdiv-" + numTab);
                        for (var i=desde; i<=hasta; i++) {
                            var tabdiv = document.getElementById("tabdiv-" + i);
                            if (tabdiv) {
                                var tabck:any = document.getElementById("tabck-" + i);
                                if (tabdiv.id == esteTabDiv.id) {
                                    tabdiv.style.display = "block";
                                    tabck.style.color = "green";
                                    tabck.style.backgroundColor = "rgb(235, 235, 225)";
                                    tabck.style.borderBottomColor = "rgb(235, 235, 225)";
                                } else {
                                    tabdiv.style.display = "none";
                                    tabck.style.color = "green";
                                    tabck.style.backgroundColor = "lightgray";
                                    tabck.style.borderBottomColor = "lightgray";
                                }
                            }
                        }
                    }
                } catch (e:any) {
                    alert("Error al activar una pestaña. " + e.message);
                }
            }),
            $('#tabck-1').click(() =>{
                try {
                    //Los elementos div de todas las pestañas están todos juntos en una
                    //única celda de la segunda fila de la tabla de estructura de pestañas.
                    //Hemos de buscar la seleccionada, ponerle display block y al resto
                    //ponerle display none.
                    var unTab:any = document.getElementById('tabck-1');
                    var id:any = unTab.id;
                    if (id){
                        var tr = unTab.parentNode || unTab.parentElement;
                        var tbody = tr.parentNode || tr.parentElement;
                        var table = tbody.parentNode || tbody.parentElement;
                        //Pestañas en varias filas
                        if (table.getAttribute("data-filas")!=null){
                            var filas = tbody.getElementsByTagName("tr");
                            var filaDiv = filas[filas.length-1];
                            tbody.insertBefore(tr, filaDiv);
                        }
                        //Para compatibilizar con la versión anterior, si la tabla no tiene los
                        //atributos data-min y data-max le ponemos los valores que tenían antes del
                        //cambio de versión.
                        var desde = table.getAttribute("data-min");
                        if (desde==null) desde = 0;
                        var hasta = table.getAttribute("data-max");
                        if (hasta==null) hasta = 2;
                        var idTab = id.split("tabck-");
                        var numTab = parseInt(idTab[1]);
                        //Las "tabdiv" son los bloques interiores mientras que los "tabck"
                        //son las pestañas.
                        var esteTabDiv:any = document.getElementById("tabdiv-" + numTab);
                        for (var i=desde; i<=hasta; i++) {
                            var tabdiv = document.getElementById("tabdiv-" + i);
                            if (tabdiv) {
                                var tabck:any = document.getElementById("tabck-" + i);
                                if (tabdiv.id == esteTabDiv.id) {
                                    tabdiv.style.display = "block";
                                    tabck.style.color = "green";
                                    tabck.style.backgroundColor = "rgb(235, 235, 225)";
                                    tabck.style.borderBottomColor = "rgb(235, 235, 225)";
                                } else {
                                    tabdiv.style.display = "none";
                                    tabck.style.color = "green";
                                    tabck.style.backgroundColor = "lightgray";
                                    tabck.style.borderBottomColor = "lightgray";
                                }
                            }
                        }
                    }
                } catch (e:any) {
                    alert("Error al activar una pestaña. " + e.message);
                }
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
                                "<button class='btn btn-titulo' disabled> <span>Particula " + particula + "</span> </button>" +
                            "</div>" +
                        "</div>";       
        //Creamos las variebles para el nuevo canvas
        var canvas2:any = document.createElement('canvas');
        canvas2.id = "canvas"+particula;
        canvas2.class = "bg-light border";
        canvas2.style = "width: 100vh";
        //Se crea el objeto en es te caso de tipo Particula
        var object:any = new ParticulasDosCanales(this.json, canvas2);
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

        //Con ayuda de Jquery capturamos el evento cuando el usuario desee elminar el visualizador del navegador
        $('#quitar'+ particula ).click(function():any{
            var respuesta = confirm("Desea eliminar el visualizador de particula #" + particula);
            if( respuesta ) {//Si se recibe una respuesta
                object = {};
                $('#particula'+ particula ).remove();
                $('#canvas'+particula).remove();
                $('#visualizador'+particula).remove();//descomentar si se usa mostrarMenuIndividual
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
                            "<button  type='button' class='btn btn-primary ' id = 'pausa" + numParticula + "'> <i id='iconBtnAislado" + numParticula + "' class='bx bx-pause'></i> </button>"+
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
                    $('#iconBtnAislado'+ numParticula).removeClass("bx-play");
                    $('#iconBtnAislado'+ numParticula).addClass("bx-pause");
                    pausaAnimacionAislada = false;
                }else{
                    $('#iconBtnAislado'+ numParticula).removeClass("bx-pause");
                    $('#iconBtnAislado'+ numParticula).addClass("bx-play");
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
                    mySelf.muestraTray(check, object.aislar);
                }
            })
        );
    }
    
    texttoFunction(funcion: any) {
        return Parser.parse(funcion).toJSFunction(['x']);
    }
}