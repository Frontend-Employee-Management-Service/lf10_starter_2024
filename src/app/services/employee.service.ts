import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, take} from "rxjs";
import {Employee} from "../models/Employee";
import {EmployeeCreateDto} from "../models/EmployeeCreateDto";
import {AppGlobals} from "../app.globals";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url = AppGlobals.EMPLOYEES_MANAGER_BASE_URL + '/employees';

  constructor(private http: HttpClient) {
  }

  selectAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url).pipe(
      take(1),
      catchError(error => {
          console.error(error);
          throw new Error(error);
        }
      ));
  }

  select(id: number): Observable<Employee> {
    let getUrl = `${this.url}/${id}`;
    return this.http.get<Employee>(getUrl).pipe(
      take(1),
      catchError(error => {
          console.error(error);
          throw new Error(error);
        }
      ));
  }

  insert(employee: EmployeeCreateDto): Observable<Employee> {
    return this.http.post<Employee>(this.url, employee).pipe(
      take(1),
      catchError(error => {
          console.error(error);
          throw new Error(error);
        }
      ));
  }

  update(employee: Employee): Observable<Employee> {
    let postUrl = `${this.url}/${employee.id}`;
    return this.http.put(postUrl, employee).pipe(
      take(1),
      catchError(error => {
          console.error(error);
          throw new Error(error);
        }
      ));
  }

  delete(id: number): Observable<Employee> {
    const deleteUrl = `${this.url}/${id}`;
    return this.http.delete(deleteUrl).pipe(
      take(1),
      catchError(error => {
          console.error(error);
          throw new Error(error);
        }
      ));
  }

}
