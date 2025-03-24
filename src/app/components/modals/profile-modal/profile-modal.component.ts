import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInterface } from '../../../interfaces/auth/UserInterface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModifyInfos } from '../../../interfaces/auth/ModifyInfos';

@Component({
  selector: 'app-profile-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-modal.component.html'
})
export class ProfileModalComponent implements OnInit{

  @Input() user : UserInterface|null = null;

  @Output() result = new EventEmitter<ModifyInfos>();

  hasBeenSubmitted : boolean = false;

  userForm: FormGroup = new FormGroup({
    password : new FormControl('',Validators.required),
    newPassword : new FormControl(''),
    firstName : new FormControl('',[Validators.required, Validators.minLength(1)]),
    lastName : new FormControl('',[Validators.required, Validators.minLength(1)])
  })

  ngOnInit(): void {
    this.userForm.patchValue({
      firstName : this.user?.firstName,
      lastName : this.user?.lastName,
    })
  }


  onSubmit(){

    if(this.userForm.invalid){
      this.hasBeenSubmitted = true;
      return
    }

    if(this.userForm.valid){

      const formValue = this.userForm.value;

      const payload : ModifyInfos = {
        firstName : formValue.firstName,
        lastName : formValue.lastName,
        password : formValue.password,
        newPassword : formValue.newPassword
      }

      this.result.emit(payload)
    }
  }


  get firstName(){
    return this.userForm.get('firstName');
  }
  get lastName(){
    return this.userForm.get('lastName');
  }
  get password(){
    return this.userForm.get('password');
  }
  get newPassword(){
    return this.userForm.get('newPassword');
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
      case 'requiredPassword':
        errorMessage = 'Le mot de passe est requis pour valider les changements.';
        break;

    }

    return errorMessage;
  }
}
