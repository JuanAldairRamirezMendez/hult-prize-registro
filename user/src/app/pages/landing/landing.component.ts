import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {

  form: FormGroup;
  loading = false;
  success = false;
  errorMessage = '';

  // Lista de los 17 ODS en español
  categories: string[] = [
    '1. Fin de la pobreza',
    '2. Hambre cero',
    '3. Salud y bienestar',
    '4. Educación de calidad',
    '5. Igualdad de género',
    '6. Agua limpia y saneamiento',
    '7. Energía asequible y no contaminante',
    '8. Trabajo decente y crecimiento económico',
    '9. Industria, innovación e infraestructura',
    '10. Reducción de las desigualdades',
    '11. Ciudades y comunidades sostenibles',
    '12. Producción y consumo responsables',
    '13. Acción por el clima',
    '14. Vida submarina',
    '15. Vida de ecosistemas terrestres',
    '16. Paz, justicia e instituciones sólidas',
    '17. Alianzas para lograr los objetivos'
  ];

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(2)]],
      leaderName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      members: [1, [Validators.min(1), Validators.max(20)]],
      projectName: [''],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload = {
      teamName: this.form.value.teamName,
      leaderName: this.form.value.leaderName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      members: this.form.value.members,
      projectName: this.form.value.projectName,
      category: this.form.value.category,
      description: this.form.value.description
    };

    // Ajusta la URL si tu backend corre en otro host/puerto
    const url = 'http://localhost:3000/registro';

    this.http.post(url, payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = true;
        // opcional: limpiar form
        this.form.reset({ members: 1 });
      },
      error: (err) => {
        console.error('Error al enviar registro', err);
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Error al enviar el registro';
      }
    });
  }

  scrollToRegister(event: Event) {
    if (event) {
      event.preventDefault();
    }
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
