import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Qualification } from '../../models/Qualification';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-qualification-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './qualification-form.component.html',
  styleUrl: './qualification-form.component.css'
})
export class QualificationFormComponent {
  @Input() qualification: Qualification = new Qualification();

  @Output() formDataChange = new EventEmitter<Qualification>();

  updateFormData() {
    this.formDataChange.emit(this.qualification);
  }
}
