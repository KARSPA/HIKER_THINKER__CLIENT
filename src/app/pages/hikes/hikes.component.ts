import { Component, inject, OnInit } from '@angular/core';
import { HikeService } from '../../services/hike.service';
import { Hike } from '../../interfaces/hike/Hike';
import { HikeCardComponent } from '../../components/hike-card/hike-card.component';
import { ModalService } from '../../services/modal.service';
import { HikeModalComponent } from '../../components/hike-modal/hike-modal.component';

@Component({
  selector: 'app-hikes',
  imports: [HikeCardComponent],
  templateUrl: './hikes.component.html'
})
export class HikesComponent implements OnInit{
 

  private hikeService : HikeService = inject(HikeService);
  private modalService : ModalService = inject(ModalService);

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


  openHikeModal(hike?: Hike){
    this.modalService.openModal({
      component : HikeModalComponent,
      data: {hike : hike}
    })

  }

}
