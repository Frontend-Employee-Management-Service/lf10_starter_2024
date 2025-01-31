import {Injectable, signal, WritableSignal} from '@angular/core';
import {EmployeeService} from "./employee.service";
import {Employee} from "../models/Employee";
import {catchError, Observable, Subscription, take} from "rxjs";
import { DataCache } from './data-cache';

@Injectable({
  providedIn: 'root'
})
export class EmployeesCacheService extends DataCache<Employee> {
  private static cache: WritableSignal<Employee[]> = signal<Employee[]>([]);
  private static selected: Map<string, Employee[]> = new Map<string, Employee[]>();
  
  constructor(private employeeService: EmployeeService) {
    super();
  }
  
  public override getSelectedData(): Map<string, Employee[]> {
    return EmployeesCacheService.selected;
  }

  read(): WritableSignal<Employee[]> {
    return EmployeesCacheService.cache;
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
    EmployeesCacheService.cache.set(data);
  }

  select(id: number): Employee | undefined {
    const data: Employee[] = EmployeesCacheService.cache();
    return data.find((employee: Employee) => employee.id == id);
  }

  insert(employee: Employee) {
    const result$: Observable<Employee> = this.employeeService.insert(employee);
    const subscription: Subscription = result$.subscribe(
      (newEmployee: Employee) => {
        EmployeesCacheService.cache.update(data => {
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
        EmployeesCacheService.cache.update(data => {
          data = data.filter(item => item.id !== employee.id);
          data.push(updatedEmployee);
          return data;
        })
      }
    );
    this.subscriptions.push(subscription);
  }

  delete(id: number): void {
    this.isLoading.update(loadingIDs => loadingIDs.add(id)); 
    console.log(this.isLoading())
    const subscription: Subscription = this.employeeService.delete(id)
    .pipe(
      take(1),
      catchError(error=>{
        this.isLoading.update(loadingIDs => {
          loadingIDs.delete(id);
          return loadingIDs;
        }) 
        throw new Error(error);
      } 
      ))
    .subscribe(
      {
        complete: () =>  {
          this.isLoading.update(loadingIDs => {
            EmployeesCacheService.cache.update(values => values.filter(entry => entry.id !== id))
            loadingIDs.delete(id);
            return loadingIDs;
          })
        }
      }
    );    
    this.subscriptions.push(subscription);
  }
}
