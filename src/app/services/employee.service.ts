import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, take } from "rxjs";
import { Employee } from "../models/Employee";
import { EmployeeCreateDto } from "../models/EmployeeCreateDto";
import { AppGlobals } from "../app.globals";

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
      map((rawEmployees: any[]) =>
        rawEmployees.map(raw => ({
          ...raw,
          qualifications: raw.skillSet
        }))
      ),
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
      map((raw: any) => ({
        ...raw,
        qualifications: raw.skillSet
      })),
      catchError(error => {
        console.error(error);
        throw new Error(error);
      }
      ));
  }

  insert(employee: Employee): Observable<Employee> {
    const dto: EmployeeCreateDto = this.modelToCreateDto(employee);
    return this.http.post<EmployeeCreateDto>(this.url, dto).pipe(
      take(1),
      catchError(error => {
        console.error(error);
        throw new Error(error);
      }
      ));
  }

  update(employee: Employee): Observable<Employee> {
    const dto: EmployeeCreateDto = this.modelToCreateDto(employee);
    let postUrl = `${this.url}/${employee.id}`;
    return this.http.put<EmployeeCreateDto>(postUrl, dto).pipe(
      take(1),
      catchError(error => {
        console.error(error);
        throw new Error(error);
      }
      ));
  }

  delete(id: number): Observable<Employee> {
    const deleteUrl = `${this.url}/${id}`;
    return this.http.delete(deleteUrl);
  }

  private modelToCreateDto(model: Employee): EmployeeCreateDto {
    const dto: EmployeeCreateDto =  new EmployeeCreateDto(
      model.lastName,
      model.firstName,
      model.street,
      model.postcode,
      model.city,
      model.phone,
    );
    dto.skillSet = model.qualifications?.map<number | undefined>(entry => entry.id);
    return dto;
  }
}
