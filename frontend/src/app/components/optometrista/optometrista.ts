import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RevisionService } from '../../services/revision.service';
import { AuthService } from '../../services/auth';
import { Optometrista } from '../../common/interfaces';

@Component({
    selector: 'app-optometrista',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './optometrista.html',
    styleUrls: ['./optometrista.css']
})
export class OptometristaComponent implements OnInit {
    private revisionService = inject(RevisionService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    optometristas: Optometrista[] = [];
    loading = true;

    // Estado de Modales
    isFormModalOpen = false;
    isDeleteModalOpen = false;
    isEditing = false;

    // Optometrista seleccionado para editar/eliminar
    selectedOptometrista: Optometrista | null = null;

    // Formulario
    optometristaForm: FormGroup = this.fb.group({
        nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
        numeroColegiado: ['', [Validators.required]]
    });

    ngOnInit() {
        this.loadOptometristas();
    }

    loadOptometristas() {
        const clinicaId = this.authService.getClinicaId();
        if (clinicaId) {
            this.loading = true;
            this.revisionService.getOptometristasByClinica(clinicaId).subscribe({
                next: (data) => {
                    this.optometristas = data;
                    this.loading = false;
                },
                error: (err: any) => {
                    console.error('Error cargando optometristas', err);
                    this.loading = false;
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // --- FORMULARIO CREAR/EDITAR ---

    openCreateModal() {
        this.isEditing = false;
        this.selectedOptometrista = null;
        this.optometristaForm.reset();
        this.isFormModalOpen = true;
    }

    openEditModal(opt: Optometrista) {
        this.isEditing = true;
        this.selectedOptometrista = opt;
        this.optometristaForm.patchValue({
            nombreCompleto: opt.nombreCompleto,
            numeroColegiado: opt.numeroColegiado
        });
        this.isFormModalOpen = true;
    }

    closeFormModal() {
        this.isFormModalOpen = false;
        this.optometristaForm.reset();
    }

    onSubmitForm() {
        console.log('onSubmitForm called');

        if (this.optometristaForm.invalid) {
            console.log('Form is invalid:', this.optometristaForm.errors);
            this.optometristaForm.markAllAsTouched();
            return;
        }

        const clinicaId = this.authService.getClinicaId();
        console.log('Clinica ID obtained:', clinicaId);

        if (!clinicaId) {
            console.error('No clinica ID found!');
            return;
        }

        const formValue = this.optometristaForm.value;
        const optometristaData: any = {
            ...formValue,
            clinica: { id: clinicaId }
        };
        console.log('Sending data:', optometristaData);

        if (this.isEditing && this.selectedOptometrista) {
            // EDITAR
            // Nota: Asumimos que existe updateOptometrista en el servicio
            this.revisionService.updateOptometrista(this.selectedOptometrista.id, optometristaData).subscribe({
                next: () => {
                    this.loadOptometristas();
                    this.closeFormModal();
                },
                error: (err: any) => console.error('Error actualizando', err)
            });
        } else {
            // CREAR
            // Nota: Asumimos que existe createOptometrista en el servicio
            this.revisionService.createOptometrista(optometristaData).subscribe({
                next: () => {
                    this.loadOptometristas();
                    this.closeFormModal();
                },
                error: (err: any) => console.error('Error creando', err)
            });
        }
    }

    // --- ELIMINAR ---

    openDeleteModal(opt: Optometrista) {
        this.selectedOptometrista = opt;
        this.isDeleteModalOpen = true;
    }

    closeDeleteModal() {
        this.isDeleteModalOpen = false;
        this.selectedOptometrista = null;
    }

    confirmDelete() {
        if (this.selectedOptometrista) {
            this.revisionService.deleteOptometrista(this.selectedOptometrista.id).subscribe({
                next: () => {
                    this.loadOptometristas();
                    this.closeDeleteModal();
                },
                error: (err: any) => console.error('Error eliminando', err)
            });
        }
    }
}
