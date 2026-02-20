import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Paciente, Revision } from '../../common/interfaces';

Chart.register(...registerables);

const DATA_TIDEMAN = {
  edades: [6, 9, 12, 15, 18],
  p5: [21.5, 22.2, 22.8, 23.1, 23.3], // Percentil 5 (Ojo corto)
  p50: [22.4, 23.2, 23.8, 24.1, 24.3], // Percentil 50 (Media normal)
  p75: [23.0, 23.9, 24.6, 25.0, 25.2], // Percentil 75 (Riesgo moderado)
  p95: [23.8, 25.0, 26.1, 26.8, 27.2]  // Percentil 95 (Riesgo MIOPÍA MAGNA)
};

@Component({
  selector: 'app-myopia-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myopia-chart.html',
  styleUrl: './myopia-chart.css'
})
export class MyopiaChartComponent implements OnChanges, AfterViewInit {
  @Input() patient: Paciente | null = null;
  @Input() revisions: Revision[] = [];
  @Input() selectedRevision: Revision | null = null;
  @Input() isZoomed = false;

  @Output() chartClick = new EventEmitter<void>();

  @ViewChild('myopiaChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstance: Chart | null = null;

  activeRevision: Revision | null = null;
  nivelRiesgo: 'CRÍTICO' | 'MUY ALTO' | 'ALTO' | 'NORMAL' | null = null;
  mensajeRiesgo = '';
  claseAlertaBorder = '';
  claseAlertaBg = '';
  claseAlertaText = '';
  iconoAlerta = '';

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['revisions'] || changes['patient'] || changes['selectedRevision']) {
      this.calcularRiesgoRevisionActual();
      if (changes['revisions'] || changes['patient']) {
        this.renderChart();
      }
    }
  }

  // --- LÓGICA DE PERCENTILES ---

  private interpolaValorTideman(edad: number, percentil: number[]): number {
    const edades = DATA_TIDEMAN.edades;

    if (edad <= edades[0]) return percentil[0];
    if (edad >= edades[edades.length - 1]) return percentil[edades.length - 1];

    let idx1 = 0;
    while (idx1 < edades.length - 1 && edades[idx1 + 1] < edad) {
      idx1++;
    }
    const idx2 = idx1 + 1;

    const x1 = edades[idx1];
    const x2 = edades[idx2];
    const y1 = percentil[idx1];
    const y2 = percentil[idx2];

    const pendiente = (y2 - y1) / (x2 - x1);
    return y1 + (edad - x1) * pendiente;
  }

  private obtenerNivelDeRiesgo(edad: number, axial: number): 'CRÍTICO' | 'MUY ALTO' | 'ALTO' | 'NORMAL' {
    if (axial >= 26.0) return 'CRÍTICO';

    const valorP95 = this.interpolaValorTideman(edad, DATA_TIDEMAN.p95);
    const valorP75 = this.interpolaValorTideman(edad, DATA_TIDEMAN.p75);

    if (axial > valorP95) return 'MUY ALTO';
    if (axial > valorP75) return 'ALTO';
    return 'NORMAL';
  }

  private calcularRiesgoRevisionActual() {
    this.nivelRiesgo = null;
    this.mensajeRiesgo = '';
    this.claseAlertaBorder = '';
    this.claseAlertaBg = '';
    this.claseAlertaText = '';
    this.iconoAlerta = '';

    if (!this.revisions || this.revisions.length === 0) return;

    // Use sorted backwards explicitly for latest if none selected
    let targetRevision = this.selectedRevision;
    if (!targetRevision) {
      targetRevision = [...this.revisions].sort((a, b) => new Date(b.fechaRevision).getTime() - new Date(a.fechaRevision).getTime())[0];
    }

    this.activeRevision = targetRevision;

    let edad = targetRevision.edadExacta;

    if (edad == null && this.patient?.fechaNacimiento) {
      const fn = new Date(this.patient.fechaNacimiento);
      const fr = new Date(targetRevision.fechaRevision);
      edad = (fr.getTime() - fn.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    }

    const laOD = targetRevision.odLongitudAxial;
    const laOI = targetRevision.oiLongitudAxial;
    let maxLA: number | undefined;

    if (laOD !== undefined && laOI !== undefined) {
      maxLA = Math.max(laOD, laOI);
    } else {
      maxLA = laOD !== undefined ? laOD : laOI;
    }

    if (edad !== undefined && edad !== null && maxLA !== undefined && maxLA !== null) {
      this.nivelRiesgo = this.obtenerNivelDeRiesgo(edad, maxLA);

      switch (this.nivelRiesgo) {
        case 'CRÍTICO':
          this.mensajeRiesgo = 'Riesgo patológico (L. Axial > 26mm).';
          this.claseAlertaBorder = 'border-danger';
          this.claseAlertaBg = 'bg-danger-subtle';
          this.claseAlertaText = 'text-danger';
          this.iconoAlerta = 'bi-exclamation-triangle-fill';
          break;
        case 'MUY ALTO':
          this.mensajeRiesgo = 'Riesgo de miopía magna (>P95).';
          this.claseAlertaBorder = 'border-danger';
          this.claseAlertaBg = 'bg-danger-subtle';
          this.claseAlertaText = 'text-danger';
          this.iconoAlerta = 'bi-exclamation-triangle-fill';
          break;
        case 'ALTO':
          this.mensajeRiesgo = 'Riesgo de progresión alta (>P75). Requiere tratamiento.';
          this.claseAlertaBorder = 'border-warning';
          this.claseAlertaBg = 'bg-warning-subtle';
          this.claseAlertaText = 'text-warning-emphasis';
          this.iconoAlerta = 'bi-exclamation-triangle-fill';
          break;
        case 'NORMAL':
          this.mensajeRiesgo = 'Crecimiento controlado (<P75).';
          this.claseAlertaBorder = 'border-success';
          this.claseAlertaBg = 'bg-success-subtle';
          this.claseAlertaText = 'text-success';
          this.iconoAlerta = 'bi-check-circle-fill';
          break;
      }
    }
  }

  // --- GRÁFICA CHART.JS ---

  private renderChart() {
    if (!this.chartCanvas?.nativeElement) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const dataPaciente = this.revisions
      .filter(r => (r.odLongitudAxial !== undefined || r.oiLongitudAxial !== undefined))
      .map(r => {
        let edad = r.edadExacta;
        if (edad == null && this.patient?.fechaNacimiento) {
          const fn = new Date(this.patient.fechaNacimiento);
          const fr = new Date(r.fechaRevision);
          edad = (fr.getTime() - fn.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        }

        const laOD = r.odLongitudAxial;
        const laOI = r.oiLongitudAxial;
        const la = laOD !== undefined ? laOD : laOI;

        return {
          x: edad || 0,
          y: la || 0,
          raw: r
        };
      })
      .filter(p => p.x >= 6 && p.x <= 18 && p.y > 0)
      .sort((a, b) => a.x - b.x);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'P95 (MIOPÍA MAGNA)',
            data: DATA_TIDEMAN.edades.map((edad, i) => ({ x: edad, y: DATA_TIDEMAN.p95[i] })),
            borderColor: 'rgba(255, 0, 0, 0.5)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            order: 4
          },
          {
            label: 'P75 (Riesgo moderado)',
            data: DATA_TIDEMAN.edades.map((edad, i) => ({ x: edad, y: DATA_TIDEMAN.p75[i] })),
            borderColor: 'rgba(255, 165, 0, 0.5)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            order: 3
          },
          {
            label: 'P50 (Media normal)',
            data: DATA_TIDEMAN.edades.map((edad, i) => ({ x: edad, y: DATA_TIDEMAN.p50[i] })),
            borderColor: 'rgba(0, 128, 0, 0.5)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            order: 2
          },
          {
            label: 'P5 (Ojo corto)',
            data: DATA_TIDEMAN.edades.map((edad, i) => ({ x: edad, y: DATA_TIDEMAN.p5[i] })),
            borderColor: 'rgba(0, 0, 255, 0.3)',
            backgroundColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            order: 1
          },
          {
            label: 'Paciente (L.A. mm)',
            data: dataPaciente as any,
            borderColor: '#54366A',
            backgroundColor: '#FF5722',
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: false,
            tension: 0.1,
            order: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: 6,
            max: 18,
            title: {
              display: true,
              text: 'Edad (años)',
              font: { weight: 'bold' }
            },
            ticks: {
              stepSize: 1
            }
          },
          y: {
            min: 20,
            max: 28,
            title: {
              display: true,
              text: 'Longitud Axial (mm)',
              font: { weight: 'bold' }
            },
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Percentiles de Longitud Axial (Tideman)'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 4) { // Paciente
                  const raw = (context.raw as any).raw;
                  let str = `L.A.: ${context.parsed.y} mm`;
                  if (raw && raw.fechaRevision) {
                    const date = new Date(raw.fechaRevision);
                    str += ` - ${date.toLocaleDateString()}`;
                  }
                  return str;
                }
                const label = context.dataset.label || 'Valor';
                return label.split(' ')[0] + ': ' + context.parsed.y + ' mm';
              }
            }
          }
        }
      }
    };

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chartInstance = new Chart(ctx, config);
    }
  }
}
