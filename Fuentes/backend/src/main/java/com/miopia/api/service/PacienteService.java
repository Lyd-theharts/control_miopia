package com.miopia.api.service;

import com.miopia.api.model.Paciente;
import com.miopia.api.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    // 1. GUARDAR PACIENTE (Crear o Editar)
    public Paciente guardarPaciente(Paciente paciente) {
        if (paciente.getFechaAlta() == null) {
            paciente.setFechaAlta(LocalDate.now()); // Fecha de alta automática
        }
        return pacienteRepository.save(paciente);
    }

    // 2. BUSCAR POR ID (Para entrar en su ficha)
    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    // 3. LISTAR TODOS (De mi clínica)
    public List<Paciente> listarPorClinica(Long clinicaId) {
        return pacienteRepository.findByClinicaId(clinicaId);
    }

    // 4. BUSCADOR INTELIGENTE (Por nombre, apellidos o teléfono)
    public List<Paciente> buscarPorNombre(Long clinicaId, String texto) {
        // Busca coincidencias en nombre O en apellidos O en teléfono
        return pacienteRepository
                .findByClinicaIdAndNombreContainingIgnoreCaseOrClinicaIdAndApellidosContainingIgnoreCaseOrClinicaIdAndTelefonoContaining(
                        clinicaId, texto,
                        clinicaId, texto,
                        clinicaId, texto);
    }

    // 5. BUSCAR POR TELÉFONO (Exacto)
    public Optional<Paciente> buscarPorTelefono(Long clinicaId, String telefono) {
        return pacienteRepository.findByClinicaIdAndTelefono(clinicaId, telefono);
    }

    public Paciente actualizarPaciente(Long id, Paciente pacienteActualizado) {
        // 1. Buscamos si existe
        Paciente pacienteExistente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // 2. Actualizamos los datos (uno a uno para estar seguros)
        pacienteExistente.setNombre(pacienteActualizado.getNombre());
        pacienteExistente.setApellidos(pacienteActualizado.getApellidos());
        pacienteExistente.setFechaNacimiento(pacienteActualizado.getFechaNacimiento());
        pacienteExistente.setSexo(pacienteActualizado.getSexo());
        pacienteExistente.setNombreTutor(pacienteActualizado.getNombreTutor());
        pacienteExistente.setTelefono(pacienteActualizado.getTelefono());
        pacienteExistente.setEmailTutor(pacienteActualizado.getEmailTutor());

        // No actualizamos la fecha de alta ni la clínica (normalmente no cambian)

        // 3. Guardamos los cambios
        return pacienteRepository.save(pacienteExistente);
    }

    // --- ELIMINAR (DELETE) ---
    @Autowired
    private com.miopia.api.repository.RevisionRepository revisionRepository;

    // --- ELIMINAR (DELETE) ---
    public void eliminarPaciente(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new RuntimeException("El paciente no existe");
        }

        // 1. Primero borramos el historial médico (Revisiones)
        // Esto evita el error de Clave Foránea (Foreign Key Constraint)
        List<com.miopia.api.model.Revision> historial = revisionRepository.findByPacienteId(id);
        if (!historial.isEmpty()) {
            revisionRepository.deleteAll(historial);
        }

        // 2. Ahora sí podemos borrar al paciente sin problemas
        pacienteRepository.deleteById(id);
    }
}