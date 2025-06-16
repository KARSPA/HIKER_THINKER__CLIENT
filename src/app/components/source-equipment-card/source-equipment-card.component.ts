import { Component, Input, output } from '@angular/core';
import { SourceEquipment } from '../../interfaces/equipment/sources/SourceEquipment';

@Component({
  selector: 'app-source-equipment-card',
  imports: [],
  templateUrl: './source-equipment-card.component.html'
})
export class SourceEquipmentCardComponent {

  @Input() sourceEquipment !: SourceEquipment;
  choosedEquipment = output<SourceEquipment>();

  emitChoosedEquipmentEvent(){
    this.choosedEquipment.emit(this.sourceEquipment)
  }

}
