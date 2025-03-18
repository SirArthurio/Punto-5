import { Component, ViewChild  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Punto3Component } from '../punto3/punto3.component';
import { Punto4Component } from '../punto4/punto4.component';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink,Punto3Component],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  @ViewChild(Punto3Component) punto3!: Punto3Component;
  @ViewChild(Punto4Component) punto4!: Punto4Component;

  calcular() {
    if (this.punto3 && this.punto4) {
      this.punto3.simularVariasVeces(20);
      this.punto4.simularVariasVeces(20);
    } else {
      console.error("No se pudieron acceder a los componentes.");
    }
  }
}