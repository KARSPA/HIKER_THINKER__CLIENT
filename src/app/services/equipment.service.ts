import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Equipment } from '../interfaces/equipment/Equipment';
import { interval, Observable, Subject } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { RefEquipment } from '../interfaces/equipment/RefEquipment';
import { environment } from '../../environments/environment';
import { EquipmentsOrderUpdate } from '../interfaces/equipment/EquipmentOrderUpdate';
import { Category } from '../interfaces/equipment/Category';
import { EquipmentDetails } from '../interfaces/equipment/EquipmentDetails';
import { ModifyEquipmentEvent } from '../interfaces/equipment/ModifyEquipmentEvent';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private mode: 'inventory' | 'hike' | 'model' = 'inventory';

  
  //url des requetes qui sera configuré via le mode lors de l'instanciation des composants l'utilisant
  private url: string = `${environment.apiUrl}`;
  
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
    // Par défaut, on initialise en mode inventory (sans identifiant)
    this.setMode('inventory');
  }

  /**
   * Configure le mode du service.
   * @param mode - Le mode ('inventory', 'hike' ou 'model')
   * @param contextId - L'identifiant contextuel (par exemple, le hikeId ou modelId) si nécessaire.
   */
  setMode(mode: 'inventory' | 'hike' | 'model', contextId?: string): void {
    this.mode = mode;

    switch (mode) {
      case 'inventory':
        this.url = `${environment.apiUrl}/inventory/equipments`;
        break;
      case 'hike':
        if (!contextId) {
          throw new Error("Un identifiant de randonnée (hikeId) est requis pour le mode 'hike'");
        }
        this.url = `${environment.apiUrl}/hikes/${contextId}/equipments`;
        break;
      case 'model':
        if (!contextId) {
          throw new Error("Un identifiant de modèle (modelId) est requis pour le mode 'model'");
        }
        this.url = `${environment.apiUrl}/models/${contextId}/equipments`;
        break;
    }
  }


  getEquipmentById(equipmentId : string) : Observable<ResponseModel<EquipmentDetails>>{
    return this.httpClient.get<ResponseModel<EquipmentDetails>>(this.url+`/${equipmentId}`)
  }


  addInventoryEquipment(equipmentFormValue : any) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.post<ResponseModel<Equipment>>(this.url, {
      name : equipmentFormValue.name,
      weight : equipmentFormValue.weight,
      description : equipmentFormValue.description,
      brand : equipmentFormValue.brand,
      categoryName : equipmentFormValue.categoryName,
      sourceId : equipmentFormValue.sourceId
    })
  }

  modifyEquipment(modifyEquipmentValue : ModifyEquipmentEvent){
    return this.httpClient.patch<ResponseModel<Equipment>>(this.url+`/${modifyEquipmentValue.equipment.id}`, modifyEquipmentValue)
  }

  removeInventoryEquipment(equipmentId : string) : Observable<ResponseModel<string>>{

    return this.httpClient.delete<ResponseModel<string>>(this.url+`/${equipmentId}`)
  }


  addHikeEquipment(refEquipment : RefEquipment) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.post<ResponseModel<Equipment>>(this.url, {...refEquipment})
  }

  removeHikeEquipment(equipmentId : string) : Observable<ResponseModel<string>>{
    return this.httpClient.delete<ResponseModel<string>>(this.url+`/${equipmentId}`)
  }


  modifyEquipmentsPosition(payload : EquipmentsOrderUpdate[]) {
    // console.log(payload)
    return this.httpClient.patch(`${this.url}`, payload);
  }

}


