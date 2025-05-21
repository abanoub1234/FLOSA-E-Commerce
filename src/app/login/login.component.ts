import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = ''; // Holds error messages
  isLoading: boolean = false; // Show loading state

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']); // Redirect if already logged in
    }
  }

  validateForm(): boolean {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'All fields are required!';
      this.showPopup();
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.credentials.email)) {
      this.errorMessage = 'Invalid email format!';
      this.showPopup();
      return false;
    }

    if (this.credentials.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters!';
      this.showPopup();
      return false;
    }

    return true;
  }

  login() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.http.post('http://localhost:3000/api/users/login', this.credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('name', response.name);
        this.router.navigate(['/']);
        window.location.reload();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.status === 401
            ? 'Email or password is incorrect!'
            : 'Something went wrong. Please try later!';
        this.showPopup();
      },
    });
  }

  showPopup() {
    // Display the error message
  }

  closeAlert() {
    // Close the alert when the user clicks on the close button
    this.errorMessage = '';
  }
}
