import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-equipment-card',
  imports: [RouterLink, DragDropModule],
  templateUrl: './equipment-card.component.html'
})
export class EquipmentCardComponent {

  @Input() equipment : Equipment|null = null;
  @Input() context : string = '';
  @Input() dragable : boolean = false;

  @Output() delete = new EventEmitter<Equipment>();


  onRemoveClick(){ // Transmet le clic du bouton au parent pour qu'il gère en fonctione de la page sur laquelle se situe ce composant.
    this.delete.emit(this.equipment!)
  }

}
