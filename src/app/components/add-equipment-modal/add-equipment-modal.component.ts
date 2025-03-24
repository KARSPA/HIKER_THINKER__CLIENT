import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { Category } from '../../interfaces/equipment/Category';
import { InventoryService } from '../../services/inventory.service';
import { RefEquipment } from '../../interfaces/equipment/RefEquipment';
import { Inventory } from '../../interfaces/Inventory';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-equipment-modal',
  imports: [RouterLink],
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

  
  filteredEquipments : Equipment[] = [];

  private inventoryService : InventoryService = inject(InventoryService);


  ngOnInit(): void {
      //Chercher l'inventaire de l'utilisateur
      //Filtrer les équipements récupérés en enlevant ceux déjà présents dans la rando ou modèle
      this.loadAndFilterInventory();

      // Abonnement aux changements d'équipements pour actualiser la liste
      this.inventoryService.equipmentChange$.subscribe((newEquip) => {
        this.filteredEquipments = this.filteredEquipments.filter(
          eq => eq.id !== newEquip.id
        );
      });
  }

  onAddClick(equipmentId : string){

    const payload : RefEquipment = {
      categoryId : this.categoryIdRef,
      sourceId : equipmentId
    }

    this.result.emit(payload)
  }

  loadAndFilterInventory(){
    this.inventoryService.getInventory().subscribe({
      next :(response) => {
        this.filteredEquipments = response.data.equipments.filter(eq => {
          return !this.alreadyInEquipments.some(existingEq => existingEq.id === eq.id) // On ne garde que ceux qui ne sont pas dans le tableaux des équipements déja présents
        });
        // console.log('Équipements inventaire : ',response.data.equipments)
        // console.log('Après filtre : ', this.filteredEquipments)
      },
      error : (error)=> {
        console.log(error)
      }
    })
  }

}
