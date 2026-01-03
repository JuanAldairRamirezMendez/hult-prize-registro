import { Component, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
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
    this.errorMessage = '';

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

        // Redirigir a página de éxito después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/success']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en el registro', error);

        // Mostrar mensaje de error específico
        if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error del servidor. Inténtalo más tarde.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error desconocido. Inténtalo de nuevo.';
        }
      }
    });
  }
}
