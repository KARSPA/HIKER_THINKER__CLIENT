import { Component, Input } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipment-card',
  imports: [RouterLink],
  templateUrl: './equipment-card.component.html'
})
export class EquipmentCardComponent {

  @Input() equipment : Equipment|null = null;

}
