import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-text-filter',
  imports: [
    FormsModule
  ],
  templateUrl: './text-filter.component.html',
  styleUrl: './text-filter.component.css',
  standalone: true
})
export class TextFilterComponent {
  @Input() title: string = '';
  value: string = '';
  @Output() eventTriggered = new EventEmitter<{ value: string; event: string }>();

  onInputEvent(eventType: string) {
    console.log(`${eventType},${this.value}`);
    const result = {
      value: this.value,
      event: eventType,
    };
    this.eventTriggered.emit(result);
  }
}
