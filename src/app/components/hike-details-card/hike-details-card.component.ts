import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NumberFormatPipe } from '../../_helpers/pipes/number-format.pipe';
import { Hike } from '../../interfaces/hike/Hike';
import { WeightGraphComponent } from '../weight-graph/weight-graph.component';
import { Inventory } from '../../interfaces/Inventory';

@Component({
  selector: 'app-hike-details-card',
  imports: [DatePipe, NumberFormatPipe, WeightGraphComponent],
  templateUrl: './hike-details-card.component.html'
})
export class HikeDetailsCardComponent {

  @Input() hike !: Hike;
  @Input() inventory !: Inventory;
  @Output() openModal = new EventEmitter<void>();


  emitOpenModalEvent(){
    this.openModal.emit();
  }

}
