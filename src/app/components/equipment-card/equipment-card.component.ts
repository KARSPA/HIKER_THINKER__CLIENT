import { Component, inject, Input } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { RemoveEquipmentConfirmModalComponent } from '../remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';

@Component({
  selector: 'app-equipment-card',
  imports: [RouterLink],
  templateUrl: './equipment-card.component.html'
})
export class EquipmentCardComponent {

  @Input() equipment : Equipment|null = null;

  private modalService : ModalService = inject(ModalService);


  openRemoveEquipmentConfirmationModal(){
    this.modalService.openModal({
      component: RemoveEquipmentConfirmModalComponent,
      data: {equipment : this.equipment ?? undefined}
    })
  }


  removeEquipment(){

  }

}
