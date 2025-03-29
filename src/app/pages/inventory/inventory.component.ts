import { Component, inject, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../interfaces/Inventory';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { ModalService } from '../../services/modal.service';
import { CategoryModalComponent } from '../../components/modals/category-modal/category-modal.component';
import { InventoryEquipmentModalComponent } from '../../components/inventory-equipment-modal/inventory-equipment-modal.component';
import { ClickStopPropagationDirective } from '../../_helpers/directives/click-stop-propagation.directive';
import { CategoryEvent } from '../../interfaces/equipment/CategoryEvent';
import { CategoryService } from '../../services/category.service';
import { EquipmentService } from '../../services/equipment.service';
import { EquipmentEvent } from '../../interfaces/equipment/EquipmentEvent';
import { AddEquipment } from '../../interfaces/equipment/AddEquipment';
import { RemoveEquipmentConfirmModalComponent } from '../../components/remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';
import { filter } from 'rxjs/internal/operators/filter';
import { BasicLoaderComponent } from "../../_partials/basic-loader/basic-loader.component";

@Component({
  selector: 'app-inventory',
  imports: [EquipmentCardComponent, ClickStopPropagationDirective, BasicLoaderComponent ,DragDropModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit{
  
  private inventoryService : InventoryService = inject(InventoryService)
  private categoryService : CategoryService = inject(CategoryService)
  private equipmentService : EquipmentService = inject(EquipmentService)
  private modalService : ModalService = inject(ModalService);

  inventory : Map<Category, Equipment[]> | null = null;
  rawInventory : Inventory | null = null;

  loaderActive : boolean = true;

  ngOnInit(): void {

    // Charger l'inventaire depuis l'API
    this.loadInventory();


    // S'abonner aux évènements d'ajout/modification de catégorie.
    this.inventoryService.categoryChange$.subscribe((category)=>{

      const previousCategory = Array.from(this.inventory?.keys() ?? []).find(cat => cat.id === category.id);

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

      const requestType = category?.id ? 'Modification':'Ajout';

      this.modalService.openModal<CategoryModalComponent, CategoryEvent>({
        component: CategoryModalComponent,
        data: {
          requestType : requestType,
          category : category,
          existingCategories : this.rawInventory?.categories}
      })
      .subscribe(({action, category})=>{
        this.sendCategoryRequestAndNotify(action, category);
      });
    }


    openEquipmentModal(equipment? : Equipment): void{
      this.modalService.openModal<InventoryEquipmentModalComponent, EquipmentEvent>({
        component : InventoryEquipmentModalComponent,
        data: {categories : Array.from(this.inventory?.keys() ?? [])}
      })
      .subscribe((event)=>{
        this.sendEquipmentRequestAndNotify(event);
      })
    }


    openRemoveEquipmentModal(equipment : Equipment): void{
      this.modalService.openModal<RemoveEquipmentConfirmModalComponent, boolean>({
        component : RemoveEquipmentConfirmModalComponent,
        data : {context : 'Inventory'}
      })
      .pipe(
        filter(confirmed => confirmed)  //On garde que les réponses true (confirmations)
      )
      .subscribe(()=>{
          this.equipmentService.removeInventoryEquipment(equipment.id)
          .subscribe((response)=>this.inventoryService.notifyEquipmentRemove(response.data))
      })

    }


    loadInventory(){

      this.loaderActive = true;


      this.inventoryService.getInventory().subscribe({
        next :(response) => {
          this.loaderActive = false;
          this.rawInventory = response.data;
          this.inventory = this.inventoryService.restructureInventory(response.data);
        },
        error : (error)=> {
          console.log(error)
        }
      })
    }



    sendCategoryRequestAndNotify(action : string, category : Category ){

      if(action === 'delete'){
        this.categoryService.removeInventoryCategory(category?.id ?? '').subscribe({
          next:(response)=>{
            this.inventoryService.notifyCategoryRemove(category?.id ?? '')
          },
          error:(err)=>{
            console.log(err.error)
          }
        })

      }else{

        let returnObs$;
        if(action === 'create') returnObs$ = this.categoryService.addInventoryCategory(category)
        else returnObs$ = this.categoryService.modifyInventoryCategory(category)

        returnObs$.subscribe({
          next:(response)=>{
            this.inventoryService.notifyCategoryChange(response.data)
          },
          error:(err)=>{
            console.log(err.error)
          }
        })
      }
    }

    sendEquipmentRequestAndNotify(evt: EquipmentEvent) {
      switch (evt.action) {
        case 'create':
          this.equipmentService.addInventoryEquipment(evt.equipment).subscribe({
            next: response => this.inventoryService.notifyEquipmentChange(response.data),
            error: err => console.error(err.error)
          });
          break;
    
        // case 'update':
        //   this.equipmentService.modifyInventoryEquipment(evt.equipment).subscribe({
        //     next: response => this.inventoryService.notifyEquipmentChange(response.data),
        //     error: err => console.error(err.error)
        //   });
        //   break;
    
        case 'delete':
          this.equipmentService.removeInventoryEquipment(evt.equipment.id).subscribe({
            next: () => this.inventoryService.notifyEquipmentRemove(evt.equipment.id),
            error: err => console.error(err.error)
          });
          break;
      }
    }
    


    toggleCategoryContainer(id : string|undefined){

      console.log(id)

      const content = document.getElementById('equipment-content-'+id);
      const icon = document.querySelector(`#category-toggle-${id} img`);
      const categoryContainer = document.querySelector(`#category-container-${id}`)

      if(!content || !icon || !categoryContainer){
        return;
      }

      if (content && content.style.maxHeight && content.style.maxHeight !== '0px') { // Si existe + taille max définie + taille max différente de 0, c'est qu'on est ouvert

        //On ferme
        content.style.maxHeight = '0';
        content.style.paddingBottom = '0';
        content.style.paddingTop = '0';
        content.classList.toggle('border-stone-300')
        content.classList.toggle('border')
        
        icon.classList.toggle('rotate-180')
        categoryContainer.classList.toggle('rounded-b-md')

      } else { // On ouvre

        content.style.maxHeight = content.scrollHeight+500 + 'px'; //On ajoute 500 pixels de marge en vertical pour ajouter des éléments.
        content.style.paddingBottom = '20px';
        content.style.paddingTop = '20px';
        
        content.classList.toggle('border-stone-300')
        content.classList.toggle('border')

        icon.classList.toggle('rotate-180')
        categoryContainer.classList.toggle('rounded-b-md')
      }


      //Pour ouvrir : 

      //Enlever la max-height fixée à 0.
      //Mettre la height à fit.




      //Pour fermer : 
      //Mettre la max-height à 0.
      //Mettre la height à 0.

    }


    dropEquipment(event: CdkDragDrop<Category>) {
      console.log(event)

      if (event.previousContainer === event.container) { // Si on change pas de catégorie
        // Bouger dans le tableau d'équipement de la catégorie
        moveItemInArray(this.inventory?.get(event.container.data) ?? [], event.previousIndex, event.currentIndex);

        //Faire prende la bonne taille au container
        //this.setHeightToFitElements(event.container.element.nativeElement, event.item.element.nativeElement)

      } else {
        transferArrayItem(
          this.inventory?.get(event.previousContainer.data) ?? [],
          this.inventory?.get(event.container.data) ?? [],
          event.previousIndex,
          event.currentIndex,
        );

        //this.setHeightToFitElements(event.container.element.nativeElement, event.item.element.nativeElement)

      }

    }

    setHeightToFitElements(element : HTMLElement, item : HTMLElement){

      let heightToFit = Math.max(element.scrollHeight, item.scrollHeight)

      element.style.maxHeight = heightToFit+40 + 'px';
      element.style.height = heightToFit+40 + 'px';
      element.style.paddingBottom = '20px';
      element.style.paddingTop = '20px';
    }


    notCategoryPredicate(item: CdkDrag<object>) : boolean{

      console.log(item)

      return false;

    }
}
