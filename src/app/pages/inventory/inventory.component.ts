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


    // S'abonner aux évènements d'ajout/modification d'équipement.
    this.inventoryService.equipmentChange$.subscribe((equipment)=>{

      //Lors de l'ajout d'un nouvel équipement :
        //On trouve la catégorie dans lequel il se situe et on l'ajoute aux tableau de la map
      const category = Array.from(this.inventory?.keys() ?? []).find(cat => cat.id === equipment.categoryId);

      if (category && this.inventory) {

        const currentEquipments = this.inventory.get(category) ?? [];

        currentEquipments.push(equipment);

        this.inventory.set(category, currentEquipments);
      }
    })

    //S'abonner aux évènement de suppression d'équipements
    this.inventoryService.equipmentRemove$.subscribe({
      next:(equipmentId)=>{

        if (!this.inventory) return;

        // Parcourir chaque entrée de la Map (chaque catégorie et son tableau d'équipements)
        this.inventory.forEach((equipments, category) => {
          // Rechercher l'index de l'équipement à supprimer dans le tableau
          const index = equipments.findIndex(eq => eq.id === equipmentId);
          if (index !== -1) {

            // Supprimer l'équipement du tableau
            equipments.splice(index, 1);
  
          }
        })
      }
    })

      
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


    toggleCategoryContainer(index : number){

      const content = document.getElementById('equipment-content-'+index);
      const icon = document.querySelector(`#category-toggle-${index} img`);

      const categoryContainer = document.querySelector(`#category-container-${index}`)


      console.log(content, icon)

      if(!content || !icon || !categoryContainer){
        return;
      }

      if (content && content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0';
        content.classList.toggle('border')
        content.classList.toggle('border-stone-300')
        
        icon.classList.toggle('rotate-180')
        categoryContainer.classList.toggle('rounded-b-md')
      } else if (content) {
        console.log(content.scrollHeight)

        if(content.scrollHeight !== 0){
          content.style.maxHeight = content.scrollHeight + 'px';
        }
        else{
          content.style.maxHeight = categoryContainer.scrollHeight + 'px';
          content.style.height = categoryContainer.scrollHeight + 'px';
        }
        content.classList.toggle('border')
        content.classList.toggle('border-stone-300')

        icon.classList.toggle('rotate-180')
        categoryContainer.classList.toggle('rounded-b-md')
      }

    }

}
