import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ICategory} from "../domain/ICategory";
import {Observable} from "rxjs";
import {CategoryParams} from "../domain/Params/OutputDto";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly url: string;
  readonly categoryObservable$: Observable<ICategory[]>;
  constructor(private readonly client: HttpClient) {
    this.url = `${environment.apiUrl}` + "category/";
    this.categoryObservable$ = this.client.get<ICategory[]>(this.url);
  }

  createNewCategory(param: CategoryParams) : Observable<null>{
    return this.client.post<any>(this.url+"new/", param);
  }

  deleteCategory(categoryId: number): Observable<null>{
    return this.client.delete<any>(this.url+"delete/"+categoryId);
  }

  updateCategory(param : ICategory) : Observable<null>{
    return this.client.post<any>(this.url+"update/", param);
  }
}
