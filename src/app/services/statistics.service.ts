import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStats } from '../interfaces/statistics/UserStats';
import { ResponseModel } from '../interfaces/ResponseModel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private STATS_BASE_URL = `${environment.apiUrl}/statistics`;

  private httpClient : HttpClient = inject(HttpClient);


  getUserStatistics(userId : string) : Observable<ResponseModel<UserStats>>{
    return this.httpClient.get<ResponseModel<UserStats>>(this.STATS_BASE_URL+`/users/${userId}`)
  }

}
