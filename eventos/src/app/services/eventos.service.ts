import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { Evento } from "../models/Evento";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  api_url: string = "http://localhost:5000/";

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Evento[]>{
    return this.http.get(this.api_url + 'api/events/') as Observable<Evento[]>;
  }

  getEvent(id: string): Observable<Evento>{
    return this.http.get(this.api_url + 'api/events/' + id + '/') as Observable<Evento>;
}
}
