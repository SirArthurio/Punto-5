import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  selector: 'app-punto3',
  imports: [NgIf, NgxChartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './punto3.component.html',
  styleUrl: './punto3.component.css',
})
export class Punto3Component implements OnInit {
  salarioForm: FormGroup;
  salarioTotal: number | null = null;
  valorPunto: number = 20895;
  historicoSalarios: { name: string; value: number }[] = [];
  salarioTotalPunto3: number = 0;
  totalAlmacenado: number = 0;
  simulacionesTotales = 0;
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454'],
  };

  ngOnInit(): any {
    this.cargarValores();
  }

  tiposProduccion = [
    { nombre: 'Artículos A1', puntos: 15, limite: 15 },
    { nombre: 'Artículos A2', puntos: 12, limite: 12 },
    { nombre: 'Artículos B', puntos: 8, limite: 15 },
    { nombre: 'Artículos C', puntos: 3, limite: 15 },
    { nombre: 'Artículo en revista indexada', puntos: 5, limite: 50 },
    {
      nombre: 'Producción de video nacional',
      puntos: 7,
      limite: 35,
      maxProductos: 5,
    },
    {
      nombre: 'Producción de video internacional',
      puntos: 12,
      limite: 60,
      maxProductos: 5,
    },
    { nombre: 'Patente', puntos: 25, limite: 100 },
    { nombre: 'Libro de texto', puntos: 15, limite: 80 },
    { nombre: 'Libro de investigación', puntos: 20, limite: 120 },
    { nombre: 'Premio nacional', puntos: 15, limite: 150 },
    { nombre: 'Premio internacional', puntos: 20, limite: 200 },
    { nombre: 'Traducción de libros', puntos: 15, limite: 40 },
    { nombre: 'Obra artística internacional', puntos: 20, limite: 60 },
    { nombre: 'Obra artística nacional', puntos: 14, limite: 60 },
    { nombre: 'Producción técnica', puntos: 15, limite: 70 },
    { nombre: 'Producción de software', puntos: 15, limite: 90 },
  ];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.salarioForm = this.fb.group({
      gradoAcademico: ['', Validators.required],
      categoria: ['', Validators.required],
      numAutores: [0, [Validators.min(0)]],
      experienciaDocente: [0, Validators.required],
      experienciaNoDocente: [0, Validators.required],
      experienciaDireccion: [0, Validators.required],
      experienciaInvestigacion: [0, Validators.required],
      añosEspecializacion: [0, [Validators.min(0)]],
      numEspecializaciones: [0, [Validators.min(0), Validators.max(2)]],
      numMaestrias: [0, [Validators.min(0), Validators.max(2)]],
      numDoctorados: [0, [Validators.min(0), Validators.max(2)]],
      produccionAcademica: this.fb.array(
        this.tiposProduccion.map(() => this.fb.control(0))
      ),
    });
  }

  calcularSalario() {
    console.log(this.salarioForm.value);
    const {
      gradoAcademico,
      categoria,
      añosEspecializacion,
      numEspecializaciones,
      numMaestrias,
      numDoctorados,
      experienciaDocente,
      experienciaNoDocente,
      experienciaDireccion,
      experienciaInvestigacion,
    } = this.salarioForm.value;

    const añosEspecializacionNum = Number(añosEspecializacion) || 0;
    let esEspecializacionClinica = false;

    let puntosTitulo = this.obtenerPuntosPorTitulo(
      gradoAcademico,
      numEspecializaciones,
      añosEspecializacionNum,
      esEspecializacionClinica,
      numMaestrias,
      numDoctorados
    );

    let puntosCategoria = this.obtenerPuntosPorCategoria(categoria);
    let puntosExperiencia = this.calcularPuntosExperiencia(
      experienciaDocente,
      experienciaInvestigacion,
      experienciaNoDocente,
      experienciaDireccion,
      categoria
    );
    let puntosProductividad = this.calcularPuntosProductividad(
      this.salarioForm.value.produccionAcademica,
      this.salarioForm.value.numAutores,
      categoria
    );

    let totalPuntos =
      puntosTitulo + puntosCategoria + puntosExperiencia + puntosProductividad;

    this.salarioTotal = totalPuntos * this.valorPunto;

    this.historicoSalarios = [
      ...this.historicoSalarios,
      { name: `Simulación ${this.historicoSalarios.length + 1}`, value: this.salarioTotal! },
    ];
    this.guardarHistorialSalarios();
  
    this.salarioTotalPunto3 =
      Number(localStorage.getItem('salarioTotalPunto3')) || 0;
    console.log(
      'salario pre: ',
      this.salarioTotalPunto3,
      'numero de simulaciones pre:',
      this.simulacionesTotales
    );
    this.totalAlmacenado = this.salarioTotalPunto3 + this.salarioTotal;
    this.simulacionesTotales += 1;
    console.log('salario post:', this.totalAlmacenado);
    localStorage.setItem('salarioTotalPunto3', this.totalAlmacenado.toString());
    localStorage.setItem(
      'simulacionesTotalPunto3',
      this.simulacionesTotales.toString()
    );

    console.log('--- Cálculo de Salario ---');
    console.log(`🎓 Puntos por Título Académico: ${puntosTitulo}`);
    console.log(`📚 Puntos por Categoría: ${puntosCategoria}`);
    console.log(`⌛ Puntos por Experiencia: ${puntosExperiencia}`);
    console.log(`📑 Puntos por Productividad: ${puntosProductividad}`);
    console.log(`🔹 Total de Puntos: ${totalPuntos}`);
    console.log(`💰 Salario Total: $${this.salarioTotal}`);
    this.formatearDatos();
  }
  actualizarCantidad(index: number, event: any) {
    const cantidad = +event.target.value || 0;
    (this.salarioForm.get('produccionAcademica') as FormArray)
      .at(index)
      .setValue(cantidad);
    console.log(
      '🔹 Nueva Cantidad en Producción Académica:',
      this.salarioForm.value
    );
  }

  esPosgrado(): boolean {
    const grado = this.salarioForm.get('gradoAcademico')?.value;
    return ['Postgrado'].includes(grado);
  }
  cargarValores() {
    this.salarioTotalPunto3 =
      Number(localStorage.getItem('salarioTotalPunto3')) || 0;
    this.simulacionesTotales =
      Number(localStorage.getItem('simulacionesTotalPunto3')) || 0;
      const historialGuardado = localStorage.getItem('historicoSalariosPunto3');
      this.historicoSalarios = historialGuardado ? JSON.parse(historialGuardado) : [];
    this.cdr.detectChanges();
  }

  obtenerPuntosPorTitulo(
    gradoAcademico: string,
    numEspecializaciones: number,
    añosEspecializacion: number,
    esEspecializacionClinica: boolean = false,
    numMaestrias: number,
    numDoctorados: number
  ): number {
    let puntosPregrado = 0;
    let puntosPosgrado = 0;

    if (gradoAcademico === 'Pregrado en Medicina o Composición Musical') {
      puntosPregrado = 183;
    } else {
      puntosPregrado = 178;
    }

    if (numDoctorados > 0) {
      if (numDoctorados === 1 && numMaestrias === 0) {
        puntosPosgrado += 120;
      } else {
        puntosPosgrado += Math.min(120, numDoctorados * 80);
      }
      if (numDoctorados === 2 && numMaestrias === 0) {
        puntosPosgrado = 140;
      }
    }

    if (numMaestrias > 0) {
      if (numMaestrias === 1) {
        puntosPosgrado += 40;
      } else {
        puntosPosgrado += 60;
      }
    }

    if (numEspecializaciones > 0) {
      if (esEspecializacionClinica) {
        puntosPosgrado += Math.min(75, añosEspecializacion * 15);
      } else {
        let puntosEspecializacion = 0;
        let añosTotales =
          Math.min(numEspecializaciones, 2) * añosEspecializacion;
        if (añosTotales <= 2) {
          puntosEspecializacion = 20;
        } else {
          puntosEspecializacion = 20 + (añosTotales - 2) * 10;
        }
        puntosPosgrado += Math.min(30, puntosEspecializacion);
      }
    }

    puntosPosgrado = Math.min(puntosPosgrado, 140);
    return puntosPregrado + puntosPosgrado;
  }

  obtenerPuntosPorCategoria(categoria: string): number {
    const puntosPorCategoria: Record<string, { base: number; max: number }> = {
      Auxiliar: { base: 37, max: 37 },
      Asistente: { base: 58, max: 58 },
      Asociado: { base: 74, max: 74 },
      Titular: { base: 96, max: 96 },
    };

    if (!puntosPorCategoria[categoria]) return 0;

    return Math.min(puntosPorCategoria[categoria].base);
  }

  calcularPuntosExperiencia(
    experienciaDocente: number = 0,
    experienciaInvestigacion: number = 0,
    experienciaNoDocente: number = 0,
    experienciaDireccion: number = 0,
    categoriaDocente: 'Auxiliar' | 'Asistente' | 'Asociado' | 'Titular'
  ): number {
    const puntosDocente = Math.min(experienciaDocente * 4, 90);
    const puntosInvestigacion = Math.min(experienciaInvestigacion * 6, 90);
    const puntosDireccion = Math.min(experienciaDireccion * 4, 60);
    const puntosNoDocente = Math.min(experienciaNoDocente * 3, 30);

    let totalPuntos =
      puntosDocente + puntosInvestigacion + puntosDireccion + puntosNoDocente;

    const limitePorCategoria = {
      Auxiliar: 20,
      Asistente: 45,
      Asociado: 90,
      Titular: 120,
    };

    return Math.min(totalPuntos, limitePorCategoria[categoriaDocente]);
  }

  calcularPuntosProductividad(
    produccionAcademica: number[],
    numAutores: number,
    categoria: string
  ): number {
    if (!produccionAcademica) return 0;

    let totalPuntos = 0;
    const topePorCategoria: Record<string, number> = {
      Auxiliar: 80,
      Asistente: 160,
      Asociado: 320,
      Titular: 540,
    };

    this.tiposProduccion.forEach((tipo, index) => {
      let cantidad = Number(produccionAcademica[index]) || 0;

      if (tipo.maxProductos && cantidad > tipo.maxProductos) {
        cantidad = tipo.maxProductos;
      }

      let puntos = cantidad * tipo.puntos;

      if (numAutores >= 4 && numAutores <= 5) {
        puntos /= 2;
      } else if (numAutores >= 6) {
        puntos /= Math.ceil(numAutores / 2);
      }

      if (tipo.limite && puntos > tipo.limite) {
        puntos = tipo.limite;
      }

      totalPuntos += puntos;
    });

    const tope = topePorCategoria[categoria] || 0;
    return Math.min(totalPuntos, tope);
  }

  trackByIndex(index: number): number {
    return index;
  }
  simularVariasVeces(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
      this.simularSalario();
    }
  }
  simularSalario() {
    const gradoAcademico = ['Pregrado', 'Maestría', 'Doctorado'][
      Math.floor(Math.random() * 3)
    ];
    const categoria = ['Auxiliar', 'Asistente', 'Asociado', 'Titular'][
      Math.floor(Math.random() * 4)
    ];
    const añosEspecializacion = Math.floor(Math.random() * 5);
    const numEspecializaciones = Math.floor(Math.random() * 3);
    const numMaestrias = Math.floor(Math.random() * 3);
    const numDoctorados = Math.floor(Math.random() * 3);
    const experienciaDocente = Math.floor(Math.random() * 30);
    const experienciaNoDocente = Math.floor(Math.random() * 20);
    const experienciaDireccion = Math.floor(Math.random() * 15);
    const experienciaInvestigacion = Math.floor(Math.random() * 20);
    const numAutores = Math.floor(Math.random() * 10) + 1;

    const produccionAcademica = this.tiposProduccion.map((tipo) =>
      Math.floor(Math.random() * (tipo.maxProductos || 10))
    );

    this.salarioForm.setValue({
      gradoAcademico,
      categoria,
      añosEspecializacion,
      numEspecializaciones,
      numMaestrias,
      numDoctorados,
      experienciaDocente,
      experienciaNoDocente,
      experienciaDireccion,
      experienciaInvestigacion,
      numAutores,
      produccionAcademica,
    });

    this.calcularSalario();
  }

  formatearDatos() {
    this.salarioForm.reset({
      gradoAcademico: '',
      categoria: '',
      experienciaDocente: 0,
      experienciaNoDocente: 0,
      experienciaDireccion: 0,
      experienciaInvestigacion: 0,
      añosEspecializacion: 0,
      numEspecializaciones: 0,
      numMaestrias: 0,
      numDoctorados: 0,
      produccionAcademica: this.tiposProduccion.map(() => 0),
    });
  }
  guardarHistorialSalarios() {
    localStorage.setItem('historicoSalariosPunto3', JSON.stringify(this.historicoSalarios));
  }
}
