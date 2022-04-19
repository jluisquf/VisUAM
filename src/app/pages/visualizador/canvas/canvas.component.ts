import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FileStorageService } from 'src/app/services/file-storage.service';
import { Particulas } from '../fileModels/particulas/particulas';
import { RedPorosa } from '../fileModels/redPorosa/red-porosa';
import { Voronoi } from '../fileModels/voronoi/voronoi';

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
    object.draw(json, this.canvas);
    object.mostrarMenu(this.idVisualizador.getTime());//se manda a llamar al metodo para mostrar el menu
  }

  ngOnInit(): void {
    this.fileStorageService.getArchivoJson$().subscribe(archivo => {
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
      case "Particulas":
        object = new Particulas(json,this.canvas);
        this.muestraGrafica = true;
        break;
      case "RedPorosa":
        object = new RedPorosa();
        break;
      default:
        break;
    }
    return object;
  }

}