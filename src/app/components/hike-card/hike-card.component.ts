import { Component, Input, OnInit } from '@angular/core';
import { Hike } from '../../interfaces/hike/Hike';
import { DatePipe } from '@angular/common';
import { NumberFormatPipe } from '../../_helpers/pipes/number-format.pipe';

@Component({
  selector: 'app-hike-card',
  imports: [DatePipe, NumberFormatPipe],
  templateUrl: './hike-card.component.html'
})
export class HikeCardComponent{

  @Input() hike : Hike|null = null;

}
