import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route : ActivatedRoute = inject(ActivatedRoute);
  
    hike !: Hike;
    hikeInventory : Map<Category, Equipment[]> | null = null;
    
  
    ngOnInit(): void {
      // Récupérer l'id depuis l'URL et charger la randonnée
      this.route.paramMap.subscribe(params => {
        const hikeId = params.get('hikeId');
        if (hikeId) {
          this.loadHike(hikeId);
        } else {
          this.router.navigate(['/error404'], { state: { message: 'Aucune randonnée trouvée.' } });
        }
      });
    }
  
    loadHike(hikeId: string): void {
      this.hikeService.getHikeById(hikeId).subscribe({
        next: (response) => {
          this.hike = response.data;
          if (this.hike.inventory) {
            this.hikeInventory = this.inventoryService.restructureInventory(this.hike.inventory);
          }
        },
        error: (err) => {
          this.router.navigate(['/error404'], { state: { message: err.error.message } });
        }
      });
    }
  
    // Méthode pour recharger l'inventaire, par exemple après un changement
    reloadHikeInventory(): void {
      if (this.hike?.id) {
        this.loadHike(this.hike.id);
      }
    }


}
