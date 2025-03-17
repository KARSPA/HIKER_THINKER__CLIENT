import { Component, Input } from '@angular/core';
import { Hike } from '../../interfaces/hike/Hike';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validDurationUnit } from '../../_helpers/validators/durationUnit';

@Component({
  selector: 'app-hike-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './hike-modal.component.html'
})
export class HikeModalComponent {

  @Input() hike : Hike|null = null;

  durationUnits = ["jours", "heures"]


  hikeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    distance: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,3}|10000)$")]),
    positive: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,4}|100000)$")]),
    negative: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,4}|100000)$")]),
    duration: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,2}|1000)$")]),
    durationUnit: new FormControl('jours', [Validators.required, validDurationUnit()]),
    date : new FormControl('', [Validators.required])
  })




  onSubmit(){
    console.log("SUBMIT")
  }


  allFieldsTouched() : boolean{
    return (this.hikeForm.get('title')?.touched
      && this.hikeForm.get('distance')?.touched
      && this.hikeForm.get('distance')?.touched
      && this.hikeForm.get('positive')?.touched
      && this.hikeForm.get('negative')?.touched
      && this.hikeForm.get('duration')?.touched
      && this.hikeForm.get('durationUnit')?.touched
      && this.hikeForm.get('date')?.touched
    ) ?? false;
  }

  get title(){
    return this.hikeForm.get('title');
  }
  get distance(){
    return this.hikeForm.get('distance');
  }
 
  get positive(){
    return this.hikeForm.get('positive');
  }
  get negative(){
    return this.hikeForm.get('negative');
  }

  get duration(){
    return this.hikeForm.get('duration');
  }
  get durationUnit(){
    return this.hikeForm.get('durationUnit');
  }
  get date(){
    return this.hikeForm.get('date');
  }

  getErrorMessage(reason : string, length : number = 0, unit ?: string) : string{

    let errorMessage : string = '';

    switch(reason){
      case 'required':
        errorMessage = 'Champ requis.';
        break;
      case 'maxlength':
        errorMessage = `Au plus ${length} caractères.`;
        break;
      case 'number':
        errorMessage = `Entrez une donnée valide. Inférieur à ${length} (${unit}).`;
        break;
    }

    return errorMessage;
  }
}
