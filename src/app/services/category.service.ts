import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../interfaces/equipment/Category';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private INVENTORY_ADD_URL = "http://localhost:8000/api/v1/inventory/categories";
  private INVENTORY_MODIFY_URL = "http://localhost:8000/api/v1/inventory/categories";


  private httpClient : HttpClient = inject(HttpClient);


  addInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{

    console.log(category)
    return this.httpClient.post<ResponseModel<Category>>(this.INVENTORY_ADD_URL, {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }

  modifyInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{
    console.log(category);

    return this.httpClient.patch<ResponseModel<Category>>(this.INVENTORY_MODIFY_URL+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order
    })
  }

}
