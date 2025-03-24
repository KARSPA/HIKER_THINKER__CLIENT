import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ProfileModalComponent } from '../../components/modals/profile-modal/profile-modal.component';
import { ModifyInfos } from '../../interfaces/auth/ModifyInfos';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

    protected authService : AuthService = inject(AuthService);
    private modalService : ModalService = inject(ModalService);

    httpError : string = '';

    openModifyUserModal(){
      this.modalService.openModal<ProfileModalComponent, ModifyInfos>({
        component : ProfileModalComponent,
        data: {user : this.authService.currentUserSignal()}
      })
      .subscribe((newInfos)=>{

        console.log(newInfos)

        this.authService.modifyUser(newInfos).subscribe({
          next:(res)=>{
            this.httpError = '';
            this.authService.changeUserInfos(res.data)
            this.modalService.closeModal()
          },
          error:(err)=>{
            console.log(err)
            this.httpError = err.error.message;
            this.modalService.closeModal()
          }
        })
      })
    }
  

}
