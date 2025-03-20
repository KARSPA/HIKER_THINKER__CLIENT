import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginInfos } from '../../interfaces/auth/LoginInfos';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private router : Router = inject(Router);
  private authService : AuthService = inject(AuthService);

  loginError : string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  onSubmit(): void {
    if(this.loginForm.valid) {
      // check if exist
      const credentials : LoginInfos = this.loginForm.value

      this.authService.login(credentials).subscribe({
        next: (value) => {
          this.authService.handleLoginSuccess(value.data);
          this.router.navigate(['home'])
        },
        error : error => {
          console.log(error)
          this.loginError = error.error.message
        }
      })
    }
  }

}
