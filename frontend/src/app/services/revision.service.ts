import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Revision } from '../common/interfaces';

@Injectable({
    providedIn: 'root'
})
export class RevisionService {
    private readonly http = inject(HttpClient);
    // Base URL: http://localhost:9090/api/revisiones
    private readonly urlBase = 'http://localhost:9090/api/revisiones';

    // 1. Obtener historial de un paciente
    getRevisionesByPaciente(pacienteId: number): Observable<Revision[]> {
        return this.http.get<Revision[]>(`${this.urlBase}/paciente/${pacienteId}`);
    }

    // 2. Obtener una revisión por ID (para editar)
    getRevisionById(id: number): Observable<Revision> {
        return this.http.get<Revision>(`${this.urlBase}/${id}`);
    }

    // 3. Crear Nueva Revisión
    createRevision(revision: Revision): Observable<Revision> {
        return this.http.post<Revision>(this.urlBase, revision);
    }

    // 4. Obtener Optometristas por Clínica (Nuevo)
    getOptometristasByClinica(clinicaId: number): Observable<any[]> {
        return this.http.get<any[]>(`http://localhost:9090/api/optometristas?clinicaId=${clinicaId}`);
    }

    // 4. Actualizar Revisión
    updateRevision(id: number, revision: Revision): Observable<Revision> {
        return this.http.put<Revision>(`${this.urlBase}/${id}`, revision);
    }

    // 5. Eliminar Revisión
    deleteRevision(id: number): Observable<void> {
        return this.http.delete<void>(`${this.urlBase}/${id}`);
    }

    // 6. Obtener datos para la gráfica
    getGraficaData(pacienteId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.urlBase}/grafica/${pacienteId}`);
    }
}
