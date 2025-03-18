import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-punto3',
  imports: [ NgIf,NgxChartsModule,ReactiveFormsModule,FormsModule],
  templateUrl: './punto3.component.html',
  styleUrl: './punto3.component.css'
})
export class Punto3Component {
  salarioForm: FormGroup;
  salarioTotal: number | null = null;
  valorPunto: number = 20895;
  historicoSalarios: { name: string; value: number }[] = [];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454'],
  };

  tiposProduccion = [
    { nombre: 'Artículos A1', puntos: 15, cantidad: 0, limite: 15 },
    { nombre: 'Artículos A2', puntos: 12, cantidad: 0, limite: 12 },
    { nombre: 'Artículos B', puntos: 8, cantidad: 0, limite: 15 },
    { nombre: 'Artículos C', puntos: 3, cantidad: 0, limite: 15 },
    { nombre: 'Artículo en revista indexada', puntos: 5, limite: 50 },
    { nombre: 'Producción de video nacioanl', puntos: 7, limite: 35 },
    { nombre: 'Producción de video inter-nacional', puntos: 12, limite: 60 },
    { nombre: 'Patente', puntos: 10, limite: 100 },
    { nombre: 'Libro de texto', puntos: 8, limite: 80 },
    { nombre: 'Libro de investigación', puntos: 12, limite: 120 },
    { nombre: 'Premio nacional', puntos: 15, limite: 150 },
    { nombre: 'Premio internacional', puntos: 20, limite: 200 },
    { nombre: 'Traducción de libros', puntos: 4, limite: 40 },
    { nombre: 'Obra artística', puntos: 6, limite: 60 },
    { nombre: 'Producción técnica', puntos: 7, limite: 70 },
    { nombre: 'Producción de software', puntos: 9, limite: 90 },
  ];

  constructor(private fb: FormBuilder) {
    this.salarioForm = this.fb.group({
      gradoAcademico: ['', Validators.required],
      categoria: ['', Validators.required],
      experienciaDocente: [0, Validators.required],
      experienciaNoDocente: [0, Validators.required],
      experienciaDireccion: [0, Validators.required],
      experienciaInvestigacion: [0, Validators.required],
      añosEspecializacion: [0, [Validators.min(0)]],
      añosDoctorado: [0, [Validators.min(0)]],
      añosMaestria: [0, [Validators.min(0)]],
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
      añosMaestria,
      añosDoctorado,
      numEspecializaciones,
      numMaestrias,
      numDoctorados,
      experienciaDocente,
      experienciaNoDocente,
      experienciaDireccion,
      experienciaInvestigacion,
    } = this.salarioForm.value;

    const añosEspecializacionNum = Number(añosEspecializacion) || 0;
    const añosMaestriaNum = Number(añosMaestria) || 0;
    const añosDoctoradoNum = Number(añosDoctorado) || 0;

    const tieneMaestria = gradoAcademico === 'Maestría' || añosMaestriaNum > 0;
    const tieneDoctorado =
      gradoAcademico === 'Doctorado' || añosDoctoradoNum > 0;

    let puntosTitulo = this.obtenerPuntosPorTitulo(
      gradoAcademico,
      tieneMaestria,
      tieneDoctorado,
      añosEspecializacionNum,
      añosMaestriaNum,
      añosDoctoradoNum
    );

    let puntosCategoria = this.obtenerPuntosPorCategoria(categoria);
    let puntosExperiencia = this.calcularPuntosExperiencia(
      experienciaDocente,
      experienciaInvestigacion,
      experienciaNoDocente,
      experienciaDireccion
    );
    let puntosProductividad = this.calcularPuntosProductividad();

    let totalPuntos =
      puntosTitulo + puntosCategoria + puntosExperiencia + puntosProductividad;
  
    this.salarioTotal = totalPuntos * this.valorPunto;

    this.historicoSalarios = [
      ...this.historicoSalarios,
      {
        name: `Simulación ${this.historicoSalarios.length + 1}`,
        value: this.salarioTotal!,
      },
    ];
    const puntosProd = this.calcularPuntosProductividad();
    console.log('🔹 Puntos Productividad:', puntosProd);
    console.log('🔹 Tipos Producción:', this.tiposProduccion);

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
    this.tiposProduccion[index].cantidad = +event.target.value;
    console.log(
      '🔹 Nueva Cantidad en Producción Académica:',
      this.tiposProduccion
    );
  }

  esPosgrado(): boolean {
    const grado = this.salarioForm.get('gradoAcademico')?.value;
    return ['Postgrado'].includes(grado);
  }

   obtenerPuntosPorTitulo(
    gradoAcademico: string,
    tieneMaestria: boolean,
    tieneDoctorado: boolean,
    añosEspecializacion: number,
    añosMaestria: number,
    añosDoctorado: number,
    esEspecializacionClinica: boolean = false
  ): number {
    let puntosPregrado = 0;
    let puntosPosgrado = 0;
  
    if (gradoAcademico === "Pregrado en Medicina o Composición Musical") {
      puntosPregrado = 183;
    } else {
      puntosPregrado = 178;
    }

    if (tieneDoctorado) {
      if (!tieneMaestria) {
        puntosPosgrado += añosDoctorado >= 3 ? 120 : 80; 
      } else {
        puntosPosgrado += añosDoctorado >= 3 ? 80 : 80; 
      }
    }
  
    if (tieneMaestria) {
      puntosPosgrado += añosMaestria >= 2 ? 40 : 40;
    }

    if (tieneMaestria && añosMaestria >= 2) {
      puntosPosgrado = Math.min(puntosPosgrado, 60);
    }

    if (añosEspecializacion > 0) {
      if (esEspecializacionClinica) {
        puntosPosgrado += Math.min(75, añosEspecializacion * 15);
      } else {
        puntosPosgrado += Math.min(30, añosEspecializacion > 2 ? 20 + (añosEspecializacion - 2) * 10 : 20);
      }
    }

    puntosPosgrado = Math.min(puntosPosgrado, 140);

    return puntosPregrado + puntosPosgrado;
  }
  

  obtenerPuntosPorCategoria(categoria: string): number {
    const puntosPorCategoria: Record<string, { base: number; max: number }> = {
      Auxiliar: { base: 37, max: 75 },
      Asistente: { base: 58, max: 150 },
      Asociado: { base: 74, max: 250 },
      Titular: { base: 96, max: 400 },
    };

    if (!puntosPorCategoria[categoria]) return 0;

    return Math.min(
      puntosPorCategoria[categoria].max,
      puntosPorCategoria[categoria].base
    );
  }

  calcularPuntosExperiencia(
    experienciaDocente: number = 0,
    experienciaInvestigacion: number = 0,
    experienciaNoDocente: number = 0,
    experienciaDireccion: number = 0
  ): number {
    const puntosDocente = Math.min(experienciaDocente * 6, 90);
    const puntosInvestigacion = Math.min(experienciaInvestigacion * 6, 90);
    const puntosDireccion = Math.min(experienciaDireccion * 4, 60);
    const puntosNoDocente = Math.min(experienciaNoDocente * 3, 30);

    return (
      puntosDocente + puntosInvestigacion + puntosDireccion + puntosNoDocente
    );
  }

  calcularPuntosProductividad(): number {
    const produccionArray = this.salarioForm.get('produccionAcademica')?.value;

    if (!produccionArray) return 0;

    let totalPuntos = 0;

    this.tiposProduccion.forEach((tipo, index) => {
      let cantidad = Number(produccionArray[index]) || 0;
      let puntos = cantidad * tipo.puntos;

    
      if (tipo.limite && puntos > tipo.limite) {
        puntos = tipo.limite;
      }

      totalPuntos += puntos;
    });

    return totalPuntos;
  }

  formatearDatos() {
    this.salarioForm.reset({
  
      
    });


  }
}
