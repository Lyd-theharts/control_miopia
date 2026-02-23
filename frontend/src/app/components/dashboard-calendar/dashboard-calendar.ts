import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../services/auth';
import { Cita } from '../../common/interfaces';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  citas: Cita[];
}

@Component({
  selector: 'app-dashboard-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-calendar.html',
  styleUrl: './dashboard-calendar.css'
})
export class DashboardCalendarComponent implements OnInit {

  currentDate: Date = new Date();
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  calendarDays: CalendarDay[] = [];
  citasMes: Cita[] = [];

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCalendar();
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentDate.getMonth()];
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.loadCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.loadCalendar();
  }

  private loadCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Formatear a String ISO para la API (aproximación rápida para fechas locales)
    const inicioStr = new Date(year, month, 1, 0, 0, 0).toISOString().split('.')[0];
    const finStr = new Date(year, month + 1, 0, 23, 59, 59).toISOString().split('.')[0];

    // Obtener clinica activa
    const clinicaId = this.authService.getClinicaId();
    if (clinicaId) {
      this.citaService.getCitasByClinicaAndRange(clinicaId, inicioStr, finStr).subscribe({
        next: (data) => {
          this.citasMes = data;
          this.generateCalendarGrid();
        },
        error: (err) => {
          console.error('Error cargando citas del calendario', err);
          this.citasMes = [];
          this.generateCalendarGrid();
        }
      });
    } else {
      this.generateCalendarGrid();
    }
  }

  private generateCalendarGrid() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];

    // Día de la semana en el que empieza (0: Dom, 1: Lun, etc.)
    // Ajustar para empezar en Lunes (1 en local, 0 para lunes interno)
    let startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Rellenar días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: date,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        citas: this.getCitasForDate(date)
      });
    }

    // Rellenar días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date: date,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        citas: this.getCitasForDate(date)
      });
    }

    // Rellenar días del mes siguiente para que cuadre la rejilla
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date: date,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        citas: this.getCitasForDate(date)
      });
    }

    this.calendarDays = days;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  private getCitasForDate(date: Date): Cita[] {
    return this.citasMes.filter(c => {
      const citaDate = new Date(c.fechaHora);
      return this.isSameDay(date, citaDate);
    });
  }

  // --- Lógica del Widget ---
  selectedDay: CalendarDay | null = null;
  isModalOpen: boolean = false;

  selectDay(day: CalendarDay) {
    if (day.citas.length > 0) {
      this.selectedDay = day;
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedDay = null;
  }

  goToPatient(cita: Cita) {
    if (cita.paciente && cita.paciente.id) {
      this.closeModal(); // Cerrar el modal del calendario si está abierto
      this.router.navigate(['/pacientes', cita.paciente.id]);
    }
  }
}
