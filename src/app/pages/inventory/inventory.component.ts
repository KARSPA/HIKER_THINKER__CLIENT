import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../interfaces/Inventory';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { ModalService } from '../../services/modal.service';
import { CategoryModalComponent } from '../../components/modals/category-modal/category-modal.component';
import { InventoryEquipmentModalComponent } from '../../components/modals/inventory-equipment-modal/inventory-equipment-modal.component';
import { ClickStopPropagationDirective } from '../../_helpers/directives/click-stop-propagation.directive';
import { CategoryEvent } from '../../interfaces/equipment/CategoryEvent';
import { CategoryService } from '../../services/category.service';
import { EquipmentService } from '../../services/equipment.service';
import { EquipmentEvent } from '../../interfaces/equipment/EquipmentEvent';
import { AddEquipment } from '../../interfaces/equipment/AddEquipment';
import { RemoveEquipmentConfirmModalComponent } from '../../components/modals/remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';
import { filter } from 'rxjs/internal/operators/filter';
import { BasicLoaderComponent } from "../../_partials/basic-loader/basic-loader.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory',
  imports: [EquipmentCardComponent, ClickStopPropagationDirective, BasicLoaderComponent ,DragDropModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();
  
  private inventoryService : InventoryService = inject(InventoryService)
  private categoryService : CategoryService = inject(CategoryService)
  private equipmentService : EquipmentService = inject(EquipmentService)
  private modalService : ModalService = inject(ModalService);

  inventory : Inventory = {categories: [], equipments : []};

  loaderActive : boolean = true;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    // Charger l'inventaire depuis l'API
    this.loadInventory();
    
    //Mettre le mode du service
    this.equipmentService.setMode('inventory')
    this.categoryService.setMode('inventory')

    // S'abonner aux évènements d'ajout/modification de catégorie.
    this.inventoryService.categoryChange$.pipe(takeUntil(this.destroy$)).subscribe((category)=>{ // Le réindexage à la création et mouvement est gérer ailleurs.
      let categoryIndex = this.inventory.categories.findIndex(cat => cat.id === category.id);
      if(categoryIndex != -1) this.inventory.categories.splice(categoryIndex, 1, category); // Si modification, on remplace 
      else this.inventory.categories.unshift(category) // SI ajout l'insérer au début (order à 0 à la création)

      // this.categoryService.addCategoriesUpdate(this.inventory.categories) // Notifier pour persister l'ordre

    })


    // Mettre les équipements de cette catégorie (avec ce categoryId) dans la catégorie "DEFAULT"
    // Supprimer la catégorie de la liste ...
    this.inventoryService.categoryRemove$.pipe(takeUntil(this.destroy$)).subscribe((categoryId)=>{
      this.getEquipmentsForCategory(categoryId).forEach(equipment => equipment.categoryId = "DEFAULT")

      let categoryIndex = this.inventory.categories.findIndex(cat => cat.id === categoryId);
      this.inventory.categories.splice(categoryIndex, 1)
    })


    // S'abonner aux évènements d'ajout/modification d'équipement.
    this.inventoryService.equipmentChange$.pipe(takeUntil(this.destroy$)).subscribe((equipment)=>{
      // TODO : Différencier un ajout d'une modification d'équipement ???
      //Ajout
      this.inventory.equipments.push(equipment)

    })

    //S'abonner aux évènement de suppression d'équipements
    this.inventoryService.equipmentRemove$.pipe(takeUntil(this.destroy$)).subscribe((equipmentId)=>{
      const equipmentIndex = this.inventory.equipments.findIndex(eq => eq.id === equipmentId);
      this.inventory.equipments.splice(equipmentIndex, 1)
    })

  }

  moveCategoryUp(categoryId : string){
    if(categoryId === "DEFAULT") return
    // Récupérer l'index actuel de la catégorie et le suivant (-1)
    const categoryIndex = this.inventory.categories.findIndex(cat => cat.id === categoryId);
    //moveItemInArray du CDK avec condition sur l'index (supérieur à 1)
    if(categoryIndex >= 1) moveItemInArray(this.inventory.categories, categoryIndex, categoryIndex-1);

    // this.categoryService.addCategoriesUpdate(this.inventory.categories) // Persister changement
    this.categoryService.modifyCategoriesOrder(this.inventory.categories).subscribe({
      next:(res)=>{
        // console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    });

  }
  moveCategoryDown(categoryId : string, ){
    if(categoryId === "DEFAULT") return
    // Récupérer l'index actuel de la catégorie et le suivant (-1)
    const categoryIndex = this.inventory.categories.findIndex(cat => cat.id === categoryId);
    //moveItemInArray du CDK avec condition sur l'index (pas dernier ou avant dernier (DEFAULT est toujours dernier))
    if(categoryIndex < this.inventory.categories.length-2) moveItemInArray(this.inventory.categories, categoryIndex, categoryIndex+1);

    // this.categoryService.addCategoriesUpdate(this.inventory.categories) // Persister changement
    this.categoryService.modifyCategoriesOrder(this.inventory.categories).subscribe({
      next:(res)=>{
        // console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    });
  }


  openCategoryModal(category? : Category): void{

    const requestType = category?.id ? 'Modification':'Ajout';

    this.modalService.openModal<CategoryModalComponent, CategoryEvent>({
      component: CategoryModalComponent,
      data: {
        requestType : requestType,
        category : category,
        existingCategories : this.inventory?.categories}
    })
    .subscribe(({action, category})=>{
      this.sendCategoryRequestAndNotify(action, category);
    });
  }


  openEquipmentModal(equipment? : Equipment): void{
    this.modalService.openModal<InventoryEquipmentModalComponent, EquipmentEvent>({
      component : InventoryEquipmentModalComponent,
      data: {categories : Array.from(this.inventory.categories)}
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
        this.inventory = {
          categories : response.data.categories.sort((catA, catB)=>(catA.order)-(catB.order)),
          equipments : response.data.equipments
        };
      },
      error : (error)=> {
        console.log(error)
      }
    })
  }



  sendCategoryRequestAndNotify(action : string, category : Category ){

    if(action === 'delete'){
      this.categoryService.removeInventoryCategory(category).subscribe({
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
          next: response => {
            // console.log(evt.equipment, response.data)
            this.inventoryService.notifyEquipmentChange(response.data)},
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
      content.classList.toggle('border')
      
      icon.classList.toggle('rotate-180')
      categoryContainer.classList.toggle('rounded-b-md')

    } else { // On ouvre

      content.style.maxHeight = content.scrollHeight+500 + 'px'; //On ajoute 500 pixels de marge en vertical pour ajouter des éléments.
      content.style.paddingBottom = '20px';
      content.style.paddingTop = '20px';
      content.classList.toggle('border')

      icon.classList.toggle('rotate-180')
      categoryContainer.classList.toggle('rounded-b-md')
    }
  }

  getEquipmentsForCategory(categoryId: string): Equipment[] {
    return this.inventory?.equipments
      .filter(eq => eq.categoryId === categoryId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) ?? [];
  }
  


  dropEquipment(event: CdkDragDrop<Equipment[], Equipment[], Equipment>, targetCategory : Category) { //<type_liste_départ, type_liste_arrivée, type_objet_transféré>

    const previousCategoryId = event.item.data.categoryId;
    const newCategoryId = targetCategory.id!;

    if (event.previousContainer === event.container) { // Si on change pas de catégorie
      if(event.previousIndex !== event.currentIndex){ // Si pas de changement, pas besoin de modifier et notifier le service
        // Bouger dans le tableau d'équipement de la catégorie
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }else{ //Si équipement placé au même endroit (pas bougé), on quitte, rien besoin de modifier.
        return
      }
    } else { //Si on change de catégorie, on bouge et notifie le service
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Mettre à jour la catégorie de l'équipement déplacé (pour l'affichage et la persistence)
      event.item.data.categoryId = targetCategory.id!;
    }

    // Recalculer les positions de chaque équipement
    event.container.data.forEach((eq, index) => eq.position = index);
    if (event.previousContainer !== event.container) {
      event.previousContainer.data.forEach((eq, index) => eq.position = index);
    }

    // Demander au service d'envoyer le payload à l'API pour persister les modifs;
    // console.log(event.previousContainer.data, event.container.data, targetCategory )

    // Mettre à jour l'ancienne et nouvelle catégorie
    const updatePayload = [
      {categoryId : previousCategoryId, orderedEquipmentIds : this.getEquipmentsForCategory(previousCategoryId).map(eq => eq.id)},
      {categoryId : newCategoryId, orderedEquipmentIds : this.getEquipmentsForCategory(newCategoryId).map(eq => eq.id)},
    ]

    // Faire la requete de modification pour persister
    this.equipmentService.modifyEquipmentsPosition(updatePayload).subscribe({
      next:(res)=>{
        // console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    });
  }

}
