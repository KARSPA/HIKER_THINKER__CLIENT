import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Equipment } from '../../../interfaces/equipment/Equipment';
import { EquipmentService } from '../../../services/equipment.service';
import { InventoryService } from '../../../services/inventory.service';
import { ModalService } from '../../../services/modal.service';
import { EquipmentEvent } from '../../../interfaces/equipment/EquipmentEvent';

@Component({
  selector: 'app-remove-equipment-confirm-modal',
  imports: [],
  templateUrl: './remove-equipment-confirm-modal.component.html'
})
export class RemoveEquipmentConfirmModalComponent {

  @Input() context !: string;

  @Output() result = new EventEmitter<boolean>(); // Va remonter les évènements pour confirmation


  private modalService : ModalService = inject(ModalService);


  confirmRemoval() : void{
    this.result.emit(true);
    this.modalService.closeModal();
  }
}
