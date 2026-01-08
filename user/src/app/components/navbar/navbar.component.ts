import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  showMenu = false;
  constructor(private router: Router) {}
  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }

  scrollToSponsor(event: Event){
    event.preventDefault();
    const el = document.getElementById('sponsor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/landing'], { fragment: 'sponsor' });
    }
    this.showMenu = false;
  }
}
