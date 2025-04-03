import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../interfaces/auth/UserInterface';
import { RegisterInfos } from '../interfaces/auth/RegisterInfos';
import { RegisterResponse } from '../interfaces/auth/RegisterResponse';
import { ResponseModel } from '../interfaces/ResponseModel';
import { LoginInfos } from '../interfaces/auth/LoginInfos';
import { ModifyInfos } from '../interfaces/auth/ModifyInfos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private MODIFY_USER : string = `${environment.apiUrl}/users`;
  private VERIFY_LOGIN : string = this.MODIFY_USER+`/verify`;

  private LOGIN_URL : string = `${environment.apiUrl}/auth/login`;
  private REGISTER_URL : string = `${environment.apiUrl}/auth/register`;

  private httpClient : HttpClient = inject(HttpClient);

  //undefined si on sait pas encore, null si non, UserInterface si oui.
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);
  
  isLogged = computed(() => {
    const currentUser = this.currentUserSignal();
    return !(currentUser === null || currentUser === undefined);
  });


  logout(){
    localStorage.removeItem('HT_Token');
    this.currentUserSignal.set(null);
  }

  login(credentials : LoginInfos) : Observable<ResponseModel<UserInterface>>{
    // Vérifier si un token est présent et, le cas échéant, le supprimer
    const token = localStorage.getItem('HT_Token');
    if (token) {
      localStorage.removeItem('HT_Token');
    }
    return this.httpClient.post<ResponseModel<UserInterface>>(this.LOGIN_URL, credentials);
  }

  verifyConnected() : Observable<ResponseModel<UserInterface>>{
    return this.httpClient.get<ResponseModel<UserInterface>>(this.VERIFY_LOGIN);
  }

  modifyUser(modifyInfos : ModifyInfos) : Observable<ResponseModel<UserInterface>>{
    return this.httpClient.patch<ResponseModel<UserInterface>>(this.MODIFY_USER+`/${this.currentUserSignal()?.userId}`, {...modifyInfos})
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

  changeUserInfos(userInfos : UserInterface) : void{
    this.currentUserSignal.set(userInfos);
  }

}
