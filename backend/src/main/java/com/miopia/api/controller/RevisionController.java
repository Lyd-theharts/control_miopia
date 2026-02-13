package com.miopia.api.controller;

import com.miopia.api.dto.PuntoGrafica;
import com.miopia.api.model.Revision;
import com.miopia.api.service.RevisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revisiones")
public class RevisionController {

    @Autowired
    private RevisionService revisionService;

    // 1. GUARDAR NUEVA REVISIÓN
    @PostMapping
    public ResponseEntity<Revision> crearRevision(@RequestBody Revision revision) {
        System.out.println(">>> RECIBIDA PETICIÓN POST /api/revisiones");
        System.out.println("Datos: " + revision);
        try {
            Revision nueva = revisionService.crearNuevaRevision(revision);
            return ResponseEntity.ok(nueva);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 2. HISTORIAL COMPLETO DE UN NIÑO
    @GetMapping("/paciente/{pacienteId}")
    public List<Revision> obtenerHistorial(@PathVariable("pacienteId") Long pacienteId) {
        System.out.println(">>> RECIBIDA PETICIÓN GET /api/revisiones/paciente/" + pacienteId);
        return revisionService.obtenerHistorialPaciente(pacienteId);
    }

    // 3. DATOS PARA LA GRÁFICA
    @GetMapping("/grafica/{pacienteId}")
    public List<PuntoGrafica> obtenerDatosGrafica(@PathVariable("pacienteId") Long pacienteId) {
        return revisionService.obtenerDatosGrafica(pacienteId);
    }

    // --- MÉTODOS NUEVOS (CRUD COMPLETO) ---

    // 4. OBTENER UNA REVISIÓN SUELTA (GET /api/revisiones/5)
    @GetMapping("/{id}")
    public ResponseEntity<Revision> obtenerRevision(@PathVariable("id") Long id) {
        try {
            Revision revision = revisionService.obtenerPorId(id);
            return ResponseEntity.ok(revision);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. MODIFICAR REVISIÓN (PUT /api/revisiones/5)
    @PutMapping("/{id}")
    public ResponseEntity<Revision> actualizarRevision(@PathVariable("id") Long id, @RequestBody Revision revision) {
        try {
            Revision actualizada = revisionService.modificarRevision(id, revision);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. ELIMINAR REVISIÓN (DELETE /api/revisiones/5)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRevision(@PathVariable("id") Long id) {
        try {
            revisionService.eliminarRevision(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}