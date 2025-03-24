import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Hike } from '../../interfaces/hike/Hike';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validDurationUnit } from '../../_helpers/validators/durationUnit';
import { HikeService } from '../../services/hike.service';
import { ModalService } from '../../services/modal.service';
import { HikeEvent } from '../../interfaces/hike/HikeEvent';

@Component({
  selector: 'app-hike-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './hike-modal.component.html'
})
export class HikeModalComponent implements OnInit{

  @Input() hike : Hike|null = null;
  @Input() requestType !: string;


  @Output() result = new EventEmitter<HikeEvent>()

  private modalService : ModalService = inject(ModalService);

  durationUnits = ["jours", "heures"]

  hikeHttpError : string = ''; // UTILISER AVANT ....

  hikeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    distance: new FormControl('', [Validators.required, Validators.pattern("^(?:(?:[1-9]\\d{0,3}(?:\\.\\d{1,2})?)|(?:10000(?:\\.0{1,2})?))$")]),
    positive: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,4}|100000)$")]),
    negative: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,4}|100000)$")]),
    duration: new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,2}|1000)$")]),
    durationUnit: new FormControl('jours', [Validators.required, validDurationUnit()]),
    date : new FormControl('', [Validators.required]),
    weightCorrection : new FormControl('')
  })


  ngOnInit(): void {
    this.hikeForm.patchValue({
      title : this.hike?.title ?? '',
      distance: this.hike?.distance.toString(),
      positive: this.hike?.positive.toString(),
      negative: this.hike?.negative.toString(),
      duration: this.hike?.duration.toString(),
      durationUnit: this.hike?.durationUnit,
      date : this.hike ? new Date(this.hike.date).toISOString().split('T')[0] : '',
      weightCorrection : this.hike?.weightCorrection.toString()
    })
  }

  onSubmit(){

    if(!this.hikeForm.valid) return

    const formValue = this.hikeForm.value;

    const payload : Hike = {
      id: this.hike ? this.hike.id : null,
      title: formValue.title ?? '',
      distance: Number(formValue.distance),       
      positive: Number(formValue.positive),       
      negative: Number(formValue.negative),       
      duration: Number(formValue.duration),       
      durationUnit: formValue.durationUnit ?? '',
      date: new Date(formValue.date ?? 'now'), 
      weightCorrection: Number(formValue.weightCorrection),
      totalWeight : this.hike ? this.hike.totalWeight : 0,
      inventory : null
    }

    this.result.emit({
      action : this.hike?.id ? 'update' : 'create',
      hike : payload}) //Transmettre au parent
  }

  emitRemoveEvent(){
    this.result.emit({
      action : 'delete',
      hike : this.hike!})
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

  getErrorMessage(reason : string, length ?: number, format ?: string, unit ?: string) : string{

    let errorMessage : string = '';

    switch(reason){
      case 'required':
        errorMessage = 'Champ requis.';
        break;
      case 'maxLength':
        errorMessage = `Au plus ${length} caractères.`;
        break;
      case 'numberFormat':
        errorMessage = `Entrez une donnée valide. Il faut un nombre au format : ${format}.`;
        break;
      case 'number':
        errorMessage = `Entrez une donnée valide. Maximum ${length} ${unit ? '('+unit+')' : ''}.`;
        break;
    }

    return errorMessage;
  }
}
