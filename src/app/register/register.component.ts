import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  };

  store = {
    name: '',
    locationName: '',
    location: ''
  };

  apiError: string = ''; // To store API error messages

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.apiError = ''; // Reset error before making a request

    this.http.post('http://localhost:3000/api/users/register', this.user).subscribe({
      next: (response: any) => {
        if (this.user.role === 'seller') {
          const storeData = {
            name: this.store.name,
            locationName: this.store.locationName,
            location: this.store.location,
            seller: response.userId // Backend should return userId
          };

          this.http.post('http://localhost:3000/api/store/', storeData).subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
            error: (error) => {
              this.apiError = error.error.message || 'Failed to register store. Please try again.';
            }
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.apiError = error.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}
