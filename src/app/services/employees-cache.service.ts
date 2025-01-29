import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {EmployeeService} from "./employee.service";
import {Employee} from "../models/Employee";
import {Observable, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeesCacheService implements OnDestroy {
  private cache: WritableSignal<Employee[]> = signal<Employee[]>([]);
  private subscriptions: Subscription[] = [];

  constructor(private employeeService: EmployeeService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  read(): WritableSignal<Employee[]> {
    return this.cache;
  }

  refresh() {
    const data: Employee[] = [];
    const subscription: Subscription = this.employeeService.selectAll().subscribe(
      (employees: Employee[]) => {
        employees.forEach(employee => {
          data.push(employee);
        });
      }
    );
    this.subscriptions.push(subscription);
    this.cache.set(data);
  }

  select(id: number): Employee | undefined {
    const data: Employee[] = this.cache();
    return data.find((employee: Employee) => employee.id === id);
  }

  insert(employee: Employee) {
    const result$: Observable<Employee> = this.employeeService.insert(employee);
    const subscription: Subscription = result$.subscribe(
      (newEmployee: Employee) => {
        this.cache.update(data => {
          data.push(newEmployee);
          return data;
        })
      }
    );
    this.subscriptions.push(subscription);
  }

  update(employee: Employee) {
    const result$: Observable<Employee> = this.employeeService.update(employee);
    const subscription: Subscription = result$.subscribe(
      (updatedEmployee: Employee) => {
        this.cache.update(data => {
          data = data.filter(item => item.id !== employee.id);
          data.push(updatedEmployee);
          return data;
        })
      }
    );
    this.subscriptions.push(subscription);
  }

  delete(id: number) {
    const subscription: Subscription = this.employeeService.delete(id).subscribe();
    this.cache.update(employees => employees.filter(employee => employee.id !== id));
    this.subscriptions.push(subscription);
  }
}
