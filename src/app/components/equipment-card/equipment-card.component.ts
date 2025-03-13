import { Component, Input } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';

@Component({
  selector: 'app-equipment-card',
  imports: [],
  templateUrl: './equipment-card.component.html'
})
export class EquipmentCardComponent {

  @Input() equipment : Equipment|null = null;

}
