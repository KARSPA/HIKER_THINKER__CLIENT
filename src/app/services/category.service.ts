import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../interfaces/equipment/Category';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private INVENTORY_BASE_URL = `${environment.apiUrl}/inventory/categories`;
  private HIKE_BASE_URL = `${environment.apiUrl}/hikes`;


  private httpClient : HttpClient = inject(HttpClient);


  addInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.post<ResponseModel<Category>>(this.INVENTORY_BASE_URL, {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }
  modifyInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.patch<ResponseModel<Category>>(this.INVENTORY_BASE_URL+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order
    })
  }
  removeInventoryCategory(categoryId : string) : Observable<ResponseModel<Category>>{

    return this.httpClient.delete<ResponseModel<Category>>(this.INVENTORY_BASE_URL+`/${categoryId}`);
    
  }


  
  addHikeCategory(hikeId : string, category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.post<ResponseModel<Category>>(this.buildBaseHikeCategoryUrl(hikeId), {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }
  modifyHikeCategory(hikeId : string, category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.patch<ResponseModel<Category>>(this.buildBaseHikeCategoryUrl(hikeId)+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order
    })
  }
  removeHikeCategory(hikeId : string, categoryId : string) : Observable<ResponseModel<Category>>{

    return this.httpClient.delete<ResponseModel<Category>>(this.buildBaseHikeCategoryUrl(hikeId)+`/${categoryId}`);
    
  }


  private buildBaseHikeCategoryUrl(hikeId : string){
    return `${this.HIKE_BASE_URL}/${hikeId}/categories`;
  }

}
