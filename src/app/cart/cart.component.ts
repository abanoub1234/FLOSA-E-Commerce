import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';   // Import FormsModule

@Component({
  selector: 'app-cart',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart: any[] = [];
  mobileNumber: string = '';
  paymentMethod: string = 'cash-on-delivery';
  totalCost: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve the cart from localStorage
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.calculateTotalCost();
  }

  calculateTotalCost(): void {
    this.totalCost = this.cart.reduce((acc, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 1;
      return acc + (price * quantity);
    }, 0);
  }
  

  // Optional: Method to clear the cart
  clearCart(): void {
    this.cart = [];
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotalCost();
  }

  removeByIndex(index: number): void {
    this.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotalCost();
  }
  
  
  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotalCost();
  }
  

  placeOrder(): void {
    if (!this.mobileNumber.trim()) {
      alert('Please enter your mobile number.');
      return;
    }
  
    if (this.cart.length === 0) {
      alert('Your cart is empty. Please add products to place an order.');
      return;
    }
  
    alert(`Order sent to your location. Mobile: ${this.mobileNumber}`);
    
    // Clear the cart after placing the order
    this.clearCart();
  }
  
}
