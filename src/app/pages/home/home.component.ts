import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegistroFormComponent } from '../../components/registro-form/registro-form';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule,RegistroFormComponent]
})
export class HomeComponent {
  
}
