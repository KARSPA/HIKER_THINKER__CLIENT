import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Equipment } from '../interfaces/equipment/Equipment';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private INVENTORY_BASE_URL = "http://localhost:8000/api/v1/inventory/equipments";


  private httpClient : HttpClient = inject(HttpClient);



  addInventoryEquipment(equipmentFormValue : any) : Observable<ResponseModel<Equipment>>{
    console.log(equipmentFormValue);


    return this.httpClient.post<ResponseModel<Equipment>>(this.INVENTORY_BASE_URL, {
      name : equipmentFormValue.name,
      weight : equipmentFormValue.weight,
      description : equipmentFormValue.description,
      brand : equipmentFormValue.brand,
      categoryName : equipmentFormValue.categoryName,
      sourceId : null
    })


  }



}
