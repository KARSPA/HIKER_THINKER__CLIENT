import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit{

  // private authService : AuthService = inject(AuthService);

  isLogged : boolean = false;
  // userInfos : UserInfos|null = null;

  //On s'abonne aux attributs observables de AuthService pour savoir si on est connecté ou non.
  ngOnInit(): void {
    
    // this.authService.isLogged.subscribe(isLogged => {
    //   this.isLogged = isLogged;
    // })

    // this.authService.userInfos.subscribe(userInfos => {
    //   this.userInfos = userInfos;
    // })
    
  }

}
