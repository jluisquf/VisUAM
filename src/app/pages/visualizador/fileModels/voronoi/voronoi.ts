import { FileModelInterface } from '../file-model-interface';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

declare var $:any;

export class Voronoi implements FileModelInterface{

    mySelf = this;
    colors:any = {};//colores (hexa)
    puntosred:any = [];//puntos (objetos)
    

    vdate = new Date();
    id = this.vdate.getTime();

    constructor(public json:any, public canvas:any){}

    // Se crea la escena sobre la que se pintaran las particulas, ademas de la camara
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    controls = new OrbitControls(this.camera, this.renderer.domElement);

    draw(json: any, c: any): void {
        
        var mySelf = this;
        //var puntosred = [];

        var puntos = json.p;
        /**funcion llamada desde index.js recibe un arreglo con las posiciones y color de cada punto
        se crean en conjunto de cada color y se agregan a escena**/
        mySelf.scene.background = new THREE.Color( 0xffffff );
        mySelf.camera.position.set(0, 0, 1);
        mySelf.controls.maxDistance = 500;
        mySelf.controls.maxDistance = 1000;
        var group = new THREE.Group();
        mySelf.scene.add(group);

        //especifica las figuras y su material
        var colores: any = {};
        var cs: any = [];
        var mx = -10000, my = -10000, mz = -10000;
        puntos.forEach(function (punto: any) {
            var points = [];
            var px = parseInt(punto.x);
            var py = parseInt(punto.y);
            var pz = parseInt(punto.z);
            if (!colores.hasOwnProperty('' + punto.sb)) {
                //var p = new THREE.Geometry();
                var p = new THREE.BufferGeometry();
                colores['' + punto.sb] = p;

                cs.push(punto.sb);
            }
            var point = new THREE.Vector3();
            point.x = px;
            point.y = py;
            point.z = pz;
            points.push(point);//###########
            if (px > mx) mx = px;
            if (py > my) my = py;
            if (pz > mz) mz = pz;

            //scene.add(colores['' + punto.sb]);
            const vertices = new Float32Array([point.x, point.y, point.z]);
            colores['' + punto.sb].setAttribute('position', new THREE.BufferAttribute(vertices,3));
            colores['' + punto.sb].setFromPoints(points);
            colores['' + punto.sb].computeVertexNormals();
            const mesh = new THREE.Points(colores['' + punto.sb], new THREE.MeshNormalMaterial());
            mySelf.scene.add(mesh);
        });

        cs.forEach(function (color: any) {
            var aux = color * 111111;
            var c1 = new THREE.PointsMaterial({ color: aux });
            var puntomesh = new THREE.Points(colores['' + color], c1);
            group.add(puntomesh);
            mySelf.puntosred.push(puntomesh);
        });
        
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
            requestAnimationFrame(animate);
            resizeCanvasToDisplaySize()
            mySelf.controls.update();
            mySelf.renderer.render(mySelf.scene, mySelf.camera);
        }

