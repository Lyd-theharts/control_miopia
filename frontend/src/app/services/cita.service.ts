import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../common/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CitaService {
    private apiUrl = 'http://localhost:9090/api/citas'; // Base URL para citas

    constructor(private http: HttpClient) { }

    // Listar todas las citas
    getCitas(): Observable<Cita[]> {
        return this.http.get<Cita[]>(this.apiUrl);
    }

    // Obtener una cita por ID
    getCitaById(id: number): Observable<Cita> {
        return this.http.get<Cita>(`${this.apiUrl}/${id}`);
    }

    // Obtener citas de un paciente
    getCitasByPaciente(pacienteId: number): Observable<Cita[]> {
        return this.http.get<Cita[]>(`${this.apiUrl}/paciente/${pacienteId}`);
    }

    // Obtener citas futuras de un paciente
    getCitasFuturasByPaciente(pacienteId: number): Observable<Cita[]> {
        return this.http.get<Cita[]>(`${this.apiUrl}/paciente/${pacienteId}/futuras`);
    }

    // Obtener citas de una clínica en un rango de fechas (para el calendario)
    getCitasByClinicaAndRange(clinicaId: number, inicio: string, fin: string): Observable<Cita[]> {
        return this.http.get<Cita[]>(`${this.apiUrl}/clinica/${clinicaId}/rango?inicio=${inicio}&fin=${fin}`);
    }

    // Crear una nueva cita
    createCita(cita: Cita): Observable<Cita> {
        return this.http.post<Cita>(this.apiUrl, cita);
    }

    // Actualizar una cita existente
    updateCita(id: number, cita: Cita): Observable<Cita> {
        return this.http.put<Cita>(`${this.apiUrl}/${id}`, cita);
    }

    // Cambiar el estado de una cita rápidamente
    updateEstadoCita(id: number, estado: string): Observable<Cita> {
        return this.http.patch<Cita>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {});
    }

    // Eliminar una cita
    deleteCita(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
