import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Equipment } from '../../../interfaces/equipment/Equipment';
import { InventoryService } from '../../../services/inventory.service';
import { RefEquipment } from '../../../interfaces/equipment/RefEquipment';
import { SourceEquipmentListComponent } from "../../source-equipment-list/source-equipment-list.component";

@Component({
  selector: 'app-add-equipment-modal',
  imports: [SourceEquipmentListComponent],
  templateUrl: './add-equipment-modal.component.html'
})
export class AddEquipmentModalComponent implements OnInit{

  //Lister tous les équipements de l'inventaire de la personne (à chercher avec inventoryService)
  //Filter avec la liste des équipements déjà présents

  //PLUS TARD, rajouter un filtre de rechercher par nom d'équipement/marque

  @Input() context !: 'Hike' | 'Model';

  
  @Input() alreadyInEquipments : Equipment[] = [];
  @Input() categoryIdRef !: string;

  @Output() result = new EventEmitter<RefEquipment>();


  private inventoryService : InventoryService = inject(InventoryService);


  ngOnInit(): void {
      // Abonnement aux changements d'équipements pour actualiser la liste (lors de l'ajout de l'un d'eux par exemple)
      this.inventoryService.equipmentChange$.subscribe((newEquip) => {
        if(!this.alreadyInEquipments.some(eq => eq.id === newEquip.id)){
          this.alreadyInEquipments.push(newEquip)
        }
      });
  }

  onAddClick(equipmentId : string){

    const payload : RefEquipment = {
      categoryId : this.categoryIdRef,
      sourceId : equipmentId
    }

    this.result.emit(payload)
  }
}
