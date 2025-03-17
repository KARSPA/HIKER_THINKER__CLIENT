import { Component, Input, OnInit } from '@angular/core';
import { Hike } from '../../interfaces/hike/Hike';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hike-card',
  imports: [DatePipe],
  templateUrl: './hike-card.component.html'
})
export class HikeCardComponent implements OnInit{

  @Input() hike : Hike|null = null;

  ngOnInit(): void {
    console.log(this.hike)
  }


}
