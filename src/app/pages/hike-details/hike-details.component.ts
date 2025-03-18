import { Component, inject, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { HikeService } from '../../services/hike.service';
import { Hike } from '../../interfaces/hike/Hike';
import { HikeDetailsCardComponent } from '../../components/hike-details-card/hike-details-card.component';

@Component({
  selector: 'app-hike-details',
  imports: [HikeDetailsCardComponent],
  templateUrl: './hike-details.component.html'
})
export class HikeDetailsComponent {

    private hikeService : HikeService = inject(HikeService);
    private modalService : ModalService = inject(ModalService);
    private router : Router = inject(Router);
  
    hike !: Hike;
  
    @Input()
    set hikeId(hikeId : string){
      this.hikeService.getHikeById(hikeId).subscribe({
        next : (response)=>{
          this.hike = response.data
        },
        error: (err)=>{
          console.log(err);
          this.router.navigate(["/error404"], {state: {message: err.error.message}})
        }
      });
    }

}
