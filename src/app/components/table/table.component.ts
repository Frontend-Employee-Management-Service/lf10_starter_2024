import { Component, Input } from '@angular/core';
import { TableConfiguration } from './table-configuration';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() configuration!: TableConfiguration<any>;

  delete(id: number): void {
    console.log(this.configuration.getCache().read()())
    console.log("table component: " +id);
    this.configuration.getCache().delete(id);
  }

  addToSelected(selector: string, dto: any): void{
    this.configuration.getCache().addToSelected(selector, dto);
  }
  removeFromSelected(selector: string, dto: any): void{
    this.configuration.getCache().removeFromSelected(selector, dto);
  }
}
