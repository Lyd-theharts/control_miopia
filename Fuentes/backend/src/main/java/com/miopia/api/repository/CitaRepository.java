package com.miopia.api.repository;

import com.miopia.api.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    // Obtener todas las citas de una clínica entre unas fechas dadas (para el
    // calendario)
    List<Cita> findByClinicaIdAndFechaHoraBetweenOrderByFechaHoraAsc(Long clinicaId, LocalDateTime inicio,
            LocalDateTime fin);

    // Obtener todas las citas de un paciente ordenadas por fecha (para la ficha del
    // paciente)
    List<Cita> findByPacienteIdOrderByFechaHoraAsc(Long pacienteId);

    // Obtener citas futuras de un paciente
    List<Cita> findByPacienteIdAndFechaHoraAfterOrderByFechaHoraAsc(Long pacienteId, LocalDateTime fechaHora);
}
