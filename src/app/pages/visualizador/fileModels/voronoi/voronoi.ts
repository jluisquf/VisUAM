import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// BUG: Manda que no existe el material 'color', pero solo hace por unos
// segundos, después deja de mandar warnings
// Interface que implementan todos los modelos
import { FileModelInterface } from '../file-model-interface';
import { Router } from '@angular/router';

// jQuery
declare var $:any;


export class Voronoi implements FileModelInterface{
    // El diagrama debería rotar automáticamente?
    private isAutoRotating : boolean = false;
    private dimension : number = 0;

    // Cambiar scope
    mySelf = this;

    // Detectar el id del canvas donde está el Visualizador
    dateId = new Date();
    idVisualizador = this.dateId.getTime();
    id = this.dateId.getTime();

    // El gran, tremendo, inmaculado, semental y poderosísimo constructor
    constructor(public json:any, public canvas:any){
        this.json = json;
        this.canvas = canvas;
    }

    // Lista de elementos
    puntosRed: any[] = [];
    // Lista de colores
    colors: any = {};
    
    // Color de fondo de la visualización
    backgroundColor = new THREE.Color( 0xD3D3D3 );

    // Crear escena y cámara
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    // Crear el canvas
    public renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    // El diagrama se mueve respecto al centro del cubo
    controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Middleware para saber si los puntos son en 3d o 2d
    draw(json: any, c: any){
        // Dimensión que indica el archivo
        this.dimension = json.d;
        // Leemos un punto
        var punto = json.p[0];

        // Si el punto tiene la coordenada z o tiene la dimensión 3 indicada en
        // el archivo entonces pintar un cubo 3D
        if (punto.z !== undefined || this.dimension == 3) {
            this.draw3d(json, c);
        // En el caso contrario pintar un plano
        } else if (this.dimension == 2) {
            this.draw2d(json, c);
        } else {
            alert("Necesita indicar la dimensión con el campo 'd'");
            window.location.reload();
        }
    }

    // Dibujar los puntos dados en el JSON
    draw3d(json: any, c: any): void {

        var mySelf = this;
        // Obtenemos los puntos del json
        // p: {x: 0, y: 0, z: 0, sb: 502}
        var puntos = json.p;

        // Cambiar color de fondo de la escena
        this.scene.background = this.backgroundColor;

        // Posición inicial de la cámara
        this.camera.position.set(350,350,350);

        // Aplicamos la propidad para auto rotar
        this.controls.autoRotate = this.isAutoRotating;

        // Lista de las posiciones de los puntos
        var posiciones: any = {};
        // Lista de los grupos dados por el campo p.sb
        var cs: any[] = [];
        // Máximas coordenadas, se actualizan dependiendo los datos
        var mx = -10000, my = -10000, mz = -10000;
        
        // Recorremos todos los puntos
        puntos.forEach(function (punto:any) {
            // Convertimos las coordenadas a enteros
            var px = parseInt(punto.x);
            var py = parseInt(punto.y);
            var pz = parseInt(punto.z);

            // Los puntos se agrupan con esta propiedad
            var sb = '' + punto.sb

            // Guardamos las sb para saber los grupos que tenemos
            if (!cs.includes(sb)){
                cs.push(sb);
            }

            // Agregamos la posición al diccionario de coordenadas con su grupo
            if (!posiciones[sb]){
                posiciones[sb] = new Array(px, py, pz);
            }else{
                posiciones[sb].push(px, py, pz);
            }

            // Actualizamos las coordenadas máximas
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;

        }); // FIN puntos.forEach()

        // Esto debe cambiar debido al cambio a BufferGeometry
        cs.forEach((csColor) => {
            // Geometría que va contener todos los puntos con el mismo grupo
            var geometry = new THREE.BufferGeometry();

            // NOTE: LUIS: Por alguna razón el render seleccionado no acepta enteros
            // así que los convierto en flotantes
            var positions = Float32Array.from(posiciones[csColor]);

            // Le mandamos al BufferGeometry las coordenadas de los puntos
            // El objeto creado automáticamente convierte un Array en puntos de 3
            // coordenadas
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            // Creamos el color del area
            var pointColor = new THREE.Color( csColor * 111111);

            // Creamos un material para los puntos
            // TODO: El tamaño de los puntos lo puse a proposito para que se vea
            // bien, tal vez sea necesario que sea especificado desde el JSON
            var material = new THREE.PointsMaterial( { size: 2, color: pointColor } );

            // NOTE: LUIS: Si algún día surge un problema puede ser por esta función
            // geometry.computeBoundingSphere();
            
            // Creamos todos los puntos y los agregamos a la escena
            var points = new THREE.Points( geometry, material );
            mySelf.scene.add(points);

            // TODO:
            mySelf.puntosRed.push(points);
        }); // FIN cs.forEach()

        function resizeCanvasToDisplaySize() {
            const canvas = mySelf.renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            if (canvas.width !== width || canvas.height !== height) {
                mySelf.renderer.setSize(width, height, false);
                mySelf.camera.aspect = width / height;
                mySelf.camera.updateProjectionMatrix();
            }
        }

        function animate() {
            requestAnimationFrame( animate );
            resizeCanvasToDisplaySize()
            mySelf.controls.update();
            mySelf.renderer.render(mySelf.scene, mySelf.camera);
        }

        // Calcular el centro del cubo para la rotación
        var centro = new THREE.Vector3();
        centro.x = mx / 2;
        centro.y = my / 2;
        centro.z = mz / 2;
        mySelf.controls.target = centro;

        // Zoom máximo y mínimo
        mySelf.controls.minDistance = centro.length();
        mySelf.controls.maxDistance = 1000;

        animate();
    } // Fin draw(json: any, c: any)

