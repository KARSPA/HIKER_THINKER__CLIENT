import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseModel } from '../interfaces/ResponseModel';
import { Hike } from '../interfaces/hike/Hike';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HikeService {

  private HIKES_URL = "http://localhost:8000/api/v1/hikes";


  private httpClient : HttpClient = inject(HttpClient);



  getHikes() : Observable<ResponseModel<Hike[]>>{
    return this.httpClient.get<ResponseModel<Hike[]>>(this.HIKES_URL)
  }


}
