import { Component, inject, OnInit } from '@angular/core';
import { HikeService } from '../../services/hike.service';
import { Hike } from '../../interfaces/hike/Hike';
import { HikeCardComponent } from '../../components/hike-card/hike-card.component';
import { ModalService } from '../../services/modal.service';
import { HikeModalComponent } from '../../components/hike-modal/hike-modal.component';
import { HikeEvent } from '../../interfaces/hike/HikeEvent';
import { BasicLoaderComponent } from "../../_partials/basic-loader/basic-loader.component";

@Component({
  selector: 'app-hikes',
  imports: [HikeCardComponent, BasicLoaderComponent],
  templateUrl: './hikes.component.html'
})
export class HikesComponent implements OnInit{
 

  private hikeService : HikeService = inject(HikeService);
  private modalService : ModalService = inject(ModalService);

  hikes : Hike[] = [];

  loaderActive : boolean = true;


  ngOnInit(): void {
    //Chercher les randonnées
    this.hikeService.getHikes().subscribe({
      next:(response)=>{
        this.loaderActive = false;
        this.hikes = response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error:(err)=>{
        console.log(err)
      }
    });

    //S'abonner aux évènements d'ajout/modif de randonnées
    this.hikeService.hikeChange$.subscribe({
      next:(hike)=>{

        // Différencier si ajout ou modif
        const hikeAlreadyExists = this.hikes.find(hi => hi.id === hike.id);

        if(hikeAlreadyExists){ // Modif
          // Si modif, remplacer la rando à cet emplacement par la nouvelle

        }
        else{ // Ajout
          // Si ajout, insérer la date au bon emplacement du tableau
          this.insertNewHike(hike)
        }
      }
    })
  }


  openHikeModal(hike?: Hike){

    this.modalService.openModal<HikeModalComponent, HikeEvent>({
      component : HikeModalComponent,
      data: {
        hike : hike,
        requestType : 'Ajout'
      }
    })
    .subscribe((hikeEvent)=>{

        //Faire la requete d'ajout de la randonnée
        this.hikeService.addHike(hikeEvent.hike).subscribe({
          next:(res)=>{

            this.hikeService.notifyHikeChange(res.data);

            this.modalService.closeModal();
          },
          error:(err)=>{
            console.log(err)
            //TODO => Afficher/Transmettre une erreur dans la modale ou sur cette page (OU avec ASYNC Validator)
          }
        })
    })
  }


  insertNewHike(hike : Hike){

    const newHikeDate = new Date(hike.date).getTime();

    let inserted = false;

    for(let i = 0; i < this.hikes.length; i++){
      const currentHikeDate = new Date(this.hikes[i].date).getTime();

      if(newHikeDate > currentHikeDate){ // Si la date en cours de check est plus ancienne, alors on insère (ce qui décalera celle en cours)
        this.hikes.splice(i, 0, hike);
        inserted = true;
        break;
      }
    }

    if(!inserted){ // Si pas trouvé de date plus récente, c'est que c'est la plus ancienne donc à la fin ...
      this.hikes.push(hike);
    }

  }

}
