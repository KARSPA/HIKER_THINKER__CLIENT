import { Component, Input } from '@angular/core';
import { Hike } from '../../interfaces/hike/Hike';
import { DatePipe } from '@angular/common';
import { NumberFormatPipe } from '../../_helpers/pipes/number-format.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hike-card',
  imports: [DatePipe, NumberFormatPipe, RouterLink],
  templateUrl: './hike-card.component.html'
})
export class HikeCardComponent{

  @Input() hike : Hike|null = null;

}
