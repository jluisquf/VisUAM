import { FileModelInterface } from '../file-model-interface';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

declare var $: any;

export class RedPorosa implements FileModelInterface {

  mySelf = this;
  colorsp: any = {};//colores (hexa)
  redporosa: any = [];//puntos (objetos)


  vdate = new Date();
  id = this.vdate.getTime();

  constructor(public json: any, public canvas: any) { }

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
    mySelf.scene.background = new THREE.Color(0xD3D3D3);
    mySelf.camera.position.set(0, 0, 1);
    mySelf.controls.enableDamping = true;
    mySelf.controls.dampingFactor = 0.25;
    mySelf.controls.minDistance = 25;
    mySelf.controls.maxDistance = 100;
    var group = new THREE.Group();
    this.scene.add(group);
    //var colores = json.sitiesColor;
    var puntos = json.sities;
    var x,y,z,radio,rotacion,radiomax = -1;
    var mx=-1000,my=-1000,mz=-1000;
    var minx=1000,miny=1000,minz=1000;
    for(var i = 0; i < puntos.length; i++){
      x=puntos[i].x;
      y=puntos[i].y;
      z=puntos[i].z;
      if(x>mx) mx=x;
      if(x<minx) minx=x;
      if(y>my) my=y;
      if(y<miny) miny=y;
      if(z>mz) mz=z;
      if(z<minz) minz=z;
      radio=puntos[i].r;
      if(radio>radiomax){
        radiomax=radio;
      }
      rotacion=puntos[i*5+4];
      var p = new THREE.SphereGeometry(radio, 10,10);
      var material;
      if(puntos[i].color==0){
        material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
      }else if(puntos[i].color==1){
        material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      }else if(puntos[i].color==2){
        material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
      }
      var sphere = new THREE.Mesh( p, material );
      sphere.position.x = parseInt(x);
      sphere.position.y = parseInt(y);
      sphere.position.z = parseInt(z);
      this.scene.add( sphere );
      mySelf.redporosa.push(sphere);
    }
  
    //var bondscolores = json.bondsColor;
    if(json.hasOwnProperty('bonds')){
      var sities = json.sities;
      var bonds = json.bonds;
      for(var i = 0; i < sities.length; i++){
        x=sities[i].x + 0.65;
        y=sities[i].y + 0.65;
        z=sities[i].z + 0.65;
        radio=bonds[i].r;

        // PRIMER ENLACE
        if (bonds[i].x > 0) {
          var qx = new THREE.CylinderGeometry(radio,radio,radiomax*2*bonds[i].x,10);
          qx.rotateZ(-Math.PI * 0.5);
          
          if(bonds[i].color==0){
            material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
          }else if(bonds[i].color==1){
            material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
          }else if(bonds[i].color==2){
            material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
          }
          var cylinderx = new THREE.Mesh( qx, material );
          cylinderx.position.x = x + 2*sities[i].r;
          cylinderx.position.y = y;
          cylinderx.position.z = z;
          this.scene.add( cylinderx );
          mySelf.redporosa.push(cylinderx);
        }
        

        // SEGUNDO ENLACE
        if (bonds[i].y > 0) {
          var qy = new THREE.CylinderGeometry(radio,radio,radiomax*2*bonds[i].y,10);
          qy.rotateY(-Math.PI * 0.5);
          
          if(bonds[i].color==0){
            material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
          }else if(bonds[i].color==1){
            material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
          }else if(bonds[i].color==2){
            material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
          }
          var cylindery = new THREE.Mesh( qy, material );
          cylindery.position.x = x;
          cylindery.position.y = y + 2*sities[i].r;
          cylindery.position.z = z;
          this.scene.add( cylindery );
          mySelf.redporosa.push(cylindery);
        }

        // TERCER ENLACE
        if (bonds[i].z > 0) {
          var qz = new THREE.CylinderGeometry(radio,radio,radiomax*2*bonds[i].z,10);
          qz.rotateX(-Math.PI * 0.5);
          
          if(bonds[i].color==0){
            material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
          }else if(bonds[i].color==1){
            material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
          }else if(bonds[i].color==2){
            material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
          }
          var cylinderz = new THREE.Mesh( qz, material );
          cylinderz.position.x = x;
          cylinderz.position.y = y;
          cylinderz.position.z = z - 2*sities[i].r;
          this.scene.add( cylinderz );
          mySelf.redporosa.push(cylinderz);
        }
      }
    }

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
    centro.x = (mx+minx)/2;
    centro.y = (my+miny)/2;
    centro.z = (mz+minz)/2;
    mySelf.controls.target = centro;
    animate();
  }

  mostrarMenu(idVisualizador: any): void {
    // Cambiar scope
    var mySelf = this;
    // ID del canvas del visualizador
    mySelf.id = idVisualizador;

    // JSON enviado
    var objVoronoi = this.json;
    // "<h3 class='align-text-top' id='titulo'><span>Menu Red Porosa</span></h3>" +
    var contenedor = "<div class='row' id='visualizador" + idVisualizador + "'" + ">" +
      " <div class='container col-sm-10' id='" + idVisualizador + "'" + "></div> " +
      "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu" + idVisualizador + "'" + "></div>" +
      "</div>";

    $('.menu__default').after(contenedor);

    var item =
      "<div id = 'particulasMenu'" + "class='particulasMenu' >" +
      "<h3 class='align-text-top section__subtitle' id='titulo'><span>Pore Network Menu</span></h3>" +
      " <ul class='nav flex-column' id='vor'>" +
      "<li class='nav-item'>" +
      "<div class='form-check'>" +
      "<input type='checkbox' class='form-check-input' id='checkAzul'>" +
      "<label class='form-check-label' for='checkAzul'><span></span></label>" +
      "<span> Blue Color </span>" +
      "</div>" +
      "</li>" +

      "<li class='nav-item'>" +
      "<div class='form-check'>" +
      "<input type='checkbox' class='form-check-input' id='checkGris' >" +
      "<label class='form-check-label' for='checkGris'><span></span></label>" +
      "<span> Gray Color </span>" +
      "</div>" +
      "</li>" +
      "<li class='nav-item'>" +
      "<div class='form-check'>" +
      "<input type='checkbox' class='form-check-input' id='autoRotar'>" +
      "<label class='form-check-label' for='autoRotar'><span></span></label>" +
      "<span> Auto Rotate </span>" +
      "</div>" +
      "</li>" +
      "</ul>" +
      "</div>"

    $('#menu' + idVisualizador).append(item);
    $('#menu' + idVisualizador).css({ "visibility": "visible", "width": "250" })
    
    //EvenListeners: Se usa Jquery para capturar los eventos
    $('document').ready(
      // Al seleccionar el checkBox llamado Azul se pintara el diagrama de color azul
      $('#checkAzul').change(function(){
          var check:any = document.getElementById('checkAzul');
          if(check.checked) {
              $('#checkGris').prop("checked",false);
              mySelf.setBlue(check,0,0,1);
          }else{
              mySelf.setBlue(check,0,0,0);
          }
      }),
      // Al seleccionar el checkBox llamado Gris se pintara el diagrama de color gris
      $('#checkGris').change(function(){
          var check:any = document.getElementById('checkGris');
          if(check.checked) {
              $('#checkAzul').prop("checked",false);
              mySelf.setGris(check,1,1,1);
          }else{
              mySelf.setGris(check,0,0,0);
          }
      }),
      // Al seleccionar el checkBox llamado Rotar el diagrama comenzará a girar
      $('#autoRotar').change(function(){
          var check:any = document.getElementById('autoRotar');
          if(check.checked) {
              mySelf.autoRotar(check);
          }else{
              mySelf.autoRotar(check);
          }
      })    
  );
  }//FIN mostrarMenu()

  /**recibe desde index.html el RGB del color a convertir en este caso gris y
  se lo pasa a setColor junto al checkbox que invoco esta funcion**/
  //igual que setGris pero para azul
  setBlue(check: any, r: any, g: any, b: any): void {
    var mySelf = this;
    var checkbox = check;
      var coloraux;
      if(checkbox.checked==true){
           mySelf.redporosa.forEach(function(punto:any){
             coloraux = punto.material.color;
             if(coloraux.r!=0){coloraux.r =0, coloraux.b=r;}
             else if(coloraux.g!=0){coloraux.g =0,coloraux.b=g;}
             else if(coloraux.b!=0){coloraux.b =b;}
             punto.material.setValues({color : coloraux});
           });
      } else {
            mySelf.redporosa.forEach(function(punto:any){
              coloraux = punto.material.color;
              if(coloraux.b==r){coloraux.r =1, coloraux.b=0;}
              else if(coloraux.b==g){coloraux.g =1,coloraux.b=0;}
              else if(coloraux.b==b){coloraux.b =1;}
              punto.material.setValues({color : coloraux});

            });
            mySelf.colorsp = {};
      }
  }

  setGris(check: any, r: any, g: any, b: any): void {
    var mySelf = this;
    var checkbox = check;
      var coloraux, caux;
      if(checkbox.checked==true){
           mySelf.redporosa.forEach(function(punto: any){
             var aux = punto.material.color;
             coloraux  =punto.material.color;
             if(aux.r==1 && aux.g==0 && aux.b==0){
               aux.r = r; aux.g = r; aux.b = r;
             }else if(aux.r==0 && aux.g==1 && aux.b==0){
               aux.r = g; aux.g = g; aux.b = g;
             }else if(aux.r==0 && aux.g==0 && aux.b==1){
               aux.r = b; aux.g = b; aux.b = b;
             }
             punto.material.setValues({color : aux});
             mySelf.colorsp[aux.getHex()] = coloraux;
           });
      } else {
            mySelf.redporosa.forEach(function(punto:any){
              var aux = punto.material.color;
              coloraux  =punto.material.color;
              if(aux.r == r && aux.g == r && aux.b == r){
                aux.r=1, aux.g=0, aux.b=0;
              }else if(aux.r == g && aux.g == g && aux.b == g){
                aux.r=0, aux.g=1, aux.b=0;
              }else if(aux.r == b && aux.g == b && aux.b == b){
                aux.r=0, aux.g=0, aux.b=1;
              }
              punto.material.setValues({color : aux});

            });
            mySelf.colorsp = {};
      }
  }

  autoRotar(checkbox: any): void {
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
