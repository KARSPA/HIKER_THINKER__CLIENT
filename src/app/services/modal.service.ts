import { ComponentFactoryResolver, Injectable, TemplateRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ModalConfig } from "../interfaces/ModalConfig";

@Injectable({
  providedIn: 'root'
})
export class ModalService{
    
  private modalSubject = new Subject<ModalConfig<any>>();
  modal: Observable<ModalConfig<any>> = this.modalSubject.asObservable();



  private modalCloseSubject = new Subject<void>();
  modalClose: Observable<void> = this.modalCloseSubject.asObservable();


  openModal<T>(config : ModalConfig<T>): void{
    this.modalSubject.next(config);
  }


  closeModal(): void{
    this.modalCloseSubject.next();
  }
}