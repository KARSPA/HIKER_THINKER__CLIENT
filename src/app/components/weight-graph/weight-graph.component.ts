import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Inventory } from '../../interfaces/Inventory';
import { Hike } from '../../interfaces/hike/Hike';
import { GraphCategory } from '../../interfaces/graph/GraphCategory';
import { GraphInfos } from '../../interfaces/graph/GraphInfos';
import { NgStyle } from '@angular/common';
import { ICON_COLORS, IconKey } from '../../_helpers/records/icon_color';

@Component({
  selector: 'app-weight-graph',
  imports: [NgStyle],
  templateUrl: './weight-graph.component.html'
})
export class WeightGraphComponent implements OnChanges{
  

  @Input() inventory !: Inventory;
  @Input() hike !: Hike;
  
  graphInfos : GraphInfos = {isUnique : true, infos : []}

  // Méthode ici pour construire les infos nécessaire à la construction du graph dans un objet spécifique ...
  ngOnChanges(): void {
    this.calculateGraphInfos();
    console.log(this.inventory)
    console.log(this.hike)
    console.log(this.graphInfos)
  }


  calculateGraphInfos(){

    let categories = this.inventory.categories;
    let totalWeight = this.hike.totalWeight;

    let baseAngle = 0;


    if(categories.length == 1){
      this.graphInfos.isUnique = true;

      // Construire le graphCategory :
      let percentage = Math.round((totalWeight != 0 ? (categories[0].accumulatedWeight)/(totalWeight)*100 : 100)*100)/100;
      let startAngle = baseAngle;
      let endAngle = 360;

      this.graphInfos.infos.push({
        category : categories[0],
        percentage,
        startAngle,
        endAngle,
        sectionStyle : `conic-gradient(from ${startAngle}deg, ${this.getCategoryColor(categories[0].icon)} ${endAngle - startAngle}deg, transparent 0)`,
        endBorderRotationStyle : "",
        iconStyle : ""}
      )

      baseAngle = endAngle;

      return
    }

    // Si on est là c'est qu'il y a plusieurs catégories

    this.graphInfos.isUnique = false;
    categories.forEach((category)=>{

      let percentage = Math.round((totalWeight != 0 ? (category.accumulatedWeight)/(totalWeight)*100 : 100)*100)/100;

      let startAngle = baseAngle
      let endAngle = Math.min(Math.ceil(baseAngle + percentage*3.6),360);

      let rotateAngle = (startAngle+endAngle)/2-90
      console.log(rotateAngle)

      this.graphInfos.infos.push({
              category : category,
              percentage,
              startAngle,
              endAngle,
              sectionStyle : `conic-gradient(from ${startAngle}deg, ${this.getCategoryColor(category.icon)} ${endAngle - startAngle}deg, transparent 0)`,
              endBorderRotationStyle : `rotate(${endAngle}deg)`,
              iconStyle : `rotate(${rotateAngle}deg) translateX(35px) rotate(${-rotateAngle}deg)`
      })

      baseAngle = endAngle;
      })
  }

  getCategoryColor(icon : IconKey|null){
    return ICON_COLORS[icon ?? 'no_icon'];
  }
}
