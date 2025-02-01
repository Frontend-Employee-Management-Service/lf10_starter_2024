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

  addToSelected(selector: string, dto: any): void{
    this.configuration.getCache().addToSelected(selector, dto);
  }
  removeFromSelected(selector: string, dto: any): void{
    this.configuration.getCache().removeFromSelected(selector, dto);
  }
}
