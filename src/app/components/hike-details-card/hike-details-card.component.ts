import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NumberFormatPipe } from '../../_helpers/pipes/number-format.pipe';
import { Hike } from '../../interfaces/hike/Hike';

@Component({
  selector: 'app-hike-details-card',
  imports: [DatePipe, NumberFormatPipe],
  templateUrl: './hike-details-card.component.html'
})
export class HikeDetailsCardComponent {

  @Input() hike : Hike|null = null;

  @Output() openModal = new EventEmitter<void>();


  emitOpenModalEvent(){
    this.openModal.emit();
  }

}