    // Dibujar los puntos dados en el JSON en 2 Dimensiones
    draw2d(json: any, c: any): void {
        var mySelf = this;
        // Obtenemos los puntos del json
        // p: {x: 0, y: 0, sb: 502}
        var puntos = json.p;

        // Backgorund del fondo
        this.scene.background = this.backgroundColor;

        // Posición inicial de la cámara
        this.camera.position.set(0, 0, 350);

        // Aplicamos la propidad para auto rotar
        this.controls.autoRotate = this.isAutoRotating;

        // Lista de las posiciones de los puntos
        var posiciones: any = {};
        // Lista de los grupos dados por el campo p.sb
        var cs: any[] = [];
        // Máximas coordenadas, se actualizan dependiendo los datos
        var mx = -10000, my = -10000, mz = -10000;
        
        // Recorremos todos los puntos
        // TODO: optimizar esto usando un for simple y también quitando el if
        puntos.forEach(function (punto:any) {
            // Convertimos las coordenadas a enteros
            var px = parseInt(punto.x);
            var py = parseInt(punto.y);
            var pz = 0;

            // Los puntos se agrupan con esta propiedad
            var sb = '' + punto.sb

            // Guardamos las sb para saber los grupos que tenemos
            // TODO: quitar este if y mejor crear la lista y agregar el primer elemento afuera del for
            if (!cs.includes(sb)){
                cs.push(sb);
            }

            // Agregamos la posición al diccionario de coordenadas con su grupo
            if (!posiciones[sb]){
                posiciones[sb] = new Array(px, py, pz);
            }else{
                posiciones[sb].push(px, py, pz);
            }

            // Actualizamos las coordenadas máximas
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;

        }); // FIN puntos.forEach()

        // Esto debe cambiar debido al cambio a BufferGeometry
        cs.forEach((csColor) => {
            // Geometría que va contener todos los puntos con el mismo grupo
            var geometry = new THREE.BufferGeometry();

            // NOTE: LUIS: Por alguna razón el render seleccionado no acepta enteros
            // así que los convierto en flotantes
            var positions = Float32Array.from(posiciones[csColor]);

            // Le mandamos al BufferGeometry las coordenadas de los puntos
            // El objeto creado automáticamente convierte un Array en puntos de 3
            // coordenadas
            geometry.setAttribute('position',
                                  new THREE.Float32BufferAttribute(positions, 3));

            // Creamos el color del area
            var pointColor = new THREE.Color( csColor * 111111);

            // Creamos un material para los puntos
            // TODO: El tamaño de los puntos lo puse a proposito para que se vea
            // bien, tal vez sea necesario que sea especificado desde el JSON
            var material = new THREE.PointsMaterial( { size: 1.5, color: pointColor } );

            // NOTE: LUIS: Si algún día surge un problema puede ser por esta función
            // geometry.computeBoundingSphere();
            
            // Creamos todos los puntos y los agregamos a la escena
            var points = new THREE.Points( geometry, material );
            mySelf.scene.add(points);

            // TODO:
            mySelf.puntosRed.push(points);
        }); // FIN cs.forEach()

        function resizeCanvasToDisplaySize() {
            const canvas = mySelf.renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            if (canvas.width !== width || canvas.height !== height) {
                mySelf.renderer.setSize(width, height, false);
                mySelf.camera.aspect = width / height;
                mySelf.camera.updateProjectionMatrix();
            }
        }

        function animate() {
            requestAnimationFrame( animate );
            resizeCanvasToDisplaySize()
            mySelf.controls.update();
            mySelf.renderer.render(mySelf.scene, mySelf.camera);
        }

        // Calcular el centro del cubo para la posición de la cámara
        var centro = new THREE.Vector3();
        centro.x = mx / 2;
        centro.y = my / 2;
        centro.z = 0;
        mySelf.controls.target = centro;

        // Cambia los botones para que en lugar de rotar se mueva la cámara
        mySelf.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }

