package com.miopia.api.service;

import com.miopia.api.model.Cita;
import com.miopia.api.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    public List<Cita> findAll() {
        return citaRepository.findAll();
    }

    public Optional<Cita> findById(Long id) {
        return citaRepository.findById(id);
    }

    public List<Cita> findByClinicaAndFechas(Long clinicaId, LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.findByClinicaIdAndFechaHoraBetweenOrderByFechaHoraAsc(clinicaId, inicio, fin);
    }

    public List<Cita> findByPaciente(Long pacienteId) {
        return citaRepository.findByPacienteIdOrderByFechaHoraAsc(pacienteId);
    }

    public List<Cita> findFuturasByPaciente(Long pacienteId) {
        return citaRepository.findByPacienteIdAndFechaHoraAfterOrderByFechaHoraAsc(pacienteId, LocalDateTime.now());
    }

    public Cita save(Cita cita) {
        // Por defecto, si no tiene estado, lo ponemos a PENDIENTE
        if (cita.getEstado() == null || cita.getEstado().isEmpty()) {
            cita.setEstado("PENDIENTE");
        }
        return citaRepository.save(cita);
    }

    public void deleteById(Long id) {
        citaRepository.deleteById(id);
    }
}
