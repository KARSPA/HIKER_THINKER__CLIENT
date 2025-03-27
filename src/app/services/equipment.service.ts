import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Equipment } from '../interfaces/equipment/Equipment';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { RefEquipment } from '../interfaces/equipment/RefEquipment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private INVENTORY_EQUIP_BASE_URL = `${environment.apiUrl}/inventory/equipments`;
  private HIKE_BASE_URL = `${environment.apiUrl}/hikes`;



  private httpClient : HttpClient = inject(HttpClient);


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



}
