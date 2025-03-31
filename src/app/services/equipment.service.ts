import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Equipment } from '../interfaces/equipment/Equipment';
import { interval, Observable, Subject } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { RefEquipment } from '../interfaces/equipment/RefEquipment';
import { environment } from '../../environments/environment';
import { EquipmentsOrderUpdate } from '../interfaces/equipment/EquipmentUpdate';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private INVENTORY_EQUIP_BASE_URL = `${environment.apiUrl}/inventory/equipments`;
  private HIKE_BASE_URL = `${environment.apiUrl}/hikes`;

  private httpClient : HttpClient = inject(HttpClient);


  private updateBuffer = new Map<string, string[]>();
  private updateInterval = 10000; // 10 secondes
  private updateSubject = new Subject<void>();

  constructor(){
    //Défini un interval pour faire les requetes de modifications d'équipements de manière répétée
    interval(this.updateInterval).subscribe(()=>this.flushEquipmentUpdates());
  }

  getEquipmentById(equipmentId : string) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.get<ResponseModel<Equipment>>(this.INVENTORY_EQUIP_BASE_URL+`/${equipmentId}`)
  }



  addInventoryEquipment(equipmentFormValue : any) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.post<ResponseModel<Equipment>>(this.INVENTORY_EQUIP_BASE_URL, {
      name : equipmentFormValue.name,
      weight : equipmentFormValue.weight,
      description : equipmentFormValue.description,
      brand : equipmentFormValue.brand,
      categoryName : equipmentFormValue.categoryName,
      sourceId : null
    })
  }

  removeInventoryEquipment(equipmentId : string) : Observable<ResponseModel<string>>{

    return this.httpClient.delete<ResponseModel<string>>(this.INVENTORY_EQUIP_BASE_URL+`/${equipmentId}`)
  }


  addHikeEquipment(hikeId : string, refEquipment : RefEquipment) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.post<ResponseModel<Equipment>>(this.buildBaseHikeEquipmentUrl(hikeId), {...refEquipment})
  }

  removeHikeEquipment(hikeId : string, equipmentId : string) : Observable<ResponseModel<string>>{
    return this.httpClient.delete<ResponseModel<string>>(this.buildBaseHikeEquipmentUrl(hikeId)+`/${equipmentId}`)
  }


  private buildBaseHikeEquipmentUrl(hikeId : string){
    return `${this.HIKE_BASE_URL}/${hikeId}/equipments`;
  }


  /* SECTION DES MODIFS DE POSITIONS ET CATÉGORIES D'ÉQUIPEMENT */

  // Ajoute ou met à jour une modification dans le buffer
  addEquipmentUpdate(update: EquipmentsOrderUpdate): void {
    this.updateBuffer.set(update.categoryId ?? '', update.orderedIds);

    console.log(this.updateBuffer)
  }



  flushEquipmentUpdates() : void{
    console.log('UPDATE : ')
    if(this.updateBuffer.size === 0) return // Si on a rien a modifier, on modifie rien ....

    const payload = Array.from(this.updateBuffer.entries()).map(([categoryId, newPositions])=>({
      categoryId,
      orderedEquipmentIds : newPositions
    }))

    console.log(payload)

    this.updateBuffer.clear(); // On vide la map de modifications.

    //On fait l'appel API
    this.httpClient.patch(`${this.INVENTORY_EQUIP_BASE_URL}`, payload).subscribe({
      next : (response)=>{
        console.log(response)
      },
      error: (err)=>{
        console.error(err.error.message)
      }
    })
  }

  // Permet de forcer l'envoi (si jamais on quitte un composant avant l'envoi des modifs : avec ngOnDestroy ...)
  forceFlush(): void {
    this.flushEquipmentUpdates();
  }


}
