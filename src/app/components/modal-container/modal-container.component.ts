import { Component, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ModalConfig } from '../../interfaces/ModalConfig';

@Component({
  selector: 'app-modal-container',
  imports: [],
  templateUrl: './modal-container.component.html'
})
export class ModalContainerComponent implements OnInit, OnDestroy{

  @ViewChild('modalContainer', {read: ViewContainerRef, static: true})

  container!: ViewContainerRef;

  isOpen = false;

  private subscription!: Subscription;

  private modalService : ModalService = inject(ModalService);

  ngOnInit(): void {
      this.subscription = this.modalService.modal.subscribe((config: ModalConfig<any>) => {
        this.open(config);
      })
  }

  open(config : ModalConfig<any>): void {
    this.container.clear();

    const componentRef = this.container.createComponent(config.component);

    if(config.data){
      Object.entries(config.data).forEach(([key, value])=>{
        (componentRef.instance as any)[key] = value;
      })
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
