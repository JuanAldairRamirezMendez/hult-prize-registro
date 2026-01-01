import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [HeaderComponent, HomeComponent, FooterComponent]
})
export class App {}
