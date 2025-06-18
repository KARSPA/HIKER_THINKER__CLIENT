import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EquipmentEvent } from '../../../interfaces/equipment/EquipmentEvent';
import { Category } from '../../../interfaces/equipment/Category';
import { ModalService } from '../../../services/modal.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Equipment } from '../../../interfaces/equipment/Equipment';
import { ModifyEquipmentEvent } from '../../../interfaces/equipment/ModifyEquipmentEvent';

@Component({
  selector: 'app-modify-equipment-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './modify-equipment-modal.component.html'
})
export class ModifyEquipmentModalComponent {

  @Input() categories : Category[] = [];
  @Input() equipment !: Equipment;
  @Output() result = new EventEmitter<ModifyEquipmentEvent>(); // Va remonter les évènements (au submit) pour déporter la logique métier

  private modalService : ModalService = inject(ModalService);

  equipmentHttpError = null;

  ngOnInit(): void {
      this.equipmentForm.patchValue({
        categoryId : this.equipment.categoryId,
        name : this.equipment.name,
        weight : this.equipment.weight.toFixed(),
        brand : this.equipment.brand,
        description : this.equipment.description
      })

      // console.log(this.equipment)
  }

  equipmentForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.maxLength(30)]),
    weight : new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,3}|10000)$")]),
    description : new FormControl('', [Validators.maxLength(500)]),
    brand : new FormControl('', [Validators.required, Validators.maxLength(20)]),
    categoryId : new FormControl('', [Validators.required]),
    hasConsequences : new FormControl(false),
    consequencesLimitDate : new FormControl(null),
  })



  onSubmit(){
    if(!this.equipmentForm.valid) return

      const formValue = this.equipmentForm.value;
      // console.log(formValue)

      const payload: ModifyEquipmentEvent = { 
        equipment : {
          id : this.equipment.id,
          name : formValue.name ?? '',
          description : formValue.description ?? '',
          weight : Number(formValue.weight) ?? 0,
          brand : formValue.brand ?? '',
          categoryId : formValue.categoryId ?? '',
          sourceId : null,
          position: 0,
          categoryName : ''
        },
        hasConsequences : formValue.hasConsequences ?? false,
        consequencesLimitDate : formValue.consequencesLimitDate ? new Date(formValue.consequencesLimitDate) : null
      }

      // console.log(payload)
  
      this.result.emit(payload)
  
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
      && this.equipmentForm.get('categoryId')?.touched) ?? false;
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
  get categoryId(){
    return this.equipmentForm.get('categoryId');
  }
  get hasConsequences(){
    return this.equipmentForm.get('hasConsequences');
  }
  get consequencesLimitDate(){
    return this.equipmentForm.get('consequencesLimitDate');
  }
}
