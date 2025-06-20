import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentService } from '../../services/equipment.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterLink } from '@angular/router';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { ModalService } from '../../services/modal.service';

import { InventoryService } from '../../services/inventory.service';
import { EquipmentDetails } from '../../interfaces/equipment/EquipmentDetails';
import { StatisticsService } from '../../services/statistics.service';
import { EquipmentStats } from '../../interfaces/statistics/EquipmentStats';
import { BasicLoaderComponent } from '../../_partials/basic-loader/basic-loader.component';
import { NumberFormatPipe } from '../../_helpers/pipes/number-format.pipe';
import { DecimalPipe, Location, PercentPipe } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { Category } from '../../interfaces/equipment/Category';
import { CategoryService } from '../../services/category.service';
import { ModifyEquipmentEvent } from '../../interfaces/equipment/ModifyEquipmentEvent';
import { EquipmentEvent } from '../../interfaces/equipment/EquipmentEvent';
import { ModifyEquipmentModalComponent } from '../../components/modals/modify-equipment-modal/modify-equipment-modal.component';
import { RemoveEquipmentConfirmModalComponent } from '../../components/modals/remove-equipment-confirm-modal/remove-equipment-confirm-modal.component';

@Component({
  selector: 'app-equipment-details',
  imports: [RouterLink, BasicLoaderComponent, DecimalPipe],
  templateUrl: './equipment-details.component.html'
})
export class EquipmentDetailsComponent implements OnInit, OnDestroy{
  
  private destroy$ = new Subject<void>();
  
  private equipmentService = inject(EquipmentService);
  private inventoryService = inject(InventoryService);
  private categoryService = inject(CategoryService);
  private statisticsService = inject(StatisticsService);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  equipment !: EquipmentDetails;
  statistics ?: EquipmentStats;

  categories ?: Category[];

  loaderActive : boolean = true;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    this.equipmentService.setMode('inventory')

    this.categoryService.getCategories().subscribe({
      next : (res) => this.categories = res.data,
      error : (err) => console.error(err)
    })

    // Récupérer l'id depuis l'URL et charger la randonnée
    this.route.paramMap.subscribe(params => {
      const equipmentId = params.get('equipmentId');
      if (equipmentId) {
        this.equipmentService.getEquipmentById(equipmentId).subscribe({
          next : (response)=>{
            this.equipment = response.data
          },
          error: (err)=>{
            console.log(err);
            this.router.navigate(["/error404"], {state: {message: err.error?.message}})
          }
        })

        this.statisticsService.getEquipmentStatistics(equipmentId).subscribe({
          next: (res)=>{
              this.loaderActive = false;
              this.statistics = res.data
          },
          error: (err)=>{
            console.log(err);
          }
        })
      }
    });

    
    // S'abonner à la suppression
    this.inventoryService.equipmentRemove$.pipe(takeUntil(this.destroy$)).subscribe({
      next:(equipmentId)=>{
        this.router.navigate(['/inventory'])
      }
    })
  }

  openRemoveEquipmentConfirmationModal(){
    this.modalService.openModal<RemoveEquipmentConfirmModalComponent, boolean>({
      component: RemoveEquipmentConfirmModalComponent,
      data: {context : 'Inventory'}
    })
    .pipe(confirm => confirm) //On garde que les réponses true (confirmations)
    .subscribe(()=>{
        if (this.equipment) {
          this.equipmentService.removeInventoryEquipment(this.equipment.id)
          .subscribe((response)=>this.inventoryService.notifyEquipmentRemove(response.data))
        }
    })
  }

  openModifyEquipmentModal(){
    this.modalService.openModal<ModifyEquipmentModalComponent, ModifyEquipmentEvent>({
      component: ModifyEquipmentModalComponent,
      data: {categories : this.categories, equipment : this.equipment}
    })
    .subscribe((res)=>{
      this.equipmentService.modifyEquipment(res).subscribe({
        next:(response)=>{
          this.equipment.brand = response.data.brand;
          this.equipment.weight = response.data.weight;
          this.equipment.name = response.data.name;
          this.equipment.description = response.data.description;
        },
        error:(err)=>console.error(err)
      })
    })
  }
  

  goBack(){
    this.location.back();
  }

}
