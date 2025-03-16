import { Component, inject, Input, OnInit } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentService } from '../../services/equipment.service';
import { Router } from '@angular/router';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';

@Component({
  selector: 'app-equipment-details',
  imports: [EquipmentCardComponent],
  templateUrl: './equipment-details.component.html'
})
export class EquipmentDetailsComponent {

  private equipmentService : EquipmentService = inject(EquipmentService);
  private router : Router = inject(Router);

  equipment !: Equipment;

  @Input()
  set equipmentId(equipmentId : string){
    this.equipmentService.getEquipmentById(equipmentId).subscribe({
      next : (response)=>{
        this.equipment = response.data
      },
      error: (err)=>{
        console.log(err);
        this.router.navigate(["/error404"], {state: {message: err.error.message}})
      }
    });
  }
  

}
