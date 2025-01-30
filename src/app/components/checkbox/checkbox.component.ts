import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
  @Input() label = 'label';
  isChecked = false;
  @Output() eventTriggered = new EventEmitter<{ check: boolean; }>();

  onCheckboxChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;
    const result = {
      check: this.isChecked,
    };
    this.eventTriggered.emit(result);
    /*if (this.isChecked) {
      this.onChecked();
    } else {
      this.onUnchecked();
    }*/
  }

  /*onChecked() {
    console.log('Checkbox is checked!');
  }

  onUnchecked() {
    console.log('Checkbox is unchecked!');
  }*/
}
