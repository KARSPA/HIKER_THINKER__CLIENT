import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { HikeService } from '../../services/hike.service';
import { Hike } from '../../interfaces/hike/Hike';
import { HikeDetailsCardComponent } from '../../components/hike-details-card/hike-details-card.component';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { InventoryService } from '../../services/inventory.service';
import { HikeInventoryComponent } from '../../components/hike-inventory/hike-inventory.component';

@Component({
  selector: 'app-hike-details',
  imports: [HikeDetailsCardComponent, HikeInventoryComponent],
  templateUrl: './hike-details.component.html'
})
export class HikeDetailsComponent implements OnInit{

    private hikeService : HikeService = inject(HikeService);
    private inventoryService : InventoryService = inject(InventoryService);
    private modalService : ModalService = inject(ModalService);
    private router : Router = inject(Router);
  
    hike !: Hike;
    
    hikeInventory : Map<Category, Equipment[]> | null = null;
    
  
    @Input()
    set hikeId(hikeId : string){
      this.hikeService.getHikeById(hikeId).subscribe({
        next : (response)=>{
          this.hike = response.data

          if(this.hike.inventory) this.hikeInventory = this.inventoryService.restructureInventory(this.hike.inventory)
            console.log(this.hikeInventory)
        },
        error: (err)=>{
          console.log(err);
          this.router.navigate(["/error404"], {state: {message: err.error.message}})
        }
      });
    }


    ngOnInit(): void {
    }


}
