import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Employee} from "../Employee";
import {FilterService} from "../services/filter.service";

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;

  constructor(private http: HttpClient, private filterService: FilterService) {
    this.employees$ = of([]);
    this.fetchData();
    this.test();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }

  test(): void {
    this.employees$.subscribe({
      next: (employees) => {
        const nameKey = 'lastName';
        //let employeesArray = this.filterService.filterColumn(employees, nameKey as keyof Employee, 'frau');
        let employeesArray = this.filterService.filterAll(employees, 'Meta-Sattler');
        //let employeesArray = this.filterService.filterColumnHasNoValue(employees, nameKey as keyof Employee);
        this.employees$ = of(employeesArray);
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }
}
