import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { RevisionService } from '../../services/revision.service';
import { AuthService } from '../../services/auth';
import { CitaService } from '../../services/cita.service';
import { Paciente, Revision, Cita } from '../../common/interfaces';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyopiaChartComponent } from '../myopia-chart/myopia-chart';

@Component({
    selector: 'app-patient-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MyopiaChartComponent],
    templateUrl: './patient-detail.html',
    styleUrl: './patient-detail.css'
})
export class PatientDetailComponent implements OnInit {
    @Input() id?: string;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private patientService = inject(PatientService);
    private revisionService = inject(RevisionService);
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
        }
    }

    loadPatient(id: number) {
        this.patientService.getPacienteById(id).subscribe({
            next: (data) => {
                this.patient = data;
                this.loadRevisions(); // Load revisions after patient is loaded
                this.loadFuturasCitas(); // Load upcoming appointments too
            },
            error: (err) => console.error('Error al cargar paciente', err)
        });
    }

    loadRevisions() {
        if (this.patient?.id) {
            this.revisionService.getRevisionesByPaciente(this.patient.id).subscribe({
                next: (data) => {
                    // Orden de fecha descendente (la más reciente primero)
                    this.revisions = data.sort((a, b) => {
                        const dateA = new Date(a.fechaRevision || 0).getTime();
                        const dateB = new Date(b.fechaRevision || 0).getTime();
                        return dateB - dateA;
                    });
                    this.checkSelectedRevisionParam();
                },
                error: (err) => console.error('Error cargando revisiones:', err)
            });
        }
    }

    private checkSelectedRevisionParam() {
        // Verificar si hay un ID de revisión en los query params para seleccionarlo
        const selectedIdParam = this.route.snapshot.queryParamMap.get('selectedRevisionId');
        if (selectedIdParam) {
            const idToSelect = Number(selectedIdParam);
            const revisionToSelect = this.revisions.find(r => r.id === idToSelect);
            if (revisionToSelect) {
                this.selectRevision(revisionToSelect);

                // Limpiar el query param para que no persista al recargar si no se desea
                // this.router.navigate([], { queryParams: { selectedRevisionId: null }, queryParamsHandling: 'merge' });
            }
        }
    }

    selectRevision(rev: Revision) {
        this.selectedRevision = rev;
    }

    goBack() {
        this.router.navigate(['/pacientes']);
    }

    goToDashboard() {
        this.router.navigate(['/dashboard']);
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

    // --- GESTIÓN DE CITAS ---
    private citaService = inject(CitaService);
    futurasCitas: Cita[] = [];
    isCitaModalOpen = false;
    isEditCitaMode = false;
    citaEditId: number | null = null;

    citaForm = new FormGroup({
        fechaHora: new FormControl('', [Validators.required]),
        motivo: new FormControl('Revisión de Control', [Validators.required]),
        notas: new FormControl('')
    });

    loadFuturasCitas() {
        if (this.patient?.id) {
            console.log('Solicitando citas futuras para paciente ID:', this.patient.id);
            this.citaService.getCitasFuturasByPaciente(this.patient.id).subscribe({
                next: (data) => {
                    console.log('Citas futuras recibidas del servidor:', data);
                    this.futurasCitas = data;
                },
                error: (err) => console.error('Error cargando citas futuras:', err)
            });
        }
    }

    openCitaModal() {
        this.isCitaModalOpen = true;
        this.isEditCitaMode = false;
        this.citaEditId = null;
        this.citaForm.reset({ motivo: 'Revisión de Control' });
    }

    openEditCitaModal(cita: Cita) {
        this.isCitaModalOpen = true;
        this.isEditCitaMode = true;
        this.citaEditId = cita.id || null;

        let formattedDate = '';
        if (cita.fechaHora) {
            // El formato para <input type="datetime-local"> es YYYY-MM-DDTHH:mm
            const dateObj = new Date(cita.fechaHora);
            formattedDate = dateObj.toISOString().slice(0, 16);
        }

        this.citaForm.patchValue({
            fechaHora: formattedDate,
            motivo: cita.motivo,
            notas: cita.notas
        });
    }

    closeCitaModal() {
        this.isCitaModalOpen = false;
        this.isEditCitaMode = false;
        this.citaEditId = null;
        this.citaForm.reset();
    }

    deleteCita(citaId: number | undefined, event: Event) {
        event.stopPropagation();
        if (!citaId) return;

        if (confirm('¿Estás seguro de que deseas cancelar/eliminar esta cita?')) {
            this.citaService.deleteCita(citaId).subscribe({
                next: () => {
                    this.futurasCitas = this.futurasCitas.filter(c => c.id !== citaId);
                    console.log('Cita eliminada correctamente');
                },
                error: (err) => console.error('Error al eliminar cita:', err)
            });
        }
    }

    onSaveCita() {
        if (this.citaForm.valid && this.patient?.id) {
            const clinicaId = this.authService.getClinicaId();
            if (!clinicaId) return;

            const formValue = this.citaForm.value;

            const citaData: Cita = {
                fechaHora: formValue.fechaHora as string,
                motivo: formValue.motivo as string,
                notas: formValue.notas as string || undefined,
                estado: 'PENDIENTE',
                paciente: { id: this.patient.id } as Paciente,
                clinica: { id: clinicaId, nombre: '' } as import('../../common/interfaces').Clinica
            };

            if (this.isEditCitaMode && this.citaEditId) {
                console.log('Enviando actualización de cita al servidor:', citaData);
                this.citaService.updateCita(this.citaEditId, citaData).subscribe({
                    next: (res) => {
                        console.log('Cita actualizada correctamente', res);
                        const index = this.futurasCitas.findIndex(c => c.id === this.citaEditId);
                        if (index !== -1) {
                            this.futurasCitas[index] = res;
                        }
                        this.futurasCitas.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
                        this.closeCitaModal();
                    },
                    error: (err) => console.error('Error al actualizar cita:', err)
                });
            } else {
                console.log('Enviando nueva cita al servidor:', citaData);
                this.citaService.createCita(citaData).subscribe({
                    next: (res) => {
                        console.log('Cita guardada correctamente, respuesta:', res);
                        this.futurasCitas.push(res);
                        this.futurasCitas.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
                        this.closeCitaModal();
                    },
                    error: (err) => console.error('Error al agendar cita:', err)
                });
            }
        } else {
            this.citaForm.markAllAsTouched();
        }
    }
}
