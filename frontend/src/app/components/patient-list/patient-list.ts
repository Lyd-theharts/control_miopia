import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth';
import { Paciente } from '../../common/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './patient-list.html',
    styleUrl: './patient-list.css'
})
export class PatientListComponent implements OnInit {
    private readonly patientService = inject(PatientService);
    private readonly authService = inject(AuthService);
    private readonly location = inject(Location);
    private readonly route = inject(ActivatedRoute); // Inyectamos ActivatedRoute
    private readonly router = inject(Router);

    // Consumimos directamente el Observable del servicio
    patients$ = this.patientService.patients$;

    searchControl = new FormControl('');

    // Add check to show/hide modal
    isModalOpen = false;

    // Formulario reactivo para crear paciente
    patientForm = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        apellidos: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        emailTutor: new FormControl('', [Validators.email]),
        fechaNacimiento: new FormControl('', [Validators.required]),
        nombreTutor: new FormControl(''),
        sexo: new FormControl('Hombre') // Valor por defecto
    });

    ngOnInit(): void {
        const clinicaId = this.authService.getClinicaId();
        if (clinicaId) {
            this.patientService.setClinicaId(clinicaId);
            this.patientService.setSearchTerm(''); // FIX: Resetear búsqueda al entrar
            this.setupSearch();

            // Verificar si venimos del Dashboard para abrir el modal directamente
            this.route.queryParams.subscribe(params => {
                if (params['action'] === 'new') {
                    this.openModal();
                }
            });

        } else {
            console.error('No se pudo obtener el ID de la clínica del token.');
        }
    }

    setupSearch() {
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(term => {
            this.patientService.setSearchTerm(term || '');
        });
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    goToOptometristas() {
        this.router.navigate(['/optometristas']);
    }

    getInitials(nombre: string, apellidos?: string): string {
        const n = nombre ? nombre.charAt(0) : '';
        const a = apellidos ? apellidos.charAt(0) : '';
        return (n + a).toUpperCase();
    }

    navigateToDetail(id: number | undefined) {
        if (id) {
            this.router.navigate(['/pacientes', id]);
        }
    }

    // --- MÉTODOS DEL MODAL ---

    openModal() {
        this.isModalOpen = true;
        this.patientForm.reset({ sexo: 'Hombre' }); // Reseteamos form al abrir
    }

    closeModal() {
        this.isModalOpen = false;
    }

    onSubmit() {
        if (this.patientForm.valid) {
            const clinicaId = this.authService.getClinicaId();
            if (!clinicaId) return;

            // IMPORTANTE: Como hemos revertido el backend, ahora espera un objeto anidado
            const formValue = this.patientForm.value;
            const newPatient: any = {
                nombre: formValue.nombre,
                apellidos: formValue.apellidos,
                telefono: formValue.telefono,
                emailTutor: formValue.emailTutor,
                fechaNacimiento: formValue.fechaNacimiento,
                sexo: formValue.sexo,
                nombreTutor: formValue.nombreTutor,
                clinica: { id: clinicaId }
            };

            this.patientService.createPatient(newPatient).subscribe({
                next: () => {
                    this.closeModal();
                    // Refrescamos la lista manualmente como pediste
                    const currentTerm = this.searchControl.value || '';
                    this.patientService.setSearchTerm(currentTerm);
                },
                error: (err) => console.error('Error al crear paciente', err)
            });
        } else {
            this.patientForm.markAllAsTouched(); // Mostrar errores si hay
        }
    }
}
