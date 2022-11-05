import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FileStorageService } from 'src/app/services/file-storage-service/file-storage.service';
import { Particulas } from '../file-models/particulas/particulas';
import { RedPorosa } from '../file-models/redPorosa/red-porosa';
import { Voronoi } from '../file-models/voronoi/voronoi';
import { ParticulasDosCanales } from '../file-models/particulasDosCanales/particulas-dos-canales';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  muestraGrafica = false;
  idVisualizador = new Date();
  @ViewChild('myCanvas')
  private canvasRef!: ElementRef;
  private archivo!: object;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor(private fileStorageService:FileStorageService, private sanitizer: DomSanitizer) { }

  /**
   * load
   */
  public load( json: any ) {
    const object = this.getConstructor(json);
    //object.draw(json, this.canvas);
  }

  ngOnInit(): void {
    this.fileStorageService.getArchivoJson$().subscribe(archivo => {
      this.fileStorageService.setCanvas(this.canvas);
      this.archivo = archivo;
      this.load( this.archivo );
    });
  }

  getConstructor(json: any) {
    var object: any;

    switch (json.name) {
      case "Voronoi":
        object = new Voronoi(json,this.canvas);
        break;
      // NOTA: si se requiere visualizar particulas con un solo canal comentar el caso de abajo y descomentar este
      /*case "Particulas":
        object = new Particulas(json,this.canvas);
        this.muestraGrafica = true;
        break;*/
      case "Particles":
        object = new ParticulasDosCanales(json,this.canvas);
        this.muestraGrafica = true;
        break;
      case "PoreNetwork":
        object = new RedPorosa(json,this.canvas);
        this.muestraGrafica = true;
        break;
      default:
        break;
    }
    return object;
  }

}