import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../interfaces/equipment/Category';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private INVENTORY_BASE_URL = "http://localhost:8000/api/v1/inventory/categories";
  private HIKE_BASE_URL = "http://localhost:8000/api/v1/hikes";


  private httpClient : HttpClient = inject(HttpClient);


  addInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{
    console.log(category)
    return this.httpClient.post<ResponseModel<Category>>(this.INVENTORY_BASE_URL, {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }
  modifyInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{
    console.log(category);

    return this.httpClient.patch<ResponseModel<Category>>(this.INVENTORY_BASE_URL+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order
    })
  }
  removeInventoryCategory(categoryId : string) : Observable<ResponseModel<Category>>{
    console.log('CategoryId (remove) : ', categoryId);

    return this.httpClient.delete<ResponseModel<Category>>(this.INVENTORY_BASE_URL+`/${categoryId}`);
    
  }


  
  addHikeCategory(hikeId : string, category : Category) : Observable<ResponseModel<Category>>{

    console.log(category)
    return this.httpClient.post<ResponseModel<Category>>(this.buildBaseHikeCategoryUrl(hikeId), {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }
  modifyHikeCategory(hikeId : string, category : Category) : Observable<ResponseModel<Category>>{
    console.log(category);

    return this.httpClient.patch<ResponseModel<Category>>(this.buildBaseHikeCategoryUrl(hikeId)+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order
    })
  }
  removeHikeCategory(hikeId : string, categoryId : string) : Observable<ResponseModel<Category>>{
    console.log('CategoryId (remove) : ', categoryId);

    return this.httpClient.delete<ResponseModel<Category>>(this.buildBaseHikeCategoryUrl(hikeId)+`/${categoryId}`);
    
  }


  private buildBaseHikeCategoryUrl(hikeId : string){
    return `${this.HIKE_BASE_URL}/${hikeId}/categories`;
  }

}
