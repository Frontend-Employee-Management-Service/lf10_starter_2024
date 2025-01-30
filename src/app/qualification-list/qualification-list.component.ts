import {Component} from '@angular/core';
import {CheckboxComponent} from "../components/checkbox/checkbox.component";
import {TextFilterComponent} from "../components/text-filter/text-filter.component";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [
    CheckboxComponent,
    TextFilterComponent
  ],
  templateUrl: './qualification-list.component.html',
  styleUrl: './qualification-list.component.css'
})
export class QualificationListComponent {
  //By default both checkboxes are checked (list all the entries)
  private inUseIsChecked: boolean = true;
  private unusedIsChecked: boolean = true;

  constructor() {
  }

  handleEventInUseCheckbox(event: { check: boolean }) {
    this.inUseIsChecked = event.check;
    this.doFilter();
  }

  handleEventUnusedCheckbox(event: { check: boolean }) {
    this.unusedIsChecked = event.check;
    this.doFilter();
  }

  handleEventFilterByQualification($event: { value: string }) {
    this.doFilter();
  }

  handleEventFilterByEmployee(event: {value: string}) {
    this.doFilter()
  }

  private doFilter() {
    console.log("doFilter()");
    console.log('in use:' + this.inUseIsChecked);
    console.log('Unused:' + this.unusedIsChecked);
  }

}
