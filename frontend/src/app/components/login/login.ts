import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    nombreComercial: ['', Validators.required],
    cif: ['', Validators.required]
  });

  error: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showRegisterModal: boolean = false;

  toggleRegisterModal() {
    this.showRegisterModal = !this.showRegisterModal;
    this.error = '';
    this.successMessage = '';
    this.registerForm.reset();
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Usuario registrado con éxito. Por favor inicia sesión.';
            this.showRegisterModal = false;
            // Opcional: llenar el login con el usuario registrado
            this.loginForm.patchValue({
              username: this.registerForm.get('username')?.value
            });
          } else {
            this.error = 'Error al registrar usuario.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error en el registro. Intente nuevamente.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';

      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.error = 'Usuario o contraseña incorrectos.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error de conexión con el servidor.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
}
