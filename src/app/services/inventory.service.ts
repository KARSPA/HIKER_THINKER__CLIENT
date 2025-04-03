import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Inventory } from '../interfaces/Inventory';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { Equipment } from '../interfaces/equipment/Equipment';
import { Category } from '../interfaces/equipment/Category';
import { environment } from '../../environments/environment';
import { EquipmentEvent } from '../interfaces/equipment/EquipmentEvent';

@Injectable({
  providedIn: 'root'
})
export class InventoryService{

  private INVENTORY_URL = `${environment.apiUrl}/inventory`;

  // inventorySignal = signal<Inventory>();

  private httpClient : HttpClient = inject(HttpClient);


  private categoryChangeSubject = new Subject<Category>();
  categoryChange$ = this.categoryChangeSubject.asObservable();

  private categoryRemoveSubject = new Subject<string>();
  categoryRemove$ = this.categoryRemoveSubject.asObservable();


  private equipmentChangeSubject = new Subject<Equipment>();
  equipmentChange$ = this.equipmentChangeSubject.asObservable();
  
  private equipmentRemoveSubject = new Subject<string>();
  equipmentRemove$ = this.equipmentRemoveSubject.asObservable();


  getInventory() : Observable<ResponseModel<Inventory>>{
    return this.httpClient.get<ResponseModel<Inventory>>(this.INVENTORY_URL);
  }

  notifyCategoryRemove(categoryId : string){
    this.categoryRemoveSubject.next(categoryId);
  }

  notifyCategoryChange(category : Category){
    this.categoryChangeSubject.next(category);
  }

  notifyEquipmentChange(equipment : Equipment){
    this.equipmentChangeSubject.next(equipment);
  }

  notifyEquipmentRemove(equipmentId : string){
    this.equipmentRemoveSubject.next(equipmentId);
  }

  restructureInventory(inventory : Inventory): Map<Category, Equipment[]>{
    const groupedEquipements = new Map<Category, Equipment[]>();

    inventory.categories.sort((catA, catB)=>((catA.order ?? 0) - (catB.order ?? 0)))

    inventory.categories.forEach(category => {
      groupedEquipements.set(category, []);
    })


    //Parcourir le tableau d'équipement et l'affecter à la catégorie qui correspond.

    inventory.equipments.forEach(equipment => {

      const category = inventory.categories.find(category => equipment.categoryId === category.id);
      if(category){
        const equipments = groupedEquipements.get(category);
        if (equipments) {
          // Trouver l'index où l'équipement doit être inséré (pas besoin de dichotomie car tableau pas grand normalement)
          let insertIndex = equipments.findIndex(eq => (eq.position ?? 0) > (equipment.position ?? 0));
          if (insertIndex === -1) {
            // Aucun équipement avec une position supérieure, on ajoute à la fin
            equipments.push(equipment);
          } else {
            equipments.splice(insertIndex, 0, equipment);
          }
        }
      }

    })

    return groupedEquipements;
  }
}
