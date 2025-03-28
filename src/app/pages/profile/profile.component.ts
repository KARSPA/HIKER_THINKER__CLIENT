import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ProfileModalComponent } from '../../components/modals/profile-modal/profile-modal.component';
import { ModifyInfos } from '../../interfaces/auth/ModifyInfos';
import { StatisticsService } from '../../services/statistics.service';
import { UserStats } from '../../interfaces/statistics/UserStats';
import { DecimalPipe } from '@angular/common';
import { BasicLoaderComponent } from '../../_partials/basic-loader/basic-loader.component';

@Component({
  selector: 'app-profile',
  imports: [DecimalPipe, BasicLoaderComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{
    

    protected authService : AuthService = inject(AuthService);
    private statisticsService : StatisticsService = inject(StatisticsService);
    private modalService : ModalService = inject(ModalService);

    httpError : string = '';

    userStats : UserStats|null = null;

    loaderActive : boolean = true;


    ngOnInit(): void {
    this.statisticsService.getUserStatistics(this.authService.currentUserSignal()?.userId ?? '').subscribe({
      next : (res)=>{
        this.loaderActive = false;
          this.userStats = res.data
        },
        error:(err)=>{
          console.log(err)
        }
      })
    }

    openModifyUserModal(){
      this.modalService.openModal<ProfileModalComponent, ModifyInfos>({
        component : ProfileModalComponent,
        data: {user : this.authService.currentUserSignal()}
      })
      .subscribe((newInfos)=>{
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
