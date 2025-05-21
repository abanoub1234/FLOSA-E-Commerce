import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  imports: [],
  standalone: true,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {

  ngOnInit(): void {
    this.startImageSlider();
  }

  startImageSlider() {
    let index = 0;
    const images = document.querySelectorAll<HTMLImageElement>('.slider-image');

    setInterval(() => {
      images.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
          img.classList.add('active');
        }
      });

      index = (index + 1) % images.length;
    }, 3000); // change image every 3 seconds
  }

}
