import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileStorageService } from '../../../services/file-storage-service/file-storage.service';
import { RedPorosa } from '../file-models/redPorosa/red-porosa';
import { Particulas } from '../file-models/particulas/particulas';
import { Voronoi } from '../file-models/voronoi/voronoi';
import { ParticulasDosCanales } from '../file-models/particulasDosCanales/particulas-dos-canales';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  @Output() isClose = new EventEmitter<Boolean>();
  @Output() isActive = new EventEmitter<Boolean>();

  idVisualizador = new Date();
  file: any | null = null;
  isFile: boolean = false;
  json: any | null = null;
  canvas: any | null = null;
  showDefault = false;

  // Inject service 
  constructor(private fileStorageService: FileStorageService) { }

  private drawMenu( json: any ) {
    const object = this.getConstructor(json);
    // TODO: Luis
    object.draw(json, this.canvas);
    object.mostrarMenu(this.idVisualizador.getTime());//se manda a llamar al metodo para mostrar el menu
  }

  ngOnInit(): void {
    this.fileStorageService.getArchivoJson$().subscribe(archivo => {
      this.drawMenu( archivo );
    });
    this.fileStorageService.getCanvas$().subscribe(canvas => {
      this.canvas = canvas;
    });
  }

  async uploadFile($event: any) {
    var fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      this.file = $event.target.files[0];
      this.isFile = true;
    } else {
      this.isFile = false;
    }
    this.saveStorage(this);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.onLoad();
  }

  // OnClick del boton "Subir Archivo" 
  onLoad(): void {
    this.fileStorageService.setArchivoJson(this.json);
  }

  // Guarda el json en el Storage
  saveStorage(callback: any): void {
    var fileToLoad = this.file;
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
      var textFromFileLoaded: any = fileLoadedEvent.target?.result;
      var json = JSON.parse(textFromFileLoaded);
      callback.json = json;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

  closeClick(){
    this.isClose.emit(true);
  }

  openFile(){
    this.isActive.emit(true);
  }

  getConstructor(json: any) {
    var object: any;

    if (json.name == undefined){
      alert("Falta campo 'name'");
      window.location.reload();
    } else {
      switch (json.name) {
        case "Voronoi":
          object = new Voronoi(json,this.canvas);
          break;
        // NOTA: si se requiere visualizar particulas con un solo canal comentar el caso de abajo y descomentar este
        /*case "Particulas":
          object = new Particulas(json,this.canvas);
          break;*/
        case "Particulas":
          object = new ParticulasDosCanales(json,this.canvas);
          break;
        case "PoreNetwork":
          object = new RedPorosa(json,this.canvas);
          break;
        default:
          alert("No se puede reconocer '" + json.name + "' como un visualizador.\n" +
                "Pruebe con Voronoi, Particulas o RedPorosa.");
          window.location.reload();
          break;
      }
    }

    return object;
  }

  reloadPage(){
    window.location.reload();
  }
}
