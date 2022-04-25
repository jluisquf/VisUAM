import { FileModelInterface } from '../file-model-interface';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class RedPorosa implements FileModelInterface {
  menu: string =  '<div class="form-check mt-4">' +
                      '<input class="form-check-input" type="checkbox" value="" id="azul-check">' +
                      '<label class="form-check-label" for="azul-check">' +
                        'Azul' +
                      '</label>' +
                  '</div>' +
                  '<div class="form-check mt-4">' +
                      '<input class="form-check-input" type="checkbox" value="" id="grises-check">' +
                      '<label class="form-check-label" for="grises-check">' +
                        'Grises' +
                      '</label>' +
                  '</div>' +
                  '<div class="form-check mt-4">' +
                      '<input class="form-check-input" type="checkbox" value="" id="auto-rotar-check">' +
                      '<label class="form-check-label" for="auto-rotar-check">' +
                        'Auto rotar' +
                      '</label>' +
                  '</div>' +
                  '<div class="form-check mt-4">' +
                    '<button type="submit" class="btn btn-primary btn-large">Aplicar</button>' +
                  '</div>';
                  
    redporosa:any = [];

    draw(json: any, c: any): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ canvas: c });
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 1);
        
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.minDistance = 25;
        controls.maxDistance = 100;
        var group = new THREE.Group();
        scene.add(group);
        var puntos = json.sitios;
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
          scene.add( sphere );
          this.redporosa.push(sphere);
        }
      
        if(json.hasOwnProperty('enlaces')){
          var enlaces = json.enlaces;
          for(var i = 0; i < enlaces.length; i++){
            x=enlaces[i].x;
            y=enlaces[i].y;
            z=enlaces[i].z;
            radio=enlaces[i].r;
            rotacion=enlaces[i].eje;
            var p1 = new THREE.CylinderGeometry(radio,radio,radiomax*3,10);
            if(enlaces[i].color==0){
              material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
            }else if(enlaces[i].color==1){
              material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            }else if(enlaces[i].color==2){
              material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
            }
            var cylinder = new THREE.Mesh( p1, material );
            cylinder.position.x = parseInt(x);
            cylinder.position.y = parseInt(y);
            cylinder.position.z = parseInt(z);
            if(rotacion==0){
              cylinder.rotation.x=Math.PI/2;
              cylinder.rotation.y=0;
              cylinder.rotation.z=0;
            }else if(rotacion==1){
              cylinder.rotation.x=0;
              cylinder.rotation.y=Math.PI/2;
              cylinder.rotation.z=0;
            }else if(rotacion==2){
              cylinder.rotation.x=0;
              cylinder.rotation.y=0;
              cylinder.rotation.z=Math.PI/2;
            }
            scene.add( cylinder );
            this.redporosa.push(cylinder);
          }
        }
    
        function resizeCanvasToDisplaySize() {
          const canvas = renderer.domElement;
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
        
          if (canvas.width !== width || canvas.height !== height) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
    
        function animate() {
          requestAnimationFrame( animate );
          resizeCanvasToDisplaySize()
          controls.update();
          renderer.render( scene, camera );
        }
        
        var centro = new THREE.Vector3();
        centro.x = (mx+minx)/2;
        centro.y = (my+miny)/2;
        centro.z = (mz+minz)/2;
        controls.target =  centro;
        animate();

    }
    
}