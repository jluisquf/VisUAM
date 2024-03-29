import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileStorageService } from 'src/app/services/file-storage-service/file-storage.service';

@Component({
  selector: 'app-visualizador-page',
  templateUrl: './visualizador-page.component.html',
  styleUrls: ['./visualizador-page.component.css']
})
export class VisualizadorPageComponent implements OnInit {

  @ViewChild('uploader')
  private uploader!: ElementRef;

  file: any | null = null;
  isFile: boolean = false;
  json: any | null = null;
  
  constructor(private fileStorageService: FileStorageService) { }

  ngOnInit(): void {
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

  openMenu(){
    let menu = document.getElementsByClassName('menu') as HTMLCollectionOf<HTMLElement>;

    if (menu.length != 0) {
      menu[0].style.left = "0";
    }
  }

  closeMenu(){
    let menu = document.getElementsByClassName('menu') as HTMLCollectionOf<HTMLElement>;

    if (menu.length != 0) {
      menu[0].style.left = "-25rem";
    }
  }

  openFile() {
    this.uploader.nativeElement.click();
  }
}
