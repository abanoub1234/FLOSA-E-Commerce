import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule,NavbarComponent,ReactiveFormsModule,ChatbotComponent], // ✅ Ensure RouterModule is imported
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FLOSA_FRONT';

  showNavbar = true;
  constructor(private router: Router , @Inject(PLATFORM_ID) private platformId: any) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide navbar on login and register pages
        this.showNavbar = !['/login', '/register'].includes(event.url);
      }
    });


  // ✅ Prevent back navigation only if running in the browser
  if (isPlatformBrowser(this.platformId)) {
    this.preventBackNavigation();
    this.checkLoginStatus();
  }
  }

  preventBackNavigation() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      const isLoggedIn = !!localStorage.getItem('token');
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
      history.pushState(null, '', location.href);
    };
  }

  checkLoginStatus() {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      this.router.navigate(['/login']).then(() => {
        this.preventBackNavigation();
        window.location.reload(); // ✅ Reloads the page to clear session
      });
    }
  }


}
