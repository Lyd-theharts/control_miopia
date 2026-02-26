package com.miopia.api.controller;

import com.miopia.api.model.Paciente;
import com.miopia.api.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes") // La URL base será: http://localhost:8080/api/pacientes
@CrossOrigin(origins = "http://localhost:4200") // ¡IMPORTANTE! Permite que Angular entre aquí
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // 1. LISTAR TODOS (De una clínica concreta)
    // Ejemplo URL: GET /api/pacientes?clinicaId=1
    @GetMapping
    public List<Paciente> listarPacientes(@RequestParam("clinicaId") Long clinicaId) {
        return pacienteService.listarPorClinica(clinicaId);
    }

    // 2. CREAR O EDITAR PACIENTE
    // Ejemplo URL: POST /api/pacientes
    // Body: { "nombre": "Pepito", "clinica": {"id": 1} ... }
    @PostMapping
    public Paciente guardarPaciente(@RequestBody Paciente paciente) {
        return pacienteService.guardarPaciente(paciente);
    }

    // 3. BUSCAR POR ID (Entrar en la ficha)
    // Ejemplo URL: GET /api/pacientes/5
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPorId(@PathVariable("id") Long id) {
        return pacienteService.buscarPorId(id)
                .map(ResponseEntity::ok) // Si existe, devuelve 200 OK y el paciente
                .orElse(ResponseEntity.notFound().build()); // Si no, devuelve 404 Not Found
    }

    // 4. BUSCADOR INTELIGENTE (Nombre o Apellidos)
    // Ejemplo URL: GET /api/pacientes/buscar?clinicaId=1&texto=garcia
    @GetMapping("/buscar")
    public List<Paciente> buscarPacientes(
            @RequestParam("clinicaId") Long clinicaId,
            @RequestParam("texto") String texto) {
        return pacienteService.buscarPorNombre(clinicaId, texto);
    }

    // 5. BUSCAR POR TELÉFONO
    // Ejemplo URL: GET /api/pacientes/telefono?clinicaId=1&numero=666777888
    @GetMapping("/telefono")
    public ResponseEntity<Paciente> buscarPorTelefono(
            @RequestParam("clinicaId") Long clinicaId,
            @RequestParam("numero") String numero) {
        return pacienteService.buscarPorTelefono(clinicaId, numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // EN PacienteController.java

    // 6. ACTUALIZAR PACIENTE EXISTENTE
    // URL: PUT /api/pacientes/10
    // Body: { "nombre": "Sofía Corregida", ... }
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizar(
            @PathVariable Long id,
            @RequestBody Paciente paciente) {
        try {
            Paciente actualizado = pacienteService.actualizarPaciente(id, paciente);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 7. ELIMINAR PACIENTE
    // URL: DELETE /api/pacientes/16
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            pacienteService.eliminarPaciente(id);
            return ResponseEntity.noContent().build(); // 204 No Content (Éxito sin devolver nada)
        } catch (Exception e) {
            // Esto pasará si intentas borrar a Sofía (que tiene revisiones)
            System.out.println("Error al borrar: " + e.getMessage());
            return ResponseEntity.status(500).build(); // Error interno (probablemente Clave Foránea)
        }
    }
}