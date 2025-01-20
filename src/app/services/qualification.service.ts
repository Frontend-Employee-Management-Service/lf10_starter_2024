import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Qualification } from '../models/Qualification';
import { AppGlobals } from '../app.globals';
import { catchError, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  private readonly urlSnippet: string = "/qualifications";

  constructor(private httpClient: HttpClient) { }

  select(id: number): Observable<Qualification> {
    const url = AppGlobals.EMPLOYEES_MANAGER_BASE_URL + this.urlSnippet + `/${id}`;;
    return this.httpClient.get<Qualification>(url).pipe(
      take(1),
      catchError((error) => {
        console.error(error);
        throw new Error(error);
      }
      ));
  }

  selectAll(): Observable<Qualification[]> {
    const url = AppGlobals.EMPLOYEES_MANAGER_BASE_URL + this.urlSnippet;
    return this.httpClient.get<Qualification[]>(url).pipe(
      take(1),
      catchError((error) => {
        console.error(error);
        throw new Error(error);
      }
      )
    );
  }

  update(qualification: Qualification): Observable<Qualification> {
    const url = AppGlobals.EMPLOYEES_MANAGER_BASE_URL + this.urlSnippet + `/${qualification.id}`;
    return this.httpClient.put<Qualification>(url, qualification).pipe(
      take(1),
      catchError(error => {
        console.error(error);
        throw new Error(error);
      }
      )
    );
  }

  insert(qualification: Qualification): Observable<Qualification> {
    const url: string = AppGlobals.EMPLOYEES_MANAGER_BASE_URL + this.urlSnippet;
    return this.httpClient.post<Qualification>(url, qualification).pipe(
      take(1),
      catchError(error => {
        console.error(error);
        throw new Error(error);
      })
    );
  }

  delete(id: number): Observable<any> {
    const url: string = AppGlobals.EMPLOYEES_MANAGER_BASE_URL + this.urlSnippet + `/${id}`;
    return this.httpClient.delete<any>(url).pipe(
      take(1),
      catchError(error => {
        console.error(error);
        throw new Error(error);
      })
    );
  }
}
