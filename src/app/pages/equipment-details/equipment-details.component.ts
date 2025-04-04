import { Component, inject, Input, OnInit } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentService } from '../../services/equipment.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { ModalService } from '../../services/modal.service';
import { RemoveEquipmentConfirmModalComponent } from '../../components/remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';
import { InventoryService } from '../../services/inventory.service';
import { EquipmentDetails } from '../../interfaces/equipment/EquipmentDetails';
import { StatisticsService } from '../../services/statistics.service';
import { EquipmentStats } from '../../interfaces/statistics/EquipmentStats';

@Component({
  selector: 'app-equipment-details',
  imports: [RouterLink],
  templateUrl: './equipment-details.component.html'
})
export class EquipmentDetailsComponent implements OnInit{
  
  private equipmentService = inject(EquipmentService);
  private inventoryService = inject(InventoryService);
  private statisticsService = inject(StatisticsService);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  equipment ?: EquipmentDetails;
  statistics ?: EquipmentStats;

  ngOnInit(): void {

    this.equipmentService.setMode('inventory')

    // Récupérer l'id depuis l'URL et charger la randonnée
    this.route.paramMap.subscribe(params => {
      const equipmentId = params.get('equipmentId');
      if (equipmentId) {
        this.equipmentService.getEquipmentById(equipmentId).subscribe({
          next : (response)=>{
            this.equipment = response.data
          },
          error: (err)=>{
            console.log(err);
            this.router.navigate(["/error404"], {state: {message: err.error?.message}})
          }
        })

        this.statisticsService.getEquipmentStatistics(equipmentId).subscribe({
          next: (res)=>{
              this.statistics = res.data
              console.log(res)
          },
          error: (err)=>{
            console.log(err);
          }
        })
      }
    });

    


    // S'abonner à la suppression
    this.inventoryService.equipmentRemove$.subscribe({
      next:(equipmentId)=>{
        this.router.navigate(['/inventory'])
      }
    })
  }

  openRemoveEquipmentConfirmationModal(){
      this.modalService.openModal<RemoveEquipmentConfirmModalComponent, boolean>({
        component: RemoveEquipmentConfirmModalComponent,
        data: {context : 'Inventory'}
      })
      .pipe(confirm => confirm) //On garde que les réponses true (confirmations)
      .subscribe(()=>{
          if (this.equipment) {
            this.equipmentService.removeInventoryEquipment(this.equipment.id)
            .subscribe((response)=>this.inventoryService.notifyEquipmentRemove(response.data))
          }
      })
    }
  

}
