import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = {};
  isEditing = false;
  apiErrorMessage = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.pattern('^[a-zA-Z ]*$')]],  // Only alphabetic characters
      email: ['', [
        Validators.pattern(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/)  // Email validation (optional)
      ]],
      password: ['', [Validators.minLength(6)]],  // Password validation
    });
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return console.error('No token found');

    this.http.get('http://localhost:3000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (data: any) => {
        this.user = data;
        this.profileForm.patchValue({
          name: data.name,
          email: data.email,
          role: data.role
        });
      },
      (error) => console.error('Error fetching profile', error)
    );
  }

  updateProfile() {
    this.apiErrorMessage = '';  // Clear any previous errors

    const token = localStorage.getItem('token');
    if (!token) return console.error('No token found');

    this.http.put('http://localhost:3000/api/users/profile', this.profileForm.value, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        console.log('Profile updated successfully');
        this.getProfile();
        this.toggleEdit();
      },
      (error) => {
        console.error('Update failed', error);
        this.apiErrorMessage = error.error?.message || 'Something went wrong!';
      }
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.patchValue({ name: this.user.name, email: this.user.email });
    }
  }

  get f() { return this.profileForm.controls; }  // Getter for form controls
}
