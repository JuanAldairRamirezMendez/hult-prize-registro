import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  credentials = { email: '', password: '' };
  loading = false;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }

  signIn() {
    if (!this.credentials.email || !this.credentials.password) return;
    this.loading = true;
    this.http.post<any>('http://localhost:3000/admin/login', this.credentials)
      .subscribe(res => {
        this.loading = false;
        if (res && res.token) {
          localStorage.setItem('admin_token', res.token);
          this.router.navigate(['/admin/dashboard']);
        }
      }, err => {
        this.loading = false;
        console.error('Login failed', err);
        if (err && err.status === 404) {
          if (confirm('No existe una cuenta con ese email. ¿Deseas registrarte?')) {
            this.router.navigate(['/admin/register']);
            return;
          }
        }
        alert(err?.error?.message || 'Credenciales inválidas');
      });
  }

}
