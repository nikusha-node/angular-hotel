import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isScrolled = false;

  @HostListener('window:scroll', []) 
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

}
