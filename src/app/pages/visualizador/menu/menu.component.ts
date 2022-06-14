import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileStorageService } from '../../../services/fileStorageService/file-storage.service';
import { RedPorosa } from '../fileModels/redPorosa/red-porosa';
import { Particulas } from '../fileModels/particulas/particulas';
import { Voronoi } from '../fileModels/voronoi/voronoi';
import { ParticulasDosCanales } from '../fileModels/particulasDosCanales/particulas-dos-canales';

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
      case "RedPorosa":
        object = new RedPorosa(json,this.canvas);
        break;
      default:
        break;
    }
    return object;
  }

  reloadPage(){
    window.location.reload();
  }
}
