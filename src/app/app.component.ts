import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,RouterLink,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {}
