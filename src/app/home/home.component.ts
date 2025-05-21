import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  role: string | null = null;
  products: any[] = []; 
  filteredProducts: any[] = []; 
  uniqueTypes: string[] = []; 
  favorites: any[] = []; // Store favorite products from API

  selectedType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  showFavorites: boolean = false;

  constructor(private http: HttpClient, private router: Router , private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.role = localStorage.getItem('role');
    this.loadProducts();
    this.loadFavorites();
  }
  
  viewDetails(product: any): void {
    this.router.navigate(['/product-details', product._id]);
  }
  
  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/api/products/').subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.uniqueTypes = [...new Set(this.products.map(p => p.type))];
      },
      (error) => console.error('Error loading products:', error)
    );
  }

  loadFavorites() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/api/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (data) => {
        this.favorites = data.map(fav => fav.product);
        this.filterProducts();
      },
      (error) => console.error('Error loading favorites:', error)
    );
  }

  toggleFavorite(product: any) {
    const token = localStorage.getItem('token');
    this.http.post(`http://localhost:3000/api/favorites/${product._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        if (this.isFavorite(product)) {
          this.favorites = this.favorites.filter(fav => fav._id !== product._id);
        } else {
          this.favorites.push(product);
        }
        this.filterProducts();
      },
      (error) => console.error('Error updating favorite:', error)
    );
  }

  isFavorite(product: any): boolean {
    return this.favorites.some(fav => fav._id === product._id);
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesType = this.selectedType ? product.type === this.selectedType : true;
      const matchesMinPrice = this.minPrice !== null ? product.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? product.price <= this.maxPrice : true;
      const matchesFavorites = this.showFavorites ? this.isFavorite(product) : true;

      return matchesType && matchesMinPrice && matchesMaxPrice && matchesFavorites;
    });
  }
}
