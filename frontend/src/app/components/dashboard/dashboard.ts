import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  navigateToNewPatient() {
    // Redirige a la lista de pacientes pero abriendo el modal automáticamente
    this.router.navigate(['/pacientes'], { queryParams: { action: 'new' } });
  }

  logout() {
    this.authService.logout();
  }
}
