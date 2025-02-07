import { Injectable, signal, WritableSignal } from '@angular/core';
import { Qualification } from '../models/Qualification';
import { QualificationService } from './qualification.service';
import { catchError, Observable, Subscription, take } from 'rxjs';
import { DataCache } from './data-cache';

@Injectable({
  providedIn: 'root'
})
export class QualificationsCacheService extends DataCache<Qualification> {
  private static cache: WritableSignal<Qualification[]> = signal<Qualification[]>([]);
  private static selected: Map<string, Qualification[]> = new Map<string, Qualification[]>();
  private readonly SELECT_ALL_ID = -1;

  constructor(private dataService: QualificationService) {
    super();
  }

  public override getSelectedData(): Map<string, Qualification[]> {
    return QualificationsCacheService.selected;
  }

  read(): WritableSignal<Qualification[]> {
    return QualificationsCacheService.cache;
  }

  refresh(): void {
    this.isLoading.update(loadingIDs => loadingIDs.add(this.SELECT_ALL_ID));
    const data: Qualification[] = [];
    const subscription: Subscription = this.dataService.selectAll()
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
      .subscribe(
        {
          next: (qualifications: Qualification[]) => {
            this.notifyStateChange();
            qualifications.forEach(entry => data.push(entry));
          },
          complete: () => {
            this.isLoading.update(loadingIDs => {
              loadingIDs.delete(this.SELECT_ALL_ID);
              return loadingIDs;
            })
            this.notifyStateChange();
          }
        }
      );
    QualificationsCacheService.cache.set(data);
    this.notifyStateChange();
    this.subscriptions.push(subscription);
  }

  select(id: number): Qualification | undefined {
    const data: Qualification[] = QualificationsCacheService.cache();
    return data.find(entry => entry.id == id);
  }

  insert(qualification: Qualification): void {
    const result$: Observable<Qualification> = this.dataService.insert(qualification);
    const subscription: Subscription = result$.subscribe(
      value => {
        this.notifyStateChange();
        QualificationsCacheService.cache.update(data => {
          data.push(value);
          return data;
        })
      }
    );
    this.subscriptions.push(subscription);
  }

  update(qualification: Qualification): void {
    const result$: Observable<Qualification> = this.dataService.update(qualification);
    const subscription: Subscription = result$.subscribe(
      value => {
        this.notifyStateChange();
        QualificationsCacheService.cache.update(data => {
          data = data.filter(entry => entry.id !== qualification.id);
          data.push(value);
          return data;
        }
        )
      }
    );
    this.subscriptions.push(subscription);
  }

  delete(id: number): void {
    this.isLoading.update(loadingIDs => loadingIDs.add(id));
    console.log(this.isLoading())
    const subscription: Subscription = this.dataService.delete(id)
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
            this.notifyStateChange();
            this.isLoading.update(loadingIDs => {
              QualificationsCacheService.cache.update(values => values.filter(entry => entry.id !== id))
              loadingIDs.delete(id);
              return loadingIDs;
            })
          }
        }
      );
    this.subscriptions.push(subscription);
  }
}
