import { Component, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { environment as prodEnvironment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.html',
  styleUrls: ['./registro-form.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegistroFormComponent {
  private apiUrl = isDevMode() ? environment.apiUrl : prodEnvironment.apiUrl;
  categories = [
    'Salud','Educación','Medio Ambiente','Agricultura','Energía',
    'Inclusión Financiera','Tecnología para el Bien','Agua y Saneamiento','Otros'
  ];

  form: FormGroup;
  submitted = false;
  success = false;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      teamName: ['', Validators.required],
      leaderName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      members: [1, [Validators.required, Validators.min(1)]],
      projectName: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.http.post(`${this.apiUrl}/registro`, this.form.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        console.log('Registro exitoso', response);
        this.form.reset({ members: 1, category: '' });
        this.form.markAsPristine();
        this.form.markAsUntouched();
        setTimeout(() => (this.success = false), 5000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en el registro', error);
        // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje
      }
    });
  }
}
