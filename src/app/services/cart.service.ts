import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICartAddition} from "../domain/Params/OutputDto";
import {BehaviorSubject, Observable} from "rxjs";
import Endpoints from "../constants/Endpoints";
import {ICart} from "../domain/ICart";
import {UserConstants} from "../constants/UserConstants";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public readonly cartObservable$ : Observable<ICart>
  public readonly cartCacheSubject$ : BehaviorSubject<ICart | null>

  constructor(private readonly client : HttpClient) {
    this.cartObservable$ = this.client.get<ICart>(Endpoints.Cart);
    this.cartCacheSubject$ = new BehaviorSubject<ICart | null>(null);
  }

  addToCart(cartAddition : ICartAddition) : Observable<unknown> {
    return this.client.post<unknown>(Endpoints.Cart+"add", cartAddition);
  }

  removeItemFromCart(foodId : number) : Observable<unknown>{
    return this.client.delete<unknown>(Endpoints.Cart+`remove/${foodId}`);
  }

  clearCart() : Observable<unknown>{
    return this.client.delete<unknown>(Endpoints.Cart+`clear`);
  }

  // getCart() : ICart | null {
  //   const item = localStorage.getItem(UserConstants.Cart);
  //   if(item === null || item === undefined)
  //     return null;
  //
  //   return JSON.parse(item);
  // }

  updateCart(){
    this.cartObservable$.subscribe({
      next: value => {
        localStorage.setItem(UserConstants.Cart, JSON.stringify(value))
        this.cartCacheSubject$.next(value);
      },
      error: err => {

      },
      complete: () => {

      }
    })
  }


}
