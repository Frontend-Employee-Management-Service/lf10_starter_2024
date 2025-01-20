import { Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { Qualification } from '../models/Qualification';
import { QualificationService } from './qualification.service';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualificationsCacheService implements OnDestroy {
  private reactiveCache: WritableSignal<Qualification[]> = signal<Qualification[]>([]);
  private subscriptions: Subscription[] = [];

  constructor(private dataService: QualificationService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  read(): WritableSignal<Qualification[]> {
    return this.reactiveCache;
  }

  refresh() {
    const data: Qualification[] = [];
    const subscription: Subscription = this.dataService.selectAll()
      .subscribe(
        (qualifications: Qualification[]) => {
          qualifications.forEach(entry => data.push(entry));
        }
      );
    this.subscriptions.push(subscription);
    this.reactiveCache.set(data);
  }

  select(id: number): Qualification | undefined {
    const data: Qualification[] = this.reactiveCache();
    return data.find(entry => entry.id === id);
  }

  insert(qualification: Qualification): void {
    const result$: Observable<Qualification> = this.dataService.insert(qualification);
    const subscription: Subscription = result$.subscribe(
      value => this.reactiveCache.update(data => {
        data.push(value);
        return data;
      }
      )
    );
    this.subscriptions.push(subscription);
  }

  update(qualification: Qualification): void {
    const result$: Observable<Qualification> = this.dataService.update(qualification);
    const subscription: Subscription = result$.subscribe(
      value => this.reactiveCache.update(data => {
        data = data.filter(entry => entry.id !== qualification.id);
        data.push(value);
        return data;
      }
      )
    );
    this.subscriptions.push(subscription);
  }

  delete(id: number) {
    const subscription: Subscription = this.dataService.delete(id).subscribe();
    this.reactiveCache.update(values => values.filter(entry => entry.id !== id));
    this.subscriptions.push(subscription);
  }
}
