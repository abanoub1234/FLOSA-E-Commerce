import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: any[] = [];
  selectedCourse: any = null;
  registerForm!: FormGroup;
  message: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchCourses();
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.registerForm.updateValueAndValidity();
  }

  // Function to get the token from local storage or any other source
  getToken(): string {
    return localStorage.getItem('token') || '';  // Ensure token is stored in localStorage after login
  }

  // Function to create authorized headers
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // Add Bearer token for authorization
      'Content-Type': 'application/json'
    });
  }

  fetchCourses() {
    this.http.get<any[]>('http://localhost:3000/api/courses/', { headers: this.getAuthHeaders() })
      .subscribe(
        (data) => {
          this.courses = data;
        },
        (error) => {
          console.error('Error fetching courses:', error);
        }
      );
  }

  apply(course: any) {
    this.selectedCourse = course;

    this.registerForm.setValue({
      name: '',
      email: ''
    });

    this.registerForm.markAsUntouched();
    this.registerForm.markAsPristine();
    this.registerForm.updateValueAndValidity();

    console.log('Applying for:', course);
    console.log('Form Valid:', this.registerForm.valid);
  }

  register() {
    if (this.registerForm.invalid) {
      console.log('Form is invalid:', this.registerForm.errors);
      console.log('Name Errors:', this.registerForm.controls['name'].errors);
      console.log('Email Errors:', this.registerForm.controls['email'].errors);
      return;
    }

    if (this.selectedCourse) {
      const registrationData = this.registerForm.value;
      this.http.post(
        `http://localhost:3000/api/courses/register/${this.selectedCourse._id}`,
        registrationData,
        { headers: this.getAuthHeaders() } // Include authorization headers
      ).subscribe(
        (response: any) => {
          this.message = response.message || 'Registered successfully!';
          this.selectedCourse = null;
          this.registerForm.reset();
        },
        (error) => {
          console.error('Registration failed:', error);
          this.message = 'Registration failed. Try again.';
        }
      );
    }
  }

  logFormState() {
    console.log('Form Valid:', this.registerForm.valid);
    console.log('Form Values:', this.registerForm.value);
    console.log('Name Control Status:', this.registerForm.controls['name'].status);
    console.log('Email Control Status:', this.registerForm.controls['email'].status);
    console.log('Name Errors:', this.registerForm.controls['name'].errors);
    console.log('Email Errors:', this.registerForm.controls['email'].errors);
  }
}
