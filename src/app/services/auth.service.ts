import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../interfaces/UserInterface';
import { RegisterInfos } from '../interfaces/RegisterInfos';
import { RegisterResponse } from '../interfaces/RegisterResponse';
import { ResponseModel } from '../interfaces/ResponseModel';
import { LoginInfos } from '../interfaces/LoginInfos';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private VERIFY_LOGIN : string = 'http://localhost:8000/api/v1/users/verify';

  private LOGIN_URL : string = 'http://localhost:8000/api/v1/auth/login';
  private REGISTER_URL : string = 'http://localhost:8000/api/v1/auth/register';

  private httpClient : HttpClient = inject(HttpClient);

  //undefined si on sait pas encore, null si non, UserInterface si oui.
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);



  logout(){
    localStorage.removeItem('HT_Token');
    this.currentUserSignal.set(null);

    console.log(this.currentUserSignal())
  }

  login(credentials : LoginInfos) : Observable<ResponseModel<UserInterface>>{
    return this.httpClient.post<ResponseModel<UserInterface>>(this.LOGIN_URL, credentials);
  }

  verifyConnected() : Observable<ResponseModel<UserInterface>>{
    return this.httpClient.get<ResponseModel<UserInterface>>(this.VERIFY_LOGIN);
  }

  register(registerInfos : RegisterInfos) : Observable<ResponseModel<RegisterResponse>>{
    return this.httpClient.post<ResponseModel<RegisterResponse>>(this.REGISTER_URL, {
      email : registerInfos.email,
      password : registerInfos.password,
      firstName : registerInfos.firstName,
      lastName : registerInfos.lastName,
    })
  } 

  handleLoginSuccess(userInfos : UserInterface) : void{
    localStorage.setItem('HT_Token', userInfos.jwt);

    this.currentUserSignal.set(userInfos);
  }

}
