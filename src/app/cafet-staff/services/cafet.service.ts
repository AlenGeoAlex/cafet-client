import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {IEmailQuery} from "../../domain/IEmailQuery";

@Injectable({
  providedIn: 'root'
})
export class CafetService {

  public readonly userUrl : string

  public searchString : string;

  constructor(private readonly client : HttpClient) {
    this.userUrl = environment.apiUrl + "users/"
  }

  search(queryString : string) : Observable<IEmailQuery[]> {
    return this.client.get<IEmailQuery[]>(`${this.userUrl}search?queryString=${queryString}`);
  }
}
