import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
import { Inventory } from '../../interfaces/Inventory';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hike-inventory',
  imports: [EquipmentCardComponent, DragDropModule],
  templateUrl: './hike-inventory.component.html'
})
export class HikeInventoryComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();

  @Input() inventory : Inventory = {categories: [], equipments : []};
  @Input() hike !: Hike;

  @Output() inventoryChange = new EventEmitter<Inventory>();

  private hikeService : HikeService = inject(HikeService)
  private inventoryService : InventoryService = inject(InventoryService)
  private categoryService : CategoryService = inject(CategoryService)
  private equipmentService : EquipmentService = inject(EquipmentService)
  private modalService : ModalService = inject(ModalService)

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    // console.log("Dans composant inventaire : ",this.inventory)

      //Mettre le mode du service à 'hike'
      this.equipmentService.setMode('hike', this.hike.id ?? '');
      this.categoryService.setMode('hike', this.hike.id ?? '');

      // S'abonner aux évènements d'ajout/modification d'équipement
      this.inventoryService.equipmentChange$.pipe(takeUntil(this.destroy$)).subscribe((equipment)=>{
        this.inventory.equipments.push(equipment)

        const categoryIndex = this.inventory.categories.findIndex(cat => cat.id === equipment.categoryId);
        if(categoryIndex != -1) this.inventory.categories[categoryIndex].accumulatedWeight += equipment.weight;

        this.hike.totalWeight += equipment.weight

        this.notifyInventoryUpdated();
      })

      // S'abonner au retrait d'équipement
      this.inventoryService.equipmentRemove$.pipe(takeUntil(this.destroy$)).subscribe((equipmentId)=>{

        // Supprimer l'équipement de l'inventaire
        const equipmentIndex = this.inventory.equipments.findIndex(eq => eq.id === equipmentId);
        const equipment = this.inventory.equipments[equipmentIndex];
        
        this.inventory.equipments.splice(equipmentIndex, 1)

        //Mettre à jour le poids de sa catégorie, et de la rando
        const categoryIndex = this.inventory.categories.findIndex(cat => cat.id === equipment.categoryId);
        if(categoryIndex != -1) this.inventory.categories[categoryIndex].accumulatedWeight -= equipment.weight;

        this.hike.totalWeight -= equipment.weight;

        this.notifyInventoryUpdated();
      })


      // S'abonner aux évènements d'ajout/modification de catégorie.
      this.hikeService.categoryChange$.pipe(takeUntil(this.destroy$)).subscribe((category)=>{
        let categoryIndex = this.inventory.categories.findIndex(cat => cat.id === category.id);
        if(categoryIndex != -1) this.inventory.categories.splice(categoryIndex, 1, category); // Si modification, on remplace 
        else this.inventory.categories.unshift(category) // SI ajout l'insérer au début (order à 0 à la création)  

        this.notifyInventoryUpdated();
      })

      //S'abonner aux évènement de suppression d'une catégorie
      this.hikeService.categoryRemove$.pipe(takeUntil(this.destroy$)).subscribe((categoryId)=>{

        let addedWeight = 0;

        this.getEquipmentsForCategory(categoryId).forEach(equipment => {
          addedWeight += equipment.weight;
          equipment.categoryId = "DEFAULT";
        })
        this.inventory.categories[this.inventory.categories.length-1].accumulatedWeight += addedWeight; // Ajouter au poids de la catégorie par défaut

        let categoryIndex = this.inventory.categories.findIndex(cat => cat.id === categoryId);
        this.inventory.categories.splice(categoryIndex, 1)

        this.notifyInventoryUpdated();
      })
  }

  getEquipmentsForCategory(categoryId: string): Equipment[] {
    return this.inventory?.equipments
      .filter(eq => eq.categoryId === categoryId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) ?? [];
  }

  moveCategoryUp(categoryId : string){
    if(categoryId === "DEFAULT") return
    // Récupérer l'index actuel de la catégorie et le suivant (-1)
    const categoryIndex = this.inventory.categories.findIndex(cat => cat.id === categoryId);
    //moveItemInArray du CDK avec condition sur l'index (supérieur à 1)
    if(categoryIndex >= 1) moveItemInArray(this.inventory.categories, categoryIndex, categoryIndex-1);

    this.categoryService.modifyCategoriesOrder(this.inventory.categories).pipe(takeUntil(this.destroy$)).subscribe({
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
    this.categoryService.modifyCategoriesOrder(this.inventory.categories).pipe(takeUntil(this.destroy$)).subscribe({
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

    console.log('depuis page : ', category)

    this.modalService.openModal<CategoryModalComponent, CategoryEvent>({
      component: CategoryModalComponent,
      data: {
        requestType : requestType,
        category : category,
        existingCategories : this.inventory.categories}
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
        alreadyInEquipments : this.inventory.equipments,
        categoryIdRef : category.id,
        context : 'Hike'
      }
    })
    .subscribe((refEquipment)=>{
      // console.log(refEquipment)
      this.equipmentService.addHikeEquipment(refEquipment).subscribe({
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
    // ? => Ouvrir une modale de confirmation

    this.equipmentService.removeHikeEquipment(equipment.id).subscribe({
      next:(res)=>{
        // console.log(res)
        this.inventoryService.notifyEquipmentRemove(res.data)
      }
    })
  }


  sendCategoryRequestAndNotify(action : string, category : Category){

    if(action === 'delete'){
      this.categoryService.removeHikeCategory(category).subscribe({
        next:(response)=>{
          this.hikeService.notifyCategoryRemove(category?.id ?? '')
        },
        error:(err)=>{
          console.log(err.error)
        }
      })

    }else{

      let returnObs$;
      if(action === 'create') returnObs$ = this.categoryService.addHikeCategory(category)
      else returnObs$ = this.categoryService.modifyHikeCategory(category)

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

      //Mettre à jour les poids des catégories
      targetCategory.accumulatedWeight += event.item.data.weight;

      const previousCategory = this.inventory.categories.find(cat => cat.id === previousCategoryId)
      if(previousCategory) previousCategory.accumulatedWeight -= event.item.data.weight;

      // Mettre à jour la catégorie de l'équipement déplacé (pour l'affichage)
      const movedEquipment = event.container.data[event.currentIndex];
      movedEquipment.categoryId = targetCategory.id!;
    }


    // Pour la liste d'arrivée, recalculer les positions de chaque équipement
    event.container.data.forEach((eq, index) => eq.position = index);
    
    // Pareil pour celui de départ si différent
    if (event.previousContainer !== event.container) {
      event.previousContainer.data.forEach((eq, index) => eq.position = index);
    }

    // Persister les modifications des catégories affectées :
    this.categoryService.modifyCategoriesOrder(this.inventory.categories).subscribe({
      next:(res)=>{
        // console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    })

    const updatePayload = [
      {categoryId : previousCategoryId, orderedEquipmentIds : this.getEquipmentsForCategory(previousCategoryId).map(eq => eq.id)},
      {categoryId : newCategoryId, orderedEquipmentIds : this.getEquipmentsForCategory(newCategoryId).map(eq => eq.id)},
    ]

    // Faire la requete de modification pour persister les équipements
    this.equipmentService.modifyEquipmentsPosition(updatePayload).subscribe({
      next:(res)=>{
        // console.log(res)
        this.notifyInventoryUpdated();
      },
      error:(err)=>{
        console.log(err)
      }
    });
    
  }


  private notifyInventoryUpdated(){
    this.inventory = {
      categories : [...this.inventory.categories],
      equipments : [...this.inventory.equipments]
    };
    this.inventoryChange.emit(this.inventory)
  }

}
