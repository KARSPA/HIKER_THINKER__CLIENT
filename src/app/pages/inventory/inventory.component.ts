import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../interfaces/Inventory';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { ModalService } from '../../services/modal.service';
import { InventoryCategoryModalComponent } from '../../components/inventory-category-modal/inventory-category-modal.component';
import { InventoryEquipmentModalComponent } from '../../components/inventory-equipment-modal/inventory-equipment-modal.component';

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


    // S'abonner aux évènements d'ajout/modification de catégorie.
    this.inventoryService.categoryChange$.subscribe((category)=>{

      console.log(category)
      const previousCategory = Array.from(this.inventory?.keys() ?? []).find(cat => cat.id === category.id);

      console.log('DANS INVENTAIRE :', previousCategory)
      if(previousCategory){
        const tempSave = this.inventory?.get(previousCategory);
        this.inventory?.delete(previousCategory);
        this.inventory?.set(category, tempSave ?? []);
      }else{
        this.inventory?.set(category, []);
      }
      //Retrier la Map de l'inventaire pour afficher les catégories correctement
      if(this.inventory){
        this.inventory = new Map([...this.inventory.entries()].sort(
          ([catA], [catB]) => (catA.order ?? 0) - (catB.order ?? 0) 
        ))
      }
    })

    //S'abonner aux évènement de suppression d'un catégorie
        // Si ça arrive : 
    // Redemander l'inventaire à l'API car les équipements seront mis à jours.

    this.inventoryService.categoryRemove$.subscribe((categoryId)=>{
      this.loadInventory();
    })


    // S'abonner aux évènements d'ajout d'équipement. PLUS TARD
      
    }


    openCategoryModal(category? : Category): void{
      console.log("CLIC OK")

      const requestType = category?.id ? 'Modification':'Ajout';


      this.modalService.openModal({
        component: InventoryCategoryModalComponent,
        data: {requestType : requestType, category : category}
      })
    }


    openEquipmentModal(equipment? : Equipment): void{
      this.modalService.openModal({
        component : InventoryEquipmentModalComponent,
        data: {categories : this.rawInventory?.categories}
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
