import { Component, inject, Input } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentService } from '../../services/equipment.service';
import { InventoryService } from '../../services/inventory.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-remove-equipment-confirm-modal',
  imports: [],
  templateUrl: './remove-equipment-confirm-modal.component.html'
})
export class RemoveEquipmentConfirmModalComponent {

  @Input() equipment !: Equipment;


  private equipmentService : EquipmentService = inject(EquipmentService);
  private inventoryService : InventoryService = inject(InventoryService);
  private modalService : ModalService = inject(ModalService);


  removeEquipment(){
    this.equipmentService.removeInventoryEquipment(this.equipment?.id).subscribe({
      next: (response)=>{
        console.log(response)

        //notifier l'inventory service qu'un équipement à été supprimer pour mettre à jour l'inventaire affiché
        this.inventoryService.notifyEquipmentRemove(response.data);


        this.modalService.closeModal()
      },
      error:(err)=>{
        console.log(err.error)
      }
    })
  }
}
