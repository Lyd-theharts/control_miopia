import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { RevisionService } from '../../services/revision.service';
import { AuthService } from '../../services/auth';
import { Paciente, Revision } from '../../common/interfaces';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-patient-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './patient-detail.html',
    styleUrl: './patient-detail.css'
})
export class PatientDetailComponent implements OnInit {
    @Input() id?: string;

    private readonly router = inject(Router);
    private readonly patientService = inject(PatientService);
    private readonly revisionService = inject(RevisionService);
    private readonly authService = inject(AuthService);

    patient: Paciente | null = null;
    revisions: Revision[] = [];
    selectedRevision: Revision | null = null;

    isDeleteModalOpen = false;
    isEditModalOpen = false;

    editForm = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        apellidos: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        emailTutor: new FormControl('', [Validators.email]),
        fechaNacimiento: new FormControl('', [Validators.required]),
        nombreTutor: new FormControl(''),
        sexo: new FormControl('Hombre')
    });

    ngOnInit(): void {
        if (this.id) {
            const patientId = Number(this.id);
            this.loadPatient(patientId);
            this.loadRevisions(patientId);
        }
    }

    loadPatient(id: number) {
        this.patientService.getPacienteById(id).subscribe({
            next: (data) => {
                this.patient = data;
            },
            error: (err) => console.error('Error al cargar paciente', err)
        });
    }

    loadRevisions(id: number) {
        console.log('Cargando revisiones del paciente:', id);
        this.revisionService.getRevisionesByPaciente(id).subscribe({
            next: (data) => {
                console.log('Revisiones recibidas:', data);
                this.revisions = data;
                if (this.revisions.length > 0) {
                    // Opcional: seleccionar la última por defecto
                }
            },
            error: (err) => console.error('Error cargando revisiones:', err)
        });
    }

    selectRevision(rev: Revision) {
        this.selectedRevision = rev;
    }

    goBack() {
        this.router.navigate(['/pacientes']);
    }

    // --- EDICIÓN ---

    editPatient() {
        this.openEditModal();
    }

    openEditModal() {
        if (this.patient) {
            this.isEditModalOpen = true;
            this.editForm.patchValue({
                nombre: this.patient.nombre,
                apellidos: this.patient.apellidos,
                telefono: this.patient.telefono,
                emailTutor: this.patient.emailTutor,
                fechaNacimiento: this.patient.fechaNacimiento,
                nombreTutor: this.patient.nombreTutor,
                sexo: this.patient.sexo
            });
        }
    }

    closeEditModal() {
        this.isEditModalOpen = false;
        this.editForm.reset();
    }

    onSaveEdit() {
        if (this.editForm.valid && this.patient?.id) {
            const clinicaId = this.authService.getClinicaId();
            if (!clinicaId) return;

            const formValue = this.editForm.value;
            const updatedPatient: any = {
                id: this.patient.id,
                ...formValue,
                clinica: { id: clinicaId }
            };

            this.patientService.updatePatient(this.patient.id, updatedPatient).subscribe({
                next: (res) => {
                    console.log('Paciente actualizado', res);
                    this.patient = res;
                    this.closeEditModal();
                },
                error: (err) => console.error('Error al actualizar', err)
            });
        } else {
            this.editForm.markAllAsTouched();
        }
    }

    // --- ELIMINACIÓN ---

    confirmDelete() {
        this.isDeleteModalOpen = true;
    }

    cancelDelete() {
        this.isDeleteModalOpen = false;
    }

    deletePatient() {
        if (this.patient?.id) {
            this.patientService.deletePatient(this.patient.id).subscribe({
                next: () => {
                    this.isDeleteModalOpen = false;
                    this.router.navigate(['/pacientes']);
                },
                error: (err) => console.error('Error al eliminar', err)
            });
        }
    }

    // --- UTILIDADES ---

    getInitials(nombre: string, apellidos?: string): string {
        const n = nombre ? nombre.charAt(0) : '';
        const a = apellidos ? apellidos.charAt(0) : '';
        return (n + a).toUpperCase();
    }

    isGraphZoomed = false;
    toggleGraphZoom() {
        this.isGraphZoomed = !this.isGraphZoomed;
    }

    goToNewRevision() {
        console.log('Botón Nueva Revisión clickeado. Paciente ID:', this.patient?.id);
        if (this.patient?.id) {
            this.router.navigate(['/pacientes', this.patient.id, 'nueva-revision'])
                .then(success => console.log('Navegación exitosa:', success))
                .catch(err => console.error('Error en navegación:', err));
        } else {
            console.error('No se puede navegar: ID de paciente no encontrado');
        }
    }

    goToEditRevision() {
        if (this.patient?.id && this.selectedRevision?.id) {
            this.router.navigate(['/pacientes', this.patient.id, 'revision', this.selectedRevision.id, 'editar']);
        }
    }
}
