import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
import { RegisterInfos } from '../../interfaces/auth/RegisterInfos';
import { Router } from '@angular/router';
import { samePasswordValidator } from '../../_helpers/validators/same-password';
import { HttpClient } from '@angular/common/http';
import { RegisterResponse } from '../../interfaces/auth/RegisterResponse';
import { ResponseModel } from '../../interfaces/ResponseModel';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private router : Router = inject(Router);

  private authService : AuthService = inject(AuthService);

  registerHttpError : string = '';

  hasBeenSubmitted : boolean = false;

  registerForm: FormGroup = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    password : new FormControl('',Validators.required),
    confirmPassword : new FormControl('',Validators.required),
    firstName : new FormControl('',[Validators.required, Validators.minLength(1)]),
    lastName : new FormControl('',[Validators.required, Validators.minLength(1)])
  },{validators : samePasswordValidator})


  get firstName(){
    return this.registerForm.get('firstName');
  }
  get lastName(){
    return this.registerForm.get('lastName');
  }
  get email(){
    return this.registerForm.get('email');
  }
  get password(){
    return this.registerForm.get('password');
  }
  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() : void{
    console.log(this.registerForm);

    if(this.registerForm.invalid){
      this.hasBeenSubmitted = true;
    }

    if(this.registerForm.valid){
      this.hasBeenSubmitted = false;

      const registerInfos : RegisterInfos = this.registerForm.value;

      console.log(registerInfos);

     // Check si les mots de passes sont égaux.
      if(registerInfos.password === registerInfos.confirmPassword) {
        
        this.authService.register(registerInfos).subscribe({
          next: (value) => {
            console.log(value);
            this.router.navigate(['login']);
          },
          error : error => {
            console.log(error);
            this.registerHttpError = "Erreur lors de l'enregistrement. Pseudo ou email non disponible."
          }
        })
      }
    }
  }


  getErrorMessage(reason : string, length : number = 0) : string{

    let errorMessage : string = '';

    switch(reason){
      case 'required':
        errorMessage = 'Champ requis.';
        break;
      case 'minlength':
        errorMessage = `Au moins ${length} caractères.`;
        break;
      case 'email':
        errorMessage = 'Entrez un email valide.';
        break;
      case 'notSamePassword':
        errorMessage = 'Les deux mots de passe ne sont pas égaux.';
        break;

    }

    return errorMessage;
  }

}