        var centro = new THREE.Vector3();
        centro.x = mx / 2;
        centro.y = my / 2;
        centro.z = mz / 2;
        mySelf.controls.target = centro;
        animate();
    }

    mostrarMenu(idVisualizador:any):void {
        /*var vdate:any = new Date();
        var id:any = vdate.getTime();*/
        var mySelf = this;
        mySelf.id = idVisualizador;
        var objVoronoi = this.json;
        var contenedor= "<div class='row' id='visualizador"+ mySelf.id +"'"+">"+
                        " <div class='container col-sm-10' id='"+ mySelf.id +"'"+"></div> " +
                         "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+ mySelf.id +"'"+"></div>" +
                         "</div>";
      
        $('#myCanvas').after(contenedor);

        var item = "<h3 class='align-text-top' id='titulo'><span>Menu Voronoi</span></h3>" +
            "<div id = 'particulasMenu' class='particulasMenu' >" + 
           " <ul class='nav flex-column' id='vor'>"+
              "<li class='nav-item'>"+
                "<div class='form-check'>"+
                  "<input type='checkbox' class='form-check-input' id='checkAzul'>"+
                  "<label class='form-check-label' for='exampleCheck1'>Azul</label>"+
                "</div>"+
              "</li>"+

             "<li class='nav-item'>"+
               "<div class='form-check'>"+
                 "<input type='checkbox' class='form-check-input' id='checkGris' >"+
                 "<label class='form-check-label' for='exampleCheck1'>Grises</label>"+
               "</div>"+
             "</li>"+
             "<li class='nav-item'>"+
               "<div class='form-check'>"+
                 "<input type='checkbox' class='form-check-input' id='autoRotar'>"+
                 "<label class='form-check-label' for='exampleCheck1'>Auto Rotar</label>"+
               "</div>"+
             "</li>"+
           "</ul>"+
         "</div>"

        $('#menu'+mySelf.id).append(item);
        $('#menu'+mySelf.id).css({ "visibility": "visible", "height": "600px", "width": "250" })
        /******************************************************************************** */
        
        //EvenListeners: Se usa Jquery para capturar los eventos
        $('document').ready(
            // Al seleccionar el checkBox llamado Azul se pintara el diagrama de color azul
            $('#checkAzul').change(function(){
                if($(mySelf).is(":checked")){          
                    $('#checkGris').prop("checked",false);
                    mySelf.setBlue(0,0,1);
                }else{
                    mySelf.setColor(mySelf,0,0,0);
                }
            }),
            // Al seleccionar el checkBox llamado Gris se pintara el diagrama de color gris
            $('#checkGris').change(function(){
                if($(objVoronoi).is(":checked")){             
                    $('#checkAzul').prop("checked",false);
                    mySelf.setGris(1,1,1);
                }else{
                    mySelf.setColor(mySelf,0,0,0);
                }
            }),
            // Al seleccionar el checkBox llamado Rotar el diagrama comenzará a girar
            $('#autoRotar').change(function(){
                var check:any = document.getElementById('#autoRotar');
                if($(objVoronoi).is(":checked")){                     
                    mySelf.autoRotar(check);
                }else{
                    mySelf.autoRotar(check);
                }
            })    
        );
    }//FIN mostrarMenu()

    /**recibe el checkbox que activo el evento y el RGB del color que se quiere la escala con el checkbox se determina la funcion que hara, si esta marcado
    cambia la escala al color del RGB recibo, si esta desmarcado regresa a su color original**/
    setColor(checkbox:any, r:any, g:any, b:any):void {
        var mySelf = this;
        var coloraux, coloraux2, caux;
            
        if (checkbox.checked == true) {     
            mySelf.puntosred.forEach(function (punto:any) {
                coloraux = punto.material.color;
                console.log(coloraux);//########################
                coloraux2 = coloraux.getHex();
                console.log(coloraux2);//########################
                caux = coloraux.r + coloraux.g + coloraux.b;
                console.log(caux);//########################
                coloraux.r = r / caux;
                coloraux.g = g / caux;
                coloraux.b = b / caux;
                punto.material.setValues({color: coloraux});
                mySelf.colors[coloraux.getHex()] = coloraux2;
            });
        } else {
        
            mySelf.puntosred.forEach(function (punto:any) {
                coloraux = punto.material.color;
                caux = mySelf.colors[coloraux.getHex()];              
                punto.material.setValues({ color: caux });
                
            });
            mySelf.colors = {};
        }
    }//FIN setColor

    /**recibe desde index.html el RGB del color a convertir en este caso gris y
    se lo pasa a setColor junto al checkbox que invoco esta funcion**/
    //igual que setGris pero para azul
    setBlue(r:any, g:any, b:any):void {
        var checkbox = document.getElementById("#checkAzul");            
        this.setColor(checkbox, r, g, b);
    } 
        
    setGris(r:any, g:any, b:any):void {
        var checkbox = document.getElementById("#checkGris");    
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