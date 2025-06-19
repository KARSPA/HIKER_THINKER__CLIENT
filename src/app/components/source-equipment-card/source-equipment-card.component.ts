import { Component, Input, OnInit, output } from '@angular/core';
import { SourceEquipment } from '../../interfaces/equipment/sources/SourceEquipment';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-source-equipment-card',
  imports: [RouterLink],
  templateUrl: './source-equipment-card.component.html'
})
export class SourceEquipmentCardComponent{
  

  @Input() equipment !: SourceEquipment|Equipment;
  @Input() mode : 'source'|'inventory' = 'source';
  choosedEquipment = output<SourceEquipment|Equipment>();


  emitChoosedEquipmentEvent(){
    this.choosedEquipment.emit(this.equipment)
  }


  isSource(e : SourceEquipment|Equipment): e is SourceEquipment{
    return 'url' in e;
  }

}
