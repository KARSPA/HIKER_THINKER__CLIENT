import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentCardComponent } from '../equipment-card/equipment-card.component';
import { Hike } from '../../interfaces/hike/Hike';
import { CategoryService } from '../../services/category.service';
import { EquipmentService } from '../../services/equipment.service';
import { ModalService } from '../../services/modal.service';
import { CategoryModalComponent } from '../modals/category-modal/category-modal.component';
import { CategoryEvent } from '../../interfaces/equipment/CategoryEvent';
import { HikeService } from '../../services/hike.service';
import { AddEquipmentModalComponent } from '../add-equipment-modal/add-equipment-modal.component';
import { EquipmentEvent } from '../../interfaces/equipment/EquipmentEvent';
import { RefEquipment } from '../../interfaces/equipment/RefEquipment';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-hike-inventory',
  imports: [EquipmentCardComponent],
  templateUrl: './hike-inventory.component.html'
})
export class HikeInventoryComponent implements OnInit{

  @Input() hikeInventory : Map<Category, Equipment[]>|null = null;
  @Input() hike : Hike|null = null;

  @Output() categoryRemoved = new EventEmitter<void>();

  private categoryService : CategoryService = inject(CategoryService)
  private hikeService : HikeService = inject(HikeService)
  private inventoryService : InventoryService = inject(InventoryService)
  private equipmentService : EquipmentService = inject(EquipmentService)
  private modalService : ModalService = inject(ModalService)


  ngOnInit(): void {

      // S'abonner aux évènements d'ajout/modification d'équipement
      this.inventoryService.equipmentChange$.subscribe((equipment)=>{

        //Lors de l'ajout d'un nouvel équipement :
          //On trouve la catégorie dans lequel il se situe et on l'ajoute aux tableau de la map
        const category = Array.from(this.hikeInventory?.keys() ?? []).find(cat => cat.id === equipment.categoryId);
  
        if (category && this.hikeInventory) {
  
          const currentEquipments = this.hikeInventory.get(category) ?? [];
  
          currentEquipments.push(equipment);
  
          category.accumulatedWeight += equipment.weight
          
          this.hikeInventory.set(category, currentEquipments);
        }
      })

      // S'abonner au retrait d'équipement
      this.inventoryService.equipmentRemove$.subscribe({
        next:(equipmentId)=>{
  
          if (!this.hikeInventory) return;
  
          // Parcourir chaque entrée de la Map (chaque catégorie et son tableau d'équipements)
          this.hikeInventory.forEach((equipments, category) => {
            // Rechercher l'index de l'équipement à supprimer dans le tableau
            const index = equipments.findIndex(eq => eq.id === equipmentId);
            if (index !== -1) {
  
              // Supprimer l'équipement du tableau
              category.accumulatedWeight -= equipments[index].weight;
              equipments.splice(index, 1);
    
            }
          })
        }
      })


      // S'abonner aux évènements d'ajout/modification de catégorie.
      this.hikeService.categoryChange$.subscribe((category)=>{

        const previousCategory = Array.from(this.hikeInventory?.keys() ?? []).find(cat => cat.id === category.id);

        if(previousCategory){
          const tempSave = this.hikeInventory?.get(previousCategory);
          this.hikeInventory?.delete(previousCategory);
          this.hikeInventory?.set(category, tempSave ?? []);
        }else{
          this.hikeInventory?.set(category, []);
        }
        //Retrier la Map de l'inventaire pour afficher les catégories correctement
        if(this.hikeInventory){
          this.hikeInventory = new Map([...this.hikeInventory.entries()].sort(
            ([catA], [catB]) => (catA.order ?? 0) - (catB.order ?? 0) 
          ))
        }
      })

      //S'abonner aux évènement de suppression d'une catégorie
      this.hikeService.categoryRemove$.subscribe((categoryId)=>{
        //Rechercher l'inventaire car mis à jour par l'API
        //Émettre un évènement au parent, qui rechargera l'inventaire :)
        this.categoryRemoved.emit();
      })
  }



  openCategoryModal(category? : Category): void{
  
    const requestType = category?.id ? 'Modification':'Ajout';

    this.modalService.openModal<CategoryModalComponent, CategoryEvent>({
      component: CategoryModalComponent,
      data: {
        requestType : requestType,
        category : category,
        existingCategories : Array.from(this.hikeInventory?.keys() ?? [])}
    })
    .subscribe(({action, category})=>{
      this.sendCategoryRequestAndNotify(action, category);
    });
  }


  openHikeEquipmentModal(category : Category) : void{

    //Ouvrir la modale d'ajout d'équipement pour randonnée et modèles
    //Lui passer les équipements présents dans la randonnée pour filtrer
    //Passer également la catégorie dans lequelle il va ajouter l'équipement (bouton)

    this.modalService.openModal<AddEquipmentModalComponent, RefEquipment>({
      component : AddEquipmentModalComponent,
      data: {
        alreadyInEquipments : Array.from(this.hikeInventory?.values() ?? []).flat(),
        categoryIdRef : category.id,
        context : 'Hike'
      }
    })
    .subscribe((refEquipment)=>{
      this.equipmentService.addHikeEquipment(this.hike?.id!, refEquipment).subscribe({
        next:(res)=>{
          this.inventoryService.notifyEquipmentChange(res.data)
        },
        error : (err)=>{
          console.log(err)
        }
      })
    })
  }

  removeHikeEquipment(equipment : Equipment){
    // Ouvrir une modale de confirmation ??? 

    this.equipmentService.removeHikeEquipment(this.hike?.id!, equipment.id).subscribe({
      next:(res)=>{
        this.inventoryService.notifyEquipmentRemove(res.data)
      }
    })
  }


  sendCategoryRequestAndNotify(action : string, category : Category ){

    if(action === 'delete'){
      this.categoryService.removeHikeCategory(this.hike?.id!, category?.id ?? '').subscribe({
        next:(response)=>{
          this.hikeService.notifyCategoryRemove(category?.id ?? '')
        },
        error:(err)=>{
          console.log(err.error)
        }
      })

    }else{

      let returnObs$;
      if(action === 'create') returnObs$ = this.categoryService.addHikeCategory(this.hike?.id!, category)
      else returnObs$ = this.categoryService.modifyHikeCategory(this.hike?.id!, category)

      returnObs$.subscribe({
        next:(response)=>{
          this.hikeService.notifyCategoryChange(response.data)
        },
        error:(err)=>{
          console.log(err.error)
        }
      })
    }
  }

  toggleCategoryContainer(index : number){

    const content = document.getElementById('equipment-content-'+index);
    const icon = document.querySelector(`#category-toggle-${index} img`);
    const categoryContainer = document.querySelector(`#category-container-${index}`)

    if(!content || !icon || !categoryContainer){
      return;
    }

    if (content && content.style.maxHeight && content.style.maxHeight !== '0px') {

      content.style.maxHeight = '0';
      content.classList.toggle('border-stone-300')
      content.classList.toggle('border')
      
      icon.classList.toggle('rotate-180')
      categoryContainer.classList.toggle('rounded-b-md')

    } else if (content) {
      if(content.scrollHeight !== 0){
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.removeProperty('height')
      }
      else{
        content.style.maxHeight = categoryContainer.scrollHeight + 'px';
        content.style.height = categoryContainer.scrollHeight + 'px';
      }

      content.classList.toggle('border-stone-300')
      content.classList.toggle('border')

      icon.classList.toggle('rotate-180')
      categoryContainer.classList.toggle('rounded-b-md')
    }

  }
}
