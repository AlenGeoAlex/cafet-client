import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {IFood} from "../../domain/IFood";

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  readonly apiUrl : string;
  readonly foodList$ : Observable<IFood[]>;
  constructor(private readonly client: HttpClient) {
    this.apiUrl = `${environment.apiUrl}food/`;
    this.foodList$ = this.client.get<IFood[]>(this.apiUrl);
  }

  createNewFood(obj: FormData) : Observable<any> {
    return this.client.post(this.apiUrl+"new", obj);
  }

  updateFood(obj : FormData) : Observable<any> {
    return this.client.post(this.apiUrl+"update", obj);
  }

  deleteFood(id: number) : Observable<any> {
    return this.client.delete(this.apiUrl+"delete/"+id);
  }

  getFood(id: number) : Observable<IFood> {
    return this.client.get<IFood>(this.apiUrl+id);
  }
}
