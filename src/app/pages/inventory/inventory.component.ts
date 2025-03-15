import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../interfaces/Inventory';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { ModalService } from '../../services/modal.service';
import { AddCategoryModalComponent } from '../../components/add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-inventory',
  imports: [EquipmentCardComponent],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit{
  
  private inventoryService : InventoryService = inject(InventoryService)
  private modalService : ModalService = inject(ModalService);

  inventory : Map<Category, Equipment[]> | null = null;
  rawInventory : Inventory | null = null;

  ngOnInit(): void {

    // Charger l'inventaire depuis l'API
    this.loadInventory();


    // S'abonner aux évènements d'ajout de catégorie.
    this.inventoryService.categoryAdded$.subscribe((category)=>{
      this.inventory?.set(category, []);
    })


    // S'abonner aux évènements d'ajout d'équipement.
      
    }


    openCategoryModal(): void{
      console.log("CLIC OK")
      this.modalService.openModal({
        component: AddCategoryModalComponent,
        data: {title : 'Inventaire'}
      })
    }


    loadInventory(){
      this.inventoryService.getInventory().subscribe({
        next :(response) => {
          this.rawInventory = response.data;
          this.inventory = this.inventoryService.restructureInventory(response.data);
          console.log(response)
        },
        error : (error)=> {
          console.log(error)
        }
      })
    }



    placeholder(){
      console.log('oui.')
    }

}
