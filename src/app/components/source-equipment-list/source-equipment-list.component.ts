import { httpResource } from '@angular/common/http';
import { Component, computed, inject, Input, OnInit, Output, output, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../interfaces/ResponseModel';
import { SourceEquipmentCardComponent } from "../source-equipment-card/source-equipment-card.component";
import { ReactiveFormsModule } from '@angular/forms';
import { ListSourceEquipmentResponse } from '../../interfaces/equipment/sources/ListSourceEquipmentResponse';
import { SourceEquipmentStore } from '../../services/stores/source-equipment-store';
import { EquipmentCardComponent } from "../equipment-card/equipment-card.component";
import { Equipment } from '../../interfaces/equipment/Equipment';
import { SourceEquipment } from '../../interfaces/equipment/sources/SourceEquipment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-source-equipment-list',
  imports: [SourceEquipmentCardComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './source-equipment-list.component.html',
})
export class SourceEquipmentListComponent {
  
  readonly store = inject(SourceEquipmentStore)

  @Input() mode : "source"|"inventory" = "source";
  @Input() alreadyInEquipments : Equipment[] = [];

  choosedEquipment = output<SourceEquipment|Equipment>()

  readonly pageSize = 20;

  nameFilter = signal('');
  brandFilter = signal('');

  minWeight = signal(NaN)
  maxWeight = signal(NaN)

  pageNumber = signal(0);

  sortBy = signal<'name' | 'weight'>('name')
  sortDir = signal<'ASC' | 'DESC'>('ASC')


  sourceEquipmentResource = httpResource<ResponseModel<ListSourceEquipmentResponse>>(()=>({
    url : this.mode === 'source'
    ? `${environment.apiUrl}/equipments`
    : `${environment.apiUrl}/inventory/filtered`,
    params : {
      name : this.nameFilter(),
      brand : this.brandFilter(),
      minWeight : Number.isNaN(this.minWeight()) ? 0 : this.minWeight(),
      maxWeight : Number.isNaN(this.maxWeight()) ? 1000000 : this.maxWeight(),
      pageNumber : this.pageNumber(),
      pageSize : this.pageSize,
      sortBy : this.sortBy(),
      sortDir : this.sortDir()
    }
  }))

  readonly numberOfPages = computed(() => {
    return Math.floor(this.resultsCount / this.pageSize);
  });

  get equipments(){
    return this.sourceEquipmentResource.value()?.data.equipments ?? [];
  }

  get choosableEquipments(){
    if(this.mode === "inventory"){
      return this.equipments.filter(eq => {
        return !this.alreadyInEquipments.some(existingEq => existingEq.id === eq.id) // On ne garde que ceux qui ne sont pas dans le tableaux des équipements déja présents
      });
    }else{
      return this.equipments
    }
  }

  get resultsCount(){
    return this.sourceEquipmentResource.value()?.data.totalCount ?? 0;
  }

  chooseEquipment(equipment : SourceEquipment|Equipment){
    if('url' in equipment){
      this.store.select(equipment)
    }
    else{
      // this.alreadyInEquipments.push(equipment) // PROBLÈME DOUBLEMENT D'ÉQUIPEMENT CAR MODIF PAR RÉFÉRENCE !!!
      this.choosedEquipment.emit(equipment)
    }
  }

  changeInputValueAndResetPageNumber(signalName : "brand"|"name"|"minWeight"|"maxWeight", event : Event){

    const input = event.target as HTMLInputElement;
    const raw = input.value;

    switch (signalName) {
      case 'brand':
        this.brandFilter.set(raw);
        break;
      case 'name':
        this.nameFilter.set(raw);
        break;
      case 'minWeight':
        this.minWeight.set(Number(raw) || NaN);
        break;
      case 'maxWeight':
        this.maxWeight.set(Number(raw) || NaN);
        break;
    }
    this.pageNumber.set(0)
  }




  switchSortBy(){
    let newValue : 'name'|'weight' = (this.sortBy() == 'name' ? 'weight' : 'name');
    this.sortBy.set(newValue)
  }

  switchSortDir(){
    let newValue : 'ASC'|'DESC' = (this.sortDir() == 'ASC' ? 'DESC' : 'ASC');
    this.sortDir.set(newValue)
  }


  nextPage() { 
    if(this.pageNumber() + 1 <= this.numberOfPages()){
      this.pageNumber.set(Math.min(this.pageNumber()+1)); 
      // console.log('Page n°:', this.pageNumber())
    }
  }

  prevPage() { 
    if(this.pageNumber() > 0){
      this.pageNumber.set(Math.max(0, this.pageNumber()-1));
      // console.log('Page n°:', this.pageNumber())
    }
  }
}
