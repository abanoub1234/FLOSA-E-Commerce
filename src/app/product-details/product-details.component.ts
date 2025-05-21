import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ✅ Import this
import { Router } from '@angular/router';  // ✅ Import Router
import { CartComponent } from '../cart/cart.component';

interface Review {
  user: string;
  comment: string;
  rating: number;
}

interface Seller {
  name: string;
  email: string;
}

interface Store {
  name: string;
  locationName: string;
}

interface Product {
  _id: string;
  name: string;
  type: string;
  color: string;
  price: number;
  image: string;
  description: string;
  careInstructions: string;
  seller: Seller;
  store: Store;
  reviews: Review[];
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  cart: any[] = [];  // Store the cart items here
  apiUrl = 'http://localhost:3000/api/products/';

  constructor(private route: ActivatedRoute, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.http.get<Product>(this.apiUrl + productId).subscribe(
        (data) => (this.product = data),
        (error) => console.error('Error fetching product details:', error)
      );
    }
  }

  showMessage: boolean = false;

  addToCart(product: any) {
    // Retrieve existing cart from localStorage or initialize an empty array
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Add the product to the cart
    this.cart.push(product);
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(this.cart));
  
    // Show success message
    this.showMessage = true;
  
    // Auto-hide the message after 3 seconds
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }
  


  goHome() {
    this.router.navigate(['/home']);
  }

}