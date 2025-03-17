import { Component, inject, OnInit } from '@angular/core';
import { HikeService } from '../../services/hike.service';
import { Hike } from '../../interfaces/hike/Hike';
import { HikeCardComponent } from '../../components/hike-card/hike-card.component';

@Component({
  selector: 'app-hikes',
  imports: [HikeCardComponent],
  templateUrl: './hikes.component.html'
})
export class HikesComponent implements OnInit{
 

  private hikeService : HikeService = inject(HikeService);

  hikes : Hike[] = [];


  ngOnInit(): void {
    this.hikeService.getHikes().subscribe({
      next:(response)=>{
        console.log(response)
        this.hikes = response.data;
      },
      error:(err)=>{
        console.log(err)
      }
    });
  }


  placeholder(){
    console.log(this.hikes)
  }

}
