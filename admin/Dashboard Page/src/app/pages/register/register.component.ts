import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  model = { username: '', email: '', password: '' };
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.model.username || !this.model.email || !this.model.password) return;
    this.loading = true;
    this.http.post<any>('http://localhost:3000/admin/register', this.model)
      .subscribe(res => {
        this.loading = false;
        alert('Administrador creado correctamente. Ahora inicia sesión.');
        this.router.navigate(['/login']);
      }, err => {
        this.loading = false;
        console.error('Register failed', err);
        alert(err?.error?.message || 'Error al crear administrador');
      });
  }
}
