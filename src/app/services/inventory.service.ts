import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private INVENTORY_URL = "http://localhost:8000/api/v1/inventory";

}
