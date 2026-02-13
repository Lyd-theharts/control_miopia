package com.miopia.api.repository;

import com.miopia.api.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // 1. Listar TODOS los pacientes de mi clínica
    List<Paciente> findByClinicaId(Long clinicaId);

    // 2. BUSCAR POR TELÉFONO (Exacto)
    // Usamos Optional y filtramos por clínica (seguridad)
    Optional<Paciente> findByClinicaIdAndTelefono(Long clinicaId, String telefono);

    // 3. BUSCAR POR NOMBRE, APELLIDOS O TELÉFONO (Búsqueda inteligente)
    List<Paciente> findByClinicaIdAndNombreContainingIgnoreCaseOrClinicaIdAndApellidosContainingIgnoreCaseOrClinicaIdAndTelefonoContaining(
            Long clinicaId1, String nombre,
            Long clinicaId2, String apellidos,
            Long clinicaId3, String telefono);
}