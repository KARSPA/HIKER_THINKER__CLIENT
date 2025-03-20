import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Category } from '../../interfaces/equipment/Category';
import { EquipmentService } from '../../services/equipment.service';
import { ModalService } from '../../services/modal.service';
import { EquipmentEvent } from '../../interfaces/equipment/EquipmentEvent';
import { AddEquipment } from '../../interfaces/equipment/AddEquipment';

@Component({
  selector: 'app-inventory-equipment-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-equipment-modal.component.html'
})
export class InventoryEquipmentModalComponent {

  @Input() categories : Category[] = [];

  @Output() result = new EventEmitter<EquipmentEvent>(); // Va remonter les évènements (au submit) pour déporter la logique métier

  
  private modalService : ModalService = inject(ModalService);

  equipmentHttpError = null;


  equipmentForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.maxLength(30)]),
    weight : new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,3}|10000)$")]),
    description : new FormControl('', [Validators.maxLength(500)]),
    brand : new FormControl('', [Validators.required, Validators.maxLength(20)]),
    categoryName : new FormControl('Sans catégorie', [Validators.required]),
  })



  onSubmit(){

    if(!this.equipmentForm.valid) return

      //Remonter l'évènement au parent
    
      const formValue = this.equipmentForm.value;

      const payload: AddEquipment = { 
        name : formValue.name ?? '',
        description : formValue.description ?? '',
        weight : Number(formValue.weight) ?? 0,
        brand : formValue.brand ?? '',
        categoryName : formValue.categoryName ?? '',
        sourceId : null
      }
  
      this.result.emit({
        action : 'create',
        equipment : payload
      })
  
      this.modalService.closeModal();
  }



  getErrorMessage(reason : string, length : number = 0) : string{

    let errorMessage : string = '';

    switch(reason){
      case 'required':
        errorMessage = 'Champ requis.';
        break;
      case 'maxlength':
        errorMessage = `Au plus ${length} caractères.`;
        break;
      case 'number':
        errorMessage = 'Entrez un poids valide. Inférieur à 10 000 (grammes).';
        break;
    }

    return errorMessage;
  }


  allFieldsTouched() : boolean{
    return (this.equipmentForm.get('name')?.touched
      && this.equipmentForm.get('weight')?.touched
      && this.equipmentForm.get('brand')?.touched
      && this.equipmentForm.get('categoryName')?.touched) ?? false;
  }

  get name(){
    return this.equipmentForm.get('name');
  }
  get weight(){
    return this.equipmentForm.get('weight');
  }
  get brand(){
    return this.equipmentForm.get('brand');
  }
  get description(){
    return this.equipmentForm.get('description');
  }
  get categoryName(){
    return this.equipmentForm.get('categoryName');
  }
}
