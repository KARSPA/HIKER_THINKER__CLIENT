import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { RemoveEquipmentConfirmModalComponent } from '../remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';
import { Equipment } from '../../interfaces/equipment/Equipment';

@Component({
  selector: 'app-equipment-card',
  imports: [RouterLink],
  templateUrl: './equipment-card.component.html'
})
export class EquipmentCardComponent {

  @Input() equipment : Equipment|null = null;

  @Output() delete = new EventEmitter<Equipment>();


  onRemoveClick(){ // Transmet le clic du bouton au parent pour qu'il gère en fonctione de la page sur laquelle se situe ce composant.
    this.delete.emit(this.equipment!)
  }

}
