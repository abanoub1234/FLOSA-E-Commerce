import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports : [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Fetch user role from local storage or API
    this.role = localStorage.getItem('role'); // Example: 'seller' or 'buyer'
  }

  addProduct() {
    console.log('Redirecting to add product page...');
    ///this.router.navigate(['/add-product']);
  }

 
  logout() {
    localStorage.removeItem('token'); // Clear session
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    this.router.navigate(['/login']).then(() => {
      history.pushState(null, '', location.href);
      window.onpopstate = () => {
        history.pushState(null, '', location.href);
      };
    });
  }
}

