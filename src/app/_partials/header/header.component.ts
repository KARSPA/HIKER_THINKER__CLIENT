import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent{

  protected authService : AuthService = inject(AuthService);

  appLogoUrl : string = 'assets/logoApp.png';
  isLogged = computed(() => {
    const currentUser = this.authService.currentUserSignal();
    return !(currentUser === null || currentUser === undefined);
  });

  testSignal(){
    console.log(this.authService.currentUserSignal())
  }

}
