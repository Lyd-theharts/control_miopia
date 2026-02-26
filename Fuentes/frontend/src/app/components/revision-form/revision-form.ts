import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RevisionService } from '../../services/revision.service';
import { AuthService } from '../../services/auth';
import { Revision, Optometrista } from '../../common/interfaces';

@Component({
    selector: 'app-revision-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './revision-form.html',
    styleUrls: ['./revision-form.css']
})
export class RevisionFormComponent implements OnInit {
    // Inputs de Ruta (Component Input Binding)
    @Input('id') pacienteIdInput!: string;
    @Input('revisionId') revisionIdInput?: string;

    private fb = inject(FormBuilder);
    private router = inject(Router);
    private revisionService = inject(RevisionService);
    private authService = inject(AuthService);

    pacienteId!: number;
    revisionId?: number;
    isEditing = false;
    revisionForm!: FormGroup;
    optometristas: Optometrista[] = [];

    ngOnInit() {
        console.log('RevisionFormComponent inicializado (Input Binding)');
        console.log('Inputs recibidos - Paciente:', this.pacienteIdInput, 'Revisión:', this.revisionIdInput);

        if (this.pacienteIdInput) {
            this.pacienteId = Number(this.pacienteIdInput);
            this.initForm();
            this.loadOptometristas();
        } else {
            console.error('Error: No se recibió ID de paciente');
            // Podríamos redirigir o mostrar error
        }

        if (this.revisionIdInput) {
            this.isEditing = true;
            this.revisionId = Number(this.revisionIdInput);
            this.loadRevisionData(this.revisionId);
        }
    }

    private loadRevisionData(id: number) {
        this.revisionService.getRevisionById(id).subscribe({
            next: (data) => {
                console.log('Datos de revisión cargados:', data);
                this.revisionForm.patchValue({
                    ...data,
                    optometristaId: data.optometrista?.id
                });
            },
            error: (err) => console.error('Error cargando revisión:', err)
        });
    }

    private loadOptometristas() {
        const clinicaId = this.authService.getClinicaId();
        if (clinicaId) {
            this.revisionService.getOptometristasByClinica(clinicaId).subscribe({
                next: (data) => {
                    this.optometristas = data;
                    // Si solo hay uno, preseleccionarlo
                    if (this.optometristas.length === 1) {
                        this.revisionForm.patchValue({ optometristaId: this.optometristas[0].id });
                    }
                },
                error: (err) => console.error('Error cargando optometristas', err)
            });
        }
    }

    private initForm() {
        this.revisionForm = this.fb.group({
            // DATOS GENERALES
            fechaRevision: [new Date().toISOString().split('T')[0], Validators.required],
            optometristaId: [null, Validators.required],
            anamnesis: [''], // Opcional

            // REFRACCIÓN (OD) - Opcionales
            odEsfera: [null],
            odCilindro: [null],
            odEje: [null],
            odAgudezaVisual: [null],

            // REFRACCIÓN (OI) - Opcionales
            oiEsfera: [null],
            oiCilindro: [null],
            oiEje: [null],
            oiAgudezaVisual: [null],

            // BIOMETRÍA (OD/OI)
            odK1: [null],
            odK2: [null],
            odLongitudAxial: [null],
            oiK1: [null],
            oiK2: [null],
            oiLongitudAxial: [null],

            // VISIÓN BINOCULAR
            foriaLejos: [''],
            foriaCerca: [''],
            ppc: [null],
            mem: [null],
            stereopsis: [null],

            // TRATAMIENTO
            tratamientoActual: ['NINGUNO']
        });
    }

    onSubmit() {
        if (this.revisionForm.valid) {
            const formValue = this.revisionForm.value;
            const { optometristaId, ...restoDatos } = formValue;

            // Construir objeto Revision
            const revisionData: Revision = {
                ...restoDatos,
                paciente: { id: this.pacienteId },
                optometrista: { id: Number(optometristaId) }
            };

            const request$ = this.isEditing && this.revisionId
                ? this.revisionService.updateRevision(this.revisionId, revisionData)
                : this.revisionService.createRevision(revisionData);

            console.log(this.isEditing ? 'Actualizando revisión:' : 'Creando revisión:', revisionData);

            request$.subscribe({
                next: (res: Revision) => {
                    console.log('Operación exitosa:', res);
                    // Navegar de vuelta al paciente seleccionando la revisión editada/creada
                    this.router.navigate(['/pacientes', this.pacienteId], {
                        queryParams: { selectedRevisionId: res.id }
                    });
                },
                error: (err: any) => {
                    console.error('Error en operación:', err);
                    alert('Error al guardar: ' + (err.error?.message || err.statusText));
                }
            });
        } else {
            this.revisionForm.markAllAsTouched();
        }
    }

    cancel() {
        this.router.navigate(['/pacientes', this.pacienteId]);
    }
}
