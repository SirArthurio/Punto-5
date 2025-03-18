import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  selector: 'app-punto4',
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './punto4.component.html',
  styleUrl: './punto4.component.css',
})
export class Punto4Component implements OnInit {
  categoriaSeleccionada = '';
  tiempoSeleccionado = 'Tiempo Completo';
  tituloSeleccionado = '';
  investigacionSeleccionada = '';
  salarioCalculado: number | null = null;
  historicoSalarios: { name: string; value: number }[] = [];
  salarioTotalPunto4: number = 0;
  simulacionesTotalesPunto4 = 0;
  totalAlmacenado: number = 0;
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454'],
  };
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): any {
    this.cargarValores();
  }
  cargarValores() {
    this.salarioTotalPunto4 =
      Number(localStorage.getItem('salarioTotalPunto4')) || 0;
    this.simulacionesTotalesPunto4 =
      Number(localStorage.getItem('simulacionesTotalPunto4')) || 0;
      const historialGuardado = localStorage.getItem('historicoSalariosPunto4');
      this.historicoSalarios = historialGuardado ? JSON.parse(historialGuardado) : [];
    this.cdr.detectChanges();
  }

  calcularSalario() {
    let sueldoBase = 0;
    let bonificacionPostgrado = 0;
    let bonificacionInvestigacion = 0;

    // Definir sueldo base
    if (this.categoriaSeleccionada === 'Auxiliar') {
      sueldoBase =
        this.tiempoSeleccionado === 'Tiempo Completo' ? 2.645 : 1.509;
    } else if (this.categoriaSeleccionada === 'Asistente') {
      sueldoBase =
        this.tiempoSeleccionado === 'Tiempo Completo' ? 3.125 : 1.749;
    } else if (this.categoriaSeleccionada === 'Asociado') {
      sueldoBase = this.tiempoSeleccionado === 'Tiempo Completo' ? 3.606 : 1.99;
    } else if (this.categoriaSeleccionada === 'Titular') {
      sueldoBase =
        this.tiempoSeleccionado === 'Tiempo Completo' ? 3.918 : 2.146;
    }

    // Definir bonificación por título
    if (this.tituloSeleccionado === 'Especialización') {
      bonificacionPostgrado = sueldoBase * 0.1;
    } else if (this.tituloSeleccionado === 'Maestría') {
      bonificacionPostgrado = sueldoBase * 0.45;
    } else if (this.tituloSeleccionado === 'Doctorado') {
      bonificacionPostgrado = sueldoBase * 0.9;
    }

    // Definir bonificación por productividad
    if (this.investigacionSeleccionada === 'A1') {
      bonificacionInvestigacion = sueldoBase * 0.56;
    } else if (this.investigacionSeleccionada === 'A') {
      bonificacionInvestigacion = sueldoBase * 0.47;
    } else if (this.investigacionSeleccionada === 'B') {
      bonificacionInvestigacion = sueldoBase * 0.42;
    } else if (this.investigacionSeleccionada === 'C') {
      bonificacionInvestigacion = sueldoBase * 0.38;
    } else if (this.investigacionSeleccionada === 'Reconocido Minciencias') {
      bonificacionInvestigacion = sueldoBase * 0.33;
    } else if (this.investigacionSeleccionada === 'Semillero') {
      bonificacionInvestigacion = sueldoBase * 0.19;
    }

    // Calcular salario final
    this.salarioCalculado =
      sueldoBase + bonificacionPostgrado + bonificacionInvestigacion;
      this.historicoSalarios = [
        ...this.historicoSalarios,
        { name: `Simulación ${this.historicoSalarios.length + 1}`, value: this.salarioCalculado! },
      ];
      this.guardarHistorialSalarios();
    
    console.log(
      'salario pre: ',
      this.salarioTotalPunto4,
      'simulaciones:',
      this.simulacionesTotalesPunto4
    );
    this.totalAlmacenado =
      this.salarioTotalPunto4 + this.salarioCalculado * 1423500;
      this.simulacionesTotalesPunto4 += 1;
      console.log('salario post:', this.totalAlmacenado);
    localStorage.setItem('salarioTotalPunto4', this.totalAlmacenado.toString());
    localStorage.setItem(
      'simulacionesTotalPunto4',
      this.simulacionesTotalesPunto4.toString()
    );
  }
  simularVariasVeces(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
      this.simularDatos();
    }
  }

  simularDatos() {
    const categorias = ['Auxiliar', 'Asistente', 'Asociado', 'Titular'];
    const tiempos = ['Tiempo Completo', 'Medio Tiempo'];
    const titulos = ['Especialización', 'Maestría', 'Doctorado'];
    const investigaciones = [
      'A1',
      'A',
      'B',
      'C',
      'Reconocido Minciencias',
      'Semillero',
    ];

    this.categoriaSeleccionada = this.getRandom(categorias);
    this.tiempoSeleccionado = this.getRandom(tiempos);
    this.tituloSeleccionado = this.getRandom(titulos);
    this.investigacionSeleccionada = this.getRandom(investigaciones);

    this.calcularSalario();
  }

  getRandom(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
  guardarHistorialSalarios() {
    localStorage.setItem('historicoSalariosPunto4', JSON.stringify(this.historicoSalarios));
  }
}