        this.camera.position.set(centro.x, centro.y, mx);

        // Zoom máximo y mínimo
        mySelf.controls.minDistance = centro.length() / 2;
        mySelf.controls.maxDistance = 1000;

        animate();
    } // Fin draw2d(json: any, c: any)

    // Función para crear el menú y sus respectivos eventos
    mostrarMenu(idVisualizador:any):void {
        /*var vdate:any = new Date();
        var id:any = vdate.getTime();*/

        // Cambiar scope
        var mySelf = this;
        // ID del canvas del visualizador
        mySelf.id = idVisualizador;

        // JSON enviado
        var objVoronoi = this.json;

        // Contenedor del menú y el visualizador
        var contenedor= "<div class='row' id='visualizador"+ mySelf.id +"'"+">"+
                        " <div class='container col-sm-10' id='"+ mySelf.id +"'"+"></div> " +
                         "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+ mySelf.id +"'"+"></div>" +
                         "</div>";

        $('.menu__default').after(contenedor);

        var item = "<div id = 'particulasMenu'" + "class='particulasMenu' >" +
        "<h3 class='align-text-top section__subtitle' id='titulo'><span>Voronoi Menu</span></h3>" +
            "<div id = 'particulasMenu' class='particulasMenu' >" + 
           " <ul class='nav flex-column' id='vor'>"+
              "<li class='nav-item'>"+
                "<div class='form-check'>"+
                  "<input type='checkbox' class='form-check-input' id='checkAzul'>"+
                  "<label class='form-check-label' for='checkAzul'><span></span></label>" +
                  "<span> Blue Color </span>" +
                "</div>"+
              "</li>"+

             "<li class='nav-item'>"+
               "<div class='form-check'>"+
                 "<input type='checkbox' class='form-check-input' id='checkGris' >"+
                 "<label class='form-check-label' for='checkGris'><span></span></label>" +
                 "<span> Gray Color </span>" +
               "</div>"+
             "</li>"

        if (this.dimension == 3) item = item +
             "<li class='nav-item'>"+
               "<div class='form-check'>"+
                 "<input type='checkbox' class='form-check-input' id='autoRotar'>"+
                 "<label class='form-check-label' for='autoRotar'><span></span></label>" +
                 "<span> Auto Rotate </span>" +
               "</div>"+
             "</li>"

        item = item + "</ul>"+ "</div>"

        $('#menu'+mySelf.id).append(item);
        $('#menu'+mySelf.id).css({ "visibility": "visible", "width": "250" })
        /******************************************************************************** */

        //EvenListeners: Se usa Jquery para capturar los eventos
        $('document').ready(
            // Al seleccionar el checkBox llamado Azul se pintara el diagrama de color azul
            $('#checkAzul').change(function(){
                var check:any = document.getElementById('checkAzul');
                if(check.checked) {
                    $('#checkGris').prop("checked",false);
                    mySelf.setColor(!check,0,0,0); // Esto funciona por alguna razón 
                    mySelf.setBlue(0,0,1);
                }else{
                    mySelf.setColor(check,0,0,0);
                }
            }),
            // Al seleccionar el checkBox llamado Gris se pintara el diagrama de color gris
            $('#checkGris').change(function(){
                var check:any = document.getElementById('checkGris');
                if(check.checked) {
                    $('#checkAzul').prop("checked",false);
                    mySelf.setColor(!check,0,0,0); // Esto funciona por alguna razón
                    mySelf.setGris(1,1,1);
                }else{
                    mySelf.setColor(check,0,0,0);
                }
            }),
            // Al seleccionar el checkBox llamado Rotar el diagrama comenzará a girar
            $('#autoRotar').change(function(){
                var check:any = document.getElementById('autoRotar');
                // BUG: Posible bug
                mySelf.autoRotar(check);
                // if(check.checked) {
                // }else{
                //     mySelf.autoRotar(check);
                // }
            })
        );
    }// FIN mostrarMenu()

    /*
     * Recibe el checkbox que activo el evento y el RGB del color que se quiere
     * la escala con el checkbox se determina la funcion que hara, si esta
     * marcado cambia la escala al color del RGB recibo, si esta desmarcado
     * regresa a su color original
    */
    setColor(checkbox:any, r:any, g:any, b:any):void {
        var mySelf = this;
        var coloraux, coloraux2, caux;

        if (checkbox.checked == true) {     
            mySelf.puntosRed.forEach(function (punto:any) {
                coloraux = punto.material.color;
                // console.log(coloraux);//########################
                coloraux2 = coloraux.getHex();
                // console.log(coloraux2);//########################
                caux = coloraux.r + coloraux.g + coloraux.b;
                // console.log(caux);//########################
                coloraux.r = r / caux;
                coloraux.g = g / caux;
                coloraux.b = b / caux;
                punto.material.setValues({color: coloraux});
                mySelf.colors[coloraux.getHex()] = coloraux2;
            });
        } else {
            mySelf.puntosRed.forEach(function (punto:any) {
                coloraux = punto.material.color;
                caux = mySelf.colors[coloraux.getHex()];              
                punto.material.setValues({ color: caux });

            });
            mySelf.colors = {};
        }
    } // FIN setColor()

    /*
     * Recibe desde index.html el RGB del color a convertir en este caso gris y
     * se lo pasa a setColor junto al checkbox que invocó esta función
    */
    // Igual que setGris pero para azul
    setBlue(r:any, g:any, b:any):void {
        var checkbox = document.getElementById("checkAzul");            
        this.setColor(checkbox, r, g, b);
    } 

    setGris(r:any, g:any, b:any):void {
        var checkbox = document.getElementById("checkGris");    
        this.setColor(checkbox, r, g, b);
    }

    autoRotar(checkbox:any):void {
        var mySelf = this;
        if (checkbox.checked == true) {
            // auto rotate
            mySelf.controls.autoRotate = true;
            mySelf.controls.autoRotateSpeed = 5;
        } else {
            mySelf.controls.autoRotate = false;
        }
    }
}

// FIXED: BUG: Cuando pasas de Azul a Gris sin desactivar el anterior los colores se
// acumulan.