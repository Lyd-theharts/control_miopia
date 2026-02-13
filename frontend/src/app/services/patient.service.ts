import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Paciente } from '../common/interfaces';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly http = inject(HttpClient);
    private readonly urlBase = 'http://localhost:9090/api/pacientes';

    // BehaviorSubjects para el estado de la búsqueda
    private clinicaIdSubject = new BehaviorSubject<number | null>(null);
    private searchTermSubject = new BehaviorSubject<string>('');

    // Observable público que reacciona a cambios en clinicaId o searchTerm
    public patients$ = combineLatest([
        this.clinicaIdSubject,
        this.searchTermSubject
    ]).pipe(
        switchMap(([clinicaId, term]) => {
            if (!clinicaId) {
                return of([]);
            }

            const cleanTerm = term.trim();
            console.log('Buscando pacientes. Clínica:', clinicaId, 'Term:', cleanTerm);

            // 1. Si no hay término de búsqueda, listar todos
            if (!cleanTerm) {
                return this.http.get<Paciente[]>(`${this.urlBase}?clinicaId=${clinicaId}`);
            }

            // 2. Búsqueda por texto (Nombre, Apellidos, Teléfono si el backend lo soporta en /buscar)
            return this.http.get<Paciente[]>(`${this.urlBase}/buscar?clinicaId=${clinicaId}&texto=${cleanTerm}`);
        }),
        catchError(err => {
            console.error('Error en el stream de pacientes:', err);
            return of([]);
        })
    );

    // Acciones para actualizar el estado
    setClinicaId(id: number) {
        this.clinicaIdSubject.next(id);
    }

    setSearchTerm(term: string) {
        this.searchTermSubject.next(term);
    }

    // Helper para obtener un paciente individual (para detalles, edición, etc.)
    getPacienteById(id: number): Observable<Paciente> {
        return this.http.get<Paciente>(`${this.urlBase}/${id}`);
    }

    // Crear nuevo paciente
    createPatient(paciente: Paciente): Observable<Paciente> {
        return this.http.post<Paciente>(`${this.urlBase}`, paciente);
    }

    // Actualizar paciente
    updatePatient(id: number, paciente: Paciente): Observable<Paciente> {
        return this.http.put<Paciente>(`${this.urlBase}/${id}`, paciente);
    }

    // Eliminar paciente
    deletePatient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.urlBase}/${id}`);
    }

    // --- REVISIONES ---

    // Obtener historial de revisiones de un paciente
    getRevisionesByPaciente(pacienteId: number): Observable<any[]> {
        // La URL en el Controller es: /api/revisiones/paciente/{pacienteId}
        // Nota: UrlBase actual es .../api/pacientes. Debemos cambiar a .../api/revisiones
        const urlRevisiones = 'http://localhost:9090/api/revisiones';
        return this.http.get<any[]>(`${urlRevisiones}/paciente/${pacienteId}`);
    }
}
