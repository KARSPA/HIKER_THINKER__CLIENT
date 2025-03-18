import { Component, inject, Input, OnInit } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentService } from '../../services/equipment.service';
import { Router, RouterLink } from '@angular/router';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { ModalService } from '../../services/modal.service';
import { RemoveEquipmentConfirmModalComponent } from '../../components/remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-equipment-details',
  imports: [RouterLink],
  templateUrl: './equipment-details.component.html'
})
export class EquipmentDetailsComponent implements OnInit{
  

  private equipmentService : EquipmentService = inject(EquipmentService);
  private inventoryService : InventoryService = inject(InventoryService);
  private modalService : ModalService = inject(ModalService);
  private router : Router = inject(Router);

  equipment !: Equipment;

  @Input()
  set equipmentId(equipmentId : string){
    this.equipmentService.getEquipmentById(equipmentId).subscribe({
      next : (response)=>{
        this.equipment = response.data
      },
      error: (err)=>{
        console.log(err);
        this.router.navigate(["/error404"], {state: {message: err.error?.message}})
      }
    });
  }


  ngOnInit(): void {
    this.inventoryService.equipmentRemove$.subscribe({
      next:(equipmentId)=>{
        this.router.navigate(['/inventory'])
      }
    })
  }

  openRemoveEquipmentConfirmationModal(){
      this.modalService.openModal({
        component: RemoveEquipmentConfirmModalComponent,
        data: {equipment : this.equipment ?? undefined}
      })
    }
  

}
