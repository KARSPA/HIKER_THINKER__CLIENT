import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

    protected authService : AuthService = inject(AuthService);
  

}
