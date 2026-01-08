import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {

  form: UntypedFormGroup;
  sponsorForm: UntypedFormGroup;
  loading = false;
  success = false;
  errorMessage = '';
  sponsorLoading = false;
  sponsorSuccess = false;
  sponsorError = '';

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

  constructor(private fb: UntypedFormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(2)]],
      leaderName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^\\d{0,9}$')]],
      members: [2, [Validators.min(2), Validators.max(4)]],
      projectName: [''],
      category: [[], this.categoryValidator(1, 3)],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]]
    });

    // Inicializar formulario de sponsors
    this.sponsorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      message: ['']
    });
  }

  categoryValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value || [];
      if (!Array.isArray(v)) {
        return { categoryCount: true };
      }
      if (v.length < min || v.length > max) {
        return { categoryCount: true };
      }
      return null;
    };
  }

  isCategorySelected(cat: string) {
    const arr = this.form.get('category')?.value || [];
    return Array.isArray(arr) && arr.includes(cat);
  }

  toggleCategory(cat: string) {
    const control = this.form.get('category');
    if (!control) return;
    const arr = Array.isArray(control.value) ? [...control.value] : [];
    const idx = arr.indexOf(cat);
    if (idx > -1) {
      arr.splice(idx, 1);
    } else {
      if (arr.length >= 3) return;
      arr.push(cat);
    }
    control.setValue(arr);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  ngOnInit() {
  }

  submitSponsor() {
    this.sponsorError = '';
    if (this.sponsorForm.invalid) {
      this.sponsorForm.markAllAsTouched();
      return;
    }
    this.sponsorLoading = true;

    const payload = {
      name: this.sponsorForm.value.name,
      contactName: this.sponsorForm.value.contactName,
      email: this.sponsorForm.value.email,
      phone: this.sponsorForm.value.phone,
      website: this.sponsorForm.value.website,
      message: this.sponsorForm.value.message
    };

    // Leer la URL del backend desde /assets/config.json en tiempo de ejecución
    fetch('/assets/config.json')
      .then(res => res.json())
      .then(cfg => {
        const base = cfg?.BACKEND_URL || 'http://localhost:3000';
        const url = base.replace(/\/$/, '') + '/sponsors';
        this.http.post(url, payload).subscribe({
          next: (res: any) => {
            this.sponsorLoading = false;
            this.sponsorSuccess = true;
            this.sponsorForm.reset();
          },
          error: (err) => {
            console.error('Error al enviar sponsor', err);
            this.sponsorLoading = false;
            this.sponsorError = err?.error?.message || 'Error al enviar la solicitud';
          }
        });
      })
      .catch(err => {
        console.error('No se pudo leer config.json', err);
        this.sponsorLoading = false;
        this.sponsorError = 'No se pudo determinar la URL del servidor';
      });
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

    // Leer la URL del backend desde /assets/config.json en tiempo de ejecución
    fetch('/assets/config.json')
      .then(res => res.json())
      .then(cfg => {
        const base = cfg?.BACKEND_URL || 'http://localhost:3000';
        const url = base.replace(/\/$/, '') + '/registro';
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
      })
      .catch(err => {
        console.error('No se pudo leer config.json', err);
        this.loading = false;
        this.errorMessage = 'No se pudo determinar la URL del servidor';
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
