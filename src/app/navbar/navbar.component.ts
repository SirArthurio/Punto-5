import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,NgIf,MatIconModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  isInicio(): boolean {
    return this.router.url === '/';
  }
}
