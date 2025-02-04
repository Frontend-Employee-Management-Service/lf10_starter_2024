import { Injectable, signal, WritableSignal } from '@angular/core';
import { EmployeeService } from "./employee.service";
import { Employee } from "../models/Employee";
import { catchError, Observable, Subscription, take } from "rxjs";
import { DataCache } from './data-cache';

@Injectable({
  providedIn: 'root'
})
export class EmployeesCacheService extends DataCache<Employee> {
  private static cache: WritableSignal<Employee[]> = signal<Employee[]>([]);
  private static selected: Map<string, Employee[]> = new Map<string, Employee[]>();
  private readonly SELECT_ALL_ID = -1;

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
    this.isLoading.update(loadingIDs => loadingIDs.add(this.SELECT_ALL_ID));
    const data: Employee[] = [];
    const subscription: Subscription = this.employeeService.selectAll()
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading.update(loadingIDs => {
            loadingIDs.delete(this.SELECT_ALL_ID);
            return loadingIDs;
          })
          throw new Error(error);
        })
      )
      .subscribe({
        next: (employees: Employee[]) => {
          this.isLoading.update(loadingIDs => {
            loadingIDs.delete(this.SELECT_ALL_ID);
            return loadingIDs;
          })
          employees.forEach(employee => {
            data.push(employee);
          });
          this.notifyStateChange();
        },
        complete: () => this.notifyStateChange()
      }
      );
    this.subscriptions.push(subscription);
    EmployeesCacheService.cache.set(data);
    this.notifyStateChange();
  }

  select(id: number): Employee | undefined {
    const data: Employee[] = EmployeesCacheService.cache();
    return data.find((employee: Employee) => employee.id == id);
  }

  insert(employee: Employee) {
    const result$: Observable<Employee> = this.employeeService.insert(employee);
    const subscription: Subscription = result$.subscribe(
      (newEmployee: Employee) => {
        this.notifyStateChange();
        EmployeesCacheService.cache.update(data => {
          data.push(newEmployee);
          return data;
        })
      }
    );
    this.subscriptions.push(subscription);
  }

  update(employee: Employee) {
    this.isLoading.update(loadingIDs => loadingIDs.add(employee.id!));
    const result$: Observable<Employee> = this.employeeService.update(employee);
    let e: Employee | undefined = undefined;
    const subscription: Subscription = result$.subscribe(
      {
        next: (updatedEmployee: Employee) => {
          e = updatedEmployee;
        },
        complete: () =>{
          if(e){
            EmployeesCacheService.cache.update(data => {
              data = data.filter(item => item.id != employee.id);
              data.push(e!);
              this.notifyStateChange();
              return data;
            });
          }
          this.notifyStateChange()
          this.isLoading.update(loadingIDs => {
            loadingIDs.delete(employee.id!);
            return loadingIDs;
          })
        } 
      });
    this.subscriptions.push(subscription);
  }

  delete(id: number): void {
    this.isLoading.update(loadingIDs => loadingIDs.add(id));

    const subscription: Subscription = this.employeeService.delete(id)
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading.update(loadingIDs => {
            loadingIDs.delete(id);
            return loadingIDs;
          })
          throw new Error(error);
        }
        ))
      .subscribe(
        {
          complete: () => {
            this.isLoading.update(loadingIDs => {
              this.notifyStateChange();
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
