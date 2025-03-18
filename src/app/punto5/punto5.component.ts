import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-punto5',
  imports: [CommonModule],
  templateUrl: './punto5.component.html',
  styleUrl: './punto5.component.css'
})
export class Punto5Component implements OnInit{
  salarioTotalPunto3: number = 0;
  salarioTotalPunto4: number = 0;
  simulacionesTotalPunto4=0
  simulacionesTotalPunto3=0
  simulacionesTotales=0
  total: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarValores();
    this.calculo();
  }

  cargarValores() {
    this.salarioTotalPunto4 = Number(localStorage.getItem('salarioTotalPunto4')) || 0;
    this.salarioTotalPunto3 = Number(localStorage.getItem('salarioTotalPunto3')) || 0;
    this.simulacionesTotalPunto4 = Number(localStorage.getItem('simulacionesTotalPunto4')) || 0;
    this.simulacionesTotalPunto3 = Number(localStorage.getItem('simulacionesTotalPunto3')) || 0;
  }

  calculo() {
    this.total = this.salarioTotalPunto3 + this.salarioTotalPunto4;
    this.simulacionesTotales=this.simulacionesTotalPunto3+this.simulacionesTotalPunto4;
    this.cdr.detectChanges();  
  }
}
