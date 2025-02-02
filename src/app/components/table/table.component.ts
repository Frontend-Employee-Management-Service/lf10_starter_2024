import { Component, Input, Signal } from '@angular/core';
import { TableConfiguration } from './table-configuration';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-table',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() configuration!: TableConfiguration<any>;
  @Input() data!: Signal<any[]>;

  delete(id: number): void {
    this.configuration.getCache().delete(id);
  }

  addToSelected(selector: string, dto: any): void {
    this.configuration.getCache().addToSelected(selector, dto);
  }
  removeFromSelected(selector: string, dto: any): void {
    this.configuration.getCache().removeFromSelected(selector, dto);
  }

  onCheckboxChange($event: Event, id: number) {
      if(($event.target as HTMLInputElement).checked){
        this.configuration.getCache().addToSelected(this.configuration.selection.selector, this.data().find(val => val.id == id));
      } else {
        this.configuration.getCache().removeFromSelected(this.configuration.selection.selector, this.data().find(val => val.id == id));
      }
    }


  isChecked(id: number): boolean {
    const selectedMap = this.configuration.getCache().viewSelected() as Map<string, any[]>;
    if(!selectedMap.has(this.configuration.selection.selector))
      return false;

    if(selectedMap.get(this.configuration.selection.selector)!.find(val => val.id == id))
      return true;
    return false;
  }
}
