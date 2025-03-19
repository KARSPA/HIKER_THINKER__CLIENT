import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ModalConfig } from "../interfaces/ModalConfig";

@Injectable({
  providedIn: 'root'
})
export class ModalService{
    
  private modalSubject = new Subject<ModalConfig<any, any>>();
  modal: Observable<ModalConfig<any, any>> = this.modalSubject.asObservable();

  private modalCloseSubject = new Subject<void>();
  modalClose: Observable<void> = this.modalCloseSubject.asObservable();


  openModal<T, R>(config : ModalConfig<T, R>): Observable<R>{
    const result = new Subject<R>();
    this.modalSubject.next({...config, result});
    return result.asObservable()
  }


  closeModal(): void{
    this.modalCloseSubject.next();
  }
}