import { Injectable, OnDestroy, signal, Signal, WritableSignal } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class DataCache<T extends { id?: number }> implements OnDestroy {
  protected subscriptions: Subscription[] = [];
  public readonly isLoading: WritableSignal<Set<number>> = signal(new Set<number>());

  public getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  public abstract getSelectedData(): Map<string, T[]>;

  public abstract refresh(): void;

  public abstract read(): Signal<T>;

  public abstract insert(dto: T): void;

  public abstract update(dto: T): void;

  public abstract delete(id: number): void;

  public addToSelected(selector: string, dto: T): void {
    const collection: T[] =
      this.getSelectedData().has(selector) ?
        this.getSelectedData().get(selector)! :
        new Array<T>();
    collection.push(dto);
    this.getSelectedData().set(selector, collection);
  }

  public removeFromSelected(selector: string, dto: T): void {
    if (!this.getSelectedData().has(selector))
      return;
    const collection: T[] = this.getSelectedData().get(selector)!;
    const updatedCollection: T[] = collection.filter(entry => entry.id === dto.id);
    this.getSelectedData().set(selector, updatedCollection);
  }

  public withdrawSelected(selector: string): T[] {
    if (!this.getSelectedData().has(selector))
      return new Array<T>();
    const collection: T[] = this.getSelectedData().get(selector)!;
    this.getSelectedData().delete(selector);
    return collection;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}