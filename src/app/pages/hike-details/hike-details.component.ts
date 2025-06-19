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
import { HikeModalComponent } from '../../components/modals/hike-modal/hike-modal.component';
import { HikeEvent } from '../../interfaces/hike/HikeEvent';
import { BasicLoaderComponent } from "../../_partials/basic-loader/basic-loader.component";
import { Inventory } from '../../interfaces/Inventory';

@Component({
  selector: 'app-hike-details',
  imports: [HikeDetailsCardComponent, HikeInventoryComponent, BasicLoaderComponent],
  templateUrl: './hike-details.component.html'
})
export class HikeDetailsComponent implements OnInit{

    private hikeService : HikeService = inject(HikeService);
    private modalService : ModalService = inject(ModalService);
    private router : Router = inject(Router);
    private route : ActivatedRoute = inject(ActivatedRoute);
  
    hike !: Hike;
    inventory : Inventory = {categories: [], equipments : []};

    loaderActive : boolean = true; 
    
  
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

      // S'abonner aux changements des valeurs d'une randonnée
      this.hikeService.hikeChange$.subscribe((newHike)=>{
        this.hike = newHike
      })
    }

    openHikeModifyModal(hike : Hike){
      this.modalService.openModal<HikeModalComponent, HikeEvent>({
        component : HikeModalComponent,
        data : {
          requestType : 'Modification',
          hike : hike
        }
      })
      .subscribe((hikeEvent)=>{
        if(hikeEvent.action === 'update'){
            //Faire la requete de modification de la randonnée
            this.hikeService.modifyHike(hikeEvent.hike).subscribe({
              next:(res)=>{

                this.hikeService.notifyHikeChange(res.data);

                this.modalService.closeModal();
              },
              error:(err)=>{
                console.log(err)
                //TODO => Afficher/Transmettre une erreur dans la modale ou sur cette page (OU avec ASYNC Validator)
              }
            })
        }
        else if(hikeEvent.action === 'delete'){
          // Faire la requete de suppression de la randonnée
          // Retourner à la liste des randos

          this.hikeService.removeHike(hikeEvent.hike?.id ?? '').subscribe({
            next:(res)=>{
              this.modalService.closeModal();

              this.router.navigate(["/hikes"]);
            },
            error:(err)=>{
              console.log(err)
            }
          })
        }
      }
    )}
    
  
    loadHike(hikeId: string): void {

      // On relance le loader
      this.loaderActive = true
      
      this.hikeService.getHikeById(hikeId).subscribe({
        next: (response) => {

          // Enlever le loader
          this.loaderActive = false

          this.hike = response.data;
          if (this.hike.inventory) {
            this.inventory = {
              categories : response.data.inventory!.categories.sort((catA, catB)=>(catA.order)-(catB.order)),
              equipments : response.data.inventory!.equipments
            };
          }
        },
        error: (err) => {
          this.router.navigate(['/error404'], { state: { message: err.error.message } });
        }
      });
    }


    modifyInventory(event : Inventory){
      // console.log("Évènement reçu : ", event)
      this.inventory = event
    }
}
