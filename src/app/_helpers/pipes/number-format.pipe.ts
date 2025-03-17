import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number|undefined): string {

    if (value === null || value === undefined) {
      return '';
    }

    // S'assurer que value est une chaîne de caractères
    const valueStr = value.toString();

    // Séparer la partie entière et la partie décimale (si présente)
    const parts = valueStr.split('.');

    // Formater la partie entière avec des espaces comme séparateurs de milliers
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    // Rejoindre les parties
    return parts.join('.');
  }
}


