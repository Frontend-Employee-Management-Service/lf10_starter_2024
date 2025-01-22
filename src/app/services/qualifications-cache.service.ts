import { Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { Qualification } from '../models/Qualification';
import { QualificationService } from './qualification.service';
import { catchError, Observable, Subscription, take } from 'rxjs';
import { ICache } from './icache';

@Injectable({
  providedIn: 'root'
})
export class QualificationsCacheService implements OnDestroy, ICache<Qualification> {
  private static reactiveCache: WritableSignal<Qualification[]> = signal<Qualification[]>([]);
  private static selected: Map<string, Qualification[]> = new Map<string, Qualification[]>();
  private subscriptions: Subscription[] = [];

  constructor(private dataService: QualificationService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addToSelected(selector: string, dto: Qualification): void {
    const collection: Qualification[] =  
      QualificationsCacheService.selected.has(selector) ?
      QualificationsCacheService.selected.get(selector)! :
      new Array<Qualification>();
    collection.push(dto);
    QualificationsCacheService.selected.set(selector, collection);
  }

  removeFromSelected(selector: string, dto: Qualification): void {
    if(!QualificationsCacheService.selected.has(selector))
      return;
    const collection: Qualification[] =  QualificationsCacheService.selected.get(selector)!;
    const updatedCollection: Qualification[] = collection.filter(entry => entry.id === dto.id);
    QualificationsCacheService.selected.set(selector, updatedCollection);
  }

  withdrawSelected(selector: string): Qualification[] {
    if(!QualificationsCacheService.selected.has(selector))
      return new Array<Qualification>();
    const collection: Qualification[] = QualificationsCacheService.selected.get(selector)!;
    QualificationsCacheService.selected.delete(selector);
    return collection;
  }

  read(): WritableSignal<Qualification[]> {
    return QualificationsCacheService.reactiveCache;
  }

  refresh(): void {
    const data: Qualification[] = [];
    const subscription: Subscription = this.dataService.selectAll()
      .subscribe(
        (qualifications: Qualification[]) => {
          qualifications.forEach(entry => data.push(entry));
        }
      );
    this.subscriptions.push(subscription);
    QualificationsCacheService.reactiveCache.set(data);
  }

  select(id: number): Qualification | undefined {
    const data: Qualification[] = QualificationsCacheService.reactiveCache();
    return data.find(entry => entry.id === id);
  }

  insert(qualification: Qualification): void {
    const result$: Observable<Qualification> = this.dataService.insert(qualification);
    const subscription: Subscription = result$.subscribe(
      value => QualificationsCacheService.reactiveCache.update(data => {
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
      value => QualificationsCacheService.reactiveCache.update(data => {
        data = data.filter(entry => entry.id !== qualification.id);
        data.push(value);
        return data;
      }
      )
    );
    this.subscriptions.push(subscription);
  }

  delete(id: number): void {
    const subscription: Subscription = this.dataService.delete(id).pipe(
      take(1),
      catchError(error=> error)
    ).subscribe(
      val => QualificationsCacheService.reactiveCache.update(values => values.filter(entry => entry.id !== id))
    );    
    this.subscriptions.push(subscription);
  }
}
