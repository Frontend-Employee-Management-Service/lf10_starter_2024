import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-checkbox',
    imports: [],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
    @Input() label = 'label';
    @Input({transform: booleanAttribute}) defaultValue: boolean = true;
    isChecked = this.defaultValue;
    @Output() eventTriggered = new EventEmitter<{ check: boolean; }>();

    onCheckboxChange(event: Event) {
        this.isChecked = (event.target as HTMLInputElement).checked;
        const result = {
            check: this.isChecked,
        };
        this.eventTriggered.emit(result);
    }
}
