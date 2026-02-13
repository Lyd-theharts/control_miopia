import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private revisionService = inject(RevisionService);
    private authService = inject(AuthService);

    pacienteId!: number;
    revisionForm!: FormGroup;
    optometristas: Optometrista[] = [];

    ngOnInit() {
        this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
        this.initForm();
        this.loadOptometristas();
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
            const nuevaRevision: Revision = {
                ...restoDatos,
                paciente: { id: this.pacienteId },
                optometrista: { id: Number(optometristaId) }
            };

            console.log('Enviando revisión:', nuevaRevision);

            this.revisionService.createRevision(nuevaRevision).subscribe({
                next: (res) => {
                    console.log('Revisión creada:', res);
                    this.router.navigate(['/pacientes', this.pacienteId]);
                },
                error: (err) => {
                    console.error('Error al crear revisión:', err);
                    alert('Error al guardar la revisión: ' + (err.error?.message || err.statusText));
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
