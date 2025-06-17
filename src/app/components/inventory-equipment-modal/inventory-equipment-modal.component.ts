import { Component, effect, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../interfaces/equipment/Category';
import { ModalService } from '../../services/modal.service';
import { EquipmentEvent } from '../../interfaces/equipment/EquipmentEvent';
import { AddEquipment } from '../../interfaces/equipment/AddEquipment';
import { SourceEquipmentListComponent } from '../source-equipment-list/source-equipment-list.component';
import { SourceEquipmentStore } from '../../services/stores/source-equipment-store';

@Component({
  selector: 'app-inventory-equipment-modal',
  imports: [ReactiveFormsModule, SourceEquipmentListComponent],
  templateUrl: './inventory-equipment-modal.component.html',
})
export class InventoryEquipmentModalComponent implements OnInit{

  @Input() categories : Category[] = [];

  @Output() result = new EventEmitter<EquipmentEvent>(); // Va remonter les évènements (au submit) pour déporter la logique métier

  
  readonly sourceEquipmentStore = inject(SourceEquipmentStore);
  private modalService : ModalService = inject(ModalService);

  equipmentHttpError = null;

  constructor() {
    // Cet effect vit dans le contexte d’injection du constructeur
    effect(() => {
      const sel = this.sourceEquipmentStore.selected();
      
      this.equipmentForm.patchValue({
        name : sel.name,
        weight : sel.weight.toFixed(0),
        description : sel.description,
        brand : sel.brand,
      });
      
    });
  }

  ngOnInit(): void {
      this.equipmentForm.patchValue({
        categoryName : this.categories.find(cat => cat.id === 'DEFAULT')?.name
      })
  }

  equipmentForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    weight : new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,3}|10000)$")]),
    description : new FormControl('', [Validators.maxLength(500)]),
    brand : new FormControl('', [Validators.required, Validators.maxLength(20)]),
    categoryName : new FormControl('', [Validators.required]),
  })

  reinitializeState(){
    this.sourceEquipmentStore.clear()
  }


  onSubmit(){

    if(!this.equipmentForm.valid) return

      const formValue = this.equipmentForm.value;

      const payload: AddEquipment = { 
        name : formValue.name ?? '',
        description : formValue.description ?? '',
        weight : Number(formValue.weight) ?? 0,
        brand : formValue.brand ?? '',
        categoryName : formValue.categoryName ?? '',
        sourceId : this.sourceEquipmentStore.selected().id,
        position: 0
      }
  
      this.result.emit({
        action : 'create',
        equipment : payload
      })

      this.sourceEquipmentStore.clear();
      this.modalService.closeModal();
  }



  getErrorMessage(reason : string, length : number = 0) : string{

    let errorMessage : string = '';

    switch(reason){
      case 'required':
        errorMessage = 'Champ requis.';
        break;
      case 'maxLength':
        errorMessage = `Au plus ${length} caractères.`;
        break;
      case 'number':
        errorMessage = 'Entrez un poids valide. Inférieur à 10 000 (grammes).';
        break;
    }

    return errorMessage;
  }

  onlyDigits(e : KeyboardEvent){
    if(!['1','2','3','4','5','6','7','8','9','0','Backspace','Tab'].includes(e.key)) e.preventDefault();
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
