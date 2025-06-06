import { Component, EventEmitter, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ModalConfig } from '../../../interfaces/ModalConfig';

@Component({
  selector: 'app-modal-container',
  imports: [],
  templateUrl: './modal-container.component.html'
})
export class ModalContainerComponent implements OnInit, OnDestroy{

  @ViewChild('modalContainer', {read: ViewContainerRef, static: true})

  container!: ViewContainerRef;

  isOpen = false;

  private subscription: Subscription = new Subscription();

  private modalService : ModalService = inject(ModalService);

  ngOnInit(): void {

    //S'abonner pour ouvrir la modale
    this.subscription.add(
      this.modalService.modal.subscribe((config: ModalConfig<any, any>) => {
        this.open(config);
      })
    )

    //S'abonner également aux évènement de fermeture de cette modale
    this.subscription.add(
      this.modalService.modalClose.subscribe(()=>{
        this.close();
      })
    )
  }

  open(config : ModalConfig<any, any>): void {
    this.container.clear();

    const componentRef = this.container.createComponent(config.component);

    if(config.data){ //Injecter les inputs
      Object.entries(config.data).forEach(([key, value])=>{
        (componentRef.instance as any)[key] = value;
      })
    }

    // **Lier l’EventEmitter 'result' du composant modal au Subject fourni**
    if (config.result && (componentRef.instance as any).result instanceof EventEmitter) {
      (componentRef.instance as any).result.subscribe(config.result);
    }

    this.isOpen = true;
  }


  close(): void{
    this.container.clear();
    this.isOpen = false;
  }


  ngOnDestroy(): void {
      if(this.subscription){
        this.subscription.unsubscribe();
      }
  }

}
