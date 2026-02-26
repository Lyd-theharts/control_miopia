import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { DashboardCalendarComponent } from '../dashboard-calendar/dashboard-calendar';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../common/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DashboardCalendarComponent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly citaService = inject(CitaService);

  citasHoy: Cita[] = [];
  isCalendarOpen = false;

  ngOnInit() {
    this.loadCitasHoy();
  }

  loadCitasHoy() {
    const clinicaId = this.authService.getClinicaId();
    if (clinicaId) {
      const today = new Date();
      // Formatear a ISODate asumiendo hora local 00:00:00 a 23:59:59
      const inicioStr = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString().split('.')[0];
      const finStr = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString().split('.')[0];

      this.citaService.getCitasByClinicaAndRange(clinicaId, inicioStr, finStr).subscribe({
        next: (data) => this.citasHoy = data,
        error: (err) => console.error('Error cargando citas de hoy:', err)
      });
    }
  }

  openCalendar() {
    this.isCalendarOpen = true;
  }

  closeCalendar() {
    this.isCalendarOpen = false;
  }

  navigate(route: string) {
    if (route === 'nuevo-paciente') {
      this.router.navigate(['/pacientes'], { queryParams: { action: 'new' } });
    } else {
      this.router.navigate(['/' + route]);
    }
  }

  logout() {
    this.authService.logout();
  }

  goToPatient(cita: Cita, event: Event) {
    event.stopPropagation();
    if (cita.paciente && cita.paciente.id) {
      this.router.navigate(['/pacientes', cita.paciente.id]);
    }
  }
}
