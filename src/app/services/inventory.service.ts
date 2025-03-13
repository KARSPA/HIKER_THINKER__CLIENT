import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Inventory } from '../interfaces/Inventory';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { Equipment } from '../interfaces/equipment/Equipment';
import { Category } from '../interfaces/equipment/Category';

@Injectable({
  providedIn: 'root'
})
export class InventoryService{

  private INVENTORY_URL = "http://localhost:8000/api/v1/inventory";

  // inventorySignal = signal<Inventory>();

  private httpClient : HttpClient = inject(HttpClient);
  


  getInventory() : Observable<ResponseModel<Inventory>>{
    return this.httpClient.get<ResponseModel<Inventory>>(this.INVENTORY_URL);
  }



  restructureInventory(inventory : Inventory): Map<Category, Equipment[]>{
    const groupedEquipements = new Map<Category, Equipment[]>();


    inventory.categories.forEach(category => {
      groupedEquipements.set(category, []);
    })


    //Parcourir le tableau d'équipement et l'affecter à la catégorie qui correspond.

    inventory.equipments.forEach(equipment => {

      const category = inventory.categories.find(category => equipment.categoryId === category.id);
      if(category){
          groupedEquipements.get(category)?.push(equipment); 
      }

    })

    return groupedEquipements;
  }
}
