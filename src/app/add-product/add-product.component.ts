import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {
  product = {
    name: '',
    type: 'local',
    color: '',
    price: null,
    image: '',
    store: '',
    description: '',
    careInstructions: ''
  };

  stores: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal) {}

  ngOnInit() {
    this.fetchStores();
  }

  fetchStores() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:3000/api/store/my-stores', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.stores = data;
      },
      error: (error) => {
        console.error('Error fetching stores:', error);
      }
    });
  }

  onSubmit(form: NgForm) {  // <-- Ensure form is of type NgForm
    if (!form || form.invalid) return;  // <-- Fix: Check if form is valid

    this.http.post('http://localhost:3000/api/products', this.product, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (response) => {
        console.log('Product Added:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = error.error.message || 'Failed to add product';
        this.modalService.open(document.getElementById('errorModal'));
      }
    });
  }
}
