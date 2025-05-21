import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any; // Bootstrap for modal handling

interface Store {
  _id: string;
  name: string;
  locationName: string;
  location: string; // This will contain the Google Maps URL or coordinates
  seller: string;
  image?: string;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  stores: Store[] = [];
  filteredStores: Store[] = []; // To store filtered results
  apiUrl = 'http://localhost:3000/api/store/'; // Replace with your actual API URL
  mapUrl: SafeResourceUrl = '';
  searchQuery: string = ''; // Search query variable

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.fetchStores();
  }

  fetchStores() {
    this.http.get<Store[]>(this.apiUrl).subscribe(
      (data) => {
        this.stores = data.map((store) => ({
          ...store,
          image: store.image || 'https://c8.alamy.com/comp/2ARTPWP/tokyo-japan-august-2019-a-colorful-flower-shop-in-a-street-of-setagaya-neighborhood-2ARTPWP.jpg' // Default image
        }));
        this.filteredStores = [...this.stores]; // Initialize filteredStores
      },
      (error) => {
        console.error('Error fetching stores:', error);
      }
    );
  }

  
  
  filterStores() {
    console.log('Search Query:', this.searchQuery);
  
    if (!this.searchQuery) {
      this.filteredStores = [...this.stores];
      console.log('Resetting to all stores');
      return;
    }
  
    this.filteredStores = this.stores.filter(store =>
      store.locationName.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
    );
  
    console.log('Filtered Stores:', this.filteredStores);
  }
  

  openMap(location: string) {
    if (!location) {
      console.error('Location not available');
      return;
    }
  
    // If the location is a shortened URL, open it in a new tab instead
    if (location.includes('goo.gl') || location.includes('maps.app.goo.gl')) {
      window.open(location, '_blank');
      return;
    }
  
    // Process Google Maps coordinates or place names
    const isCoordinates = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location);
    let googleMapsUrl: string;
  
    if (isCoordinates) {
      googleMapsUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${location}&zoom=14`;
    } else {
      googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(location)}`;
    }
  
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleMapsUrl);
  
    // Open Bootstrap modal
    const modalElement = document.getElementById('mapModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  
}
