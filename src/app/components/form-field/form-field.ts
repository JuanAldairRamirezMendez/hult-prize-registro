import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() icon: string = '';
}
