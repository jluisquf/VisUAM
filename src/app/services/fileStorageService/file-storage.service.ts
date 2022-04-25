import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  private archivoJson!: object;
  private archivoJson$: Subject<object>;
  private canvas!: object;
  private canvas$: Subject<object>;

  constructor() {
    this.archivoJson$ = new Subject();
    this.canvas$ = new Subject();
  }

  /**
   * setArchivoJson
   */
  public setArchivoJson(value: any) {
    this.archivoJson = value;
    this.archivoJson$.next(this.archivoJson);
  }

  /**
   * getArchivoJson
   */
  public getArchivoJson$(): Observable<object> {
    return this.archivoJson$.asObservable();
  }
  
  /**
   * setCanvas
   */
  public setCanvas(value: any) {
    this.canvas = value;
    this.canvas$.next(this.canvas);
  }

  /**
   * getCanvas
   */
  public getCanvas$(): Observable<object> {
    return this.canvas$.asObservable();
  }
  
}
