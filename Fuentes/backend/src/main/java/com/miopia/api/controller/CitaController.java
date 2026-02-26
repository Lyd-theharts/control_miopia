package com.miopia.api.controller;

import com.miopia.api.model.Cita;
import com.miopia.api.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:4200") // Permitir peticiones desde Angular local
public class CitaController {

    @Autowired
    private CitaService citaService;

    // Obtener todas las citas
    @GetMapping
    public List<Cita> getAllCitas() {
        return citaService.findAll();
    }

    // Obtener cita por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cita> getCitaById(@PathVariable Long id) {
        return citaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener citas de un paciente
    @GetMapping("/paciente/{pacienteId}")
    public List<Cita> getCitasByPaciente(@PathVariable Long pacienteId) {
        return citaService.findByPaciente(pacienteId);
    }

    // Obtener citas futuras de un paciente (pendientes)
    @GetMapping("/paciente/{pacienteId}/futuras")
    public List<Cita> getCitasFuturasByPaciente(@PathVariable Long pacienteId) {
        return citaService.findFuturasByPaciente(pacienteId);
    }

    // Obtener citas de una clínica en un rango de fechas (para el calendario del
    // dashboard)
    @GetMapping("/clinica/{clinicaId}/rango")
    public List<Cita> getCitasByClinicaAndrango(
            @PathVariable Long clinicaId,
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return citaService.findByClinicaAndFechas(clinicaId, inicio, fin);
    }

    // Crear nueva cita
    @PostMapping
    public Cita createCita(@RequestBody Cita cita) {
        return citaService.save(cita);
    }

    // Actualizar cita
    @PutMapping("/{id}")
    public ResponseEntity<Cita> updateCita(@PathVariable Long id, @RequestBody Cita citaDetails) {
        return citaService.findById(id)
                .map(cita -> {
                    cita.setFechaHora(citaDetails.getFechaHora());
                    cita.setMotivo(citaDetails.getMotivo());
                    cita.setEstado(citaDetails.getEstado());
                    cita.setNotas(citaDetails.getNotas());
                    // Puedes decidir si permites cambiar el paciente, clinica y opto, normalmente
                    // solo fecha/estado
                    if (citaDetails.getOptometrista() != null) {
                        cita.setOptometrista(citaDetails.getOptometrista());
                    }
                    Cita updatedCita = citaService.save(cita);
                    return ResponseEntity.ok(updatedCita);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Cambiar estado rapido (ej. COMPLETADA / CANCELADA)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Cita> updateEstadoCita(@PathVariable Long id, @RequestParam("estado") String estado) {
        return citaService.findById(id)
                .map(cita -> {
                    cita.setEstado(estado);
                    Cita updatedCita = citaService.save(cita);
                    return ResponseEntity.ok(updatedCita);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar cita
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCita(@PathVariable Long id) {
        return citaService.findById(id)
                .map(cita -> {
                    citaService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
