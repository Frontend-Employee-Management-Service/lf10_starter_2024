import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-text-filter',
  imports: [],
  templateUrl: './text-filter.component.html',
  styleUrl: './text-filter.component.css'
})
export class TextFilterComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() action: string = '';
  @Output() eventTriggered = new EventEmitter<{ action: string; value: string; event: string }>();

  onInputEvent(eventType: string) {
    const result = {
      action: this.action,
      value: this.value,
      event: eventType,
    };
    this.eventTriggered.emit(result);
  }
}
