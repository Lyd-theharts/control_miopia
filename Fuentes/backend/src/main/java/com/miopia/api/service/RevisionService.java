package com.miopia.api.service;

import com.miopia.api.dto.PuntoGrafica;
import com.miopia.api.model.Paciente;
import com.miopia.api.model.Revision;
import com.miopia.api.repository.PacienteRepository;
import com.miopia.api.repository.RevisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RevisionService {

    @Autowired
    private RevisionRepository revisionRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private CalculadoraClinicaService calculadora;

    public List<Revision> obtenerHistorialPaciente(Long pacienteId) {
        return revisionRepository.findByPacienteId(pacienteId);
    }

    // --- CREAR (Ya lo tenías) ---
    public Revision crearNuevaRevision(Revision revision) {
        // 1. Fecha actual si no viene
        if (revision.getFechaRevision() == null) {
            revision.setFechaRevision(LocalDate.now());
        }

        // 2. Validación y Cálculo de LA (Si falta)
        validarYCalcularLA(revision);

        // 3. Alertas
        String alertas = calculadora.generarSugerenciasDiagnosticas(revision);
        if (!alertas.equals("NORMAL")) {
            revision.setAlertasSistema(alertas);
        }

        return revisionRepository.save(revision);
    }

    // --- DATOS GRÁFICA (Ya lo tenías) ---
    public List<PuntoGrafica> obtenerDatosGrafica(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        List<Revision> revisiones = revisionRepository.findByPacienteId(pacienteId);
        List<PuntoGrafica> puntos = new ArrayList<>();

        for (Revision rev : revisiones) {
            Double edadExacta = calculadora.calcularEdadExacta(
                    paciente.getFechaNacimiento(),
                    rev.getFechaRevision());

            if (rev.getOdLongitudAxial() != null) {
                puntos.add(new PuntoGrafica(edadExacta, rev.getOdLongitudAxial()));
            }
        }
        return puntos;
    }

    // --- MÉTODOS NUEVOS (CRUD) ---

    // 1. OBTENER UNA SUELTA (Para editarla)
    public Revision obtenerPorId(Long id) {
        return revisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Revisión no encontrada"));
    }

    // 2. MODIFICAR (UPDATE)
    public Revision modificarRevision(Long id, Revision nuevosDatos) {
        Revision rev = obtenerPorId(id);

        // Actualizamos Fecha y Anamnesis
        rev.setFechaRevision(nuevosDatos.getFechaRevision());
        rev.setAnamnesis(nuevosDatos.getAnamnesis());

        // Actualizamos Refracción
        rev.setOdEsfera(nuevosDatos.getOdEsfera());
        rev.setOdCilindro(nuevosDatos.getOdCilindro());
        rev.setOdEje(nuevosDatos.getOdEje());
        rev.setOdAgudezaVisual(nuevosDatos.getOdAgudezaVisual());

        rev.setOiEsfera(nuevosDatos.getOiEsfera());
        rev.setOiCilindro(nuevosDatos.getOiCilindro());
        rev.setOiEje(nuevosDatos.getOiEje());
        rev.setOiAgudezaVisual(nuevosDatos.getOiAgudezaVisual());

        // Actualizamos Biometría
        rev.setOdK1(nuevosDatos.getOdK1());
        rev.setOdK2(nuevosDatos.getOdK2());
        rev.setOdLongitudAxial(nuevosDatos.getOdLongitudAxial());

        rev.setOiK1(nuevosDatos.getOiK1());
        rev.setOiK2(nuevosDatos.getOiK2());
        rev.setOiLongitudAxial(nuevosDatos.getOiLongitudAxial());

        // Actualizamos Binocular y Tratamiento
        rev.setForiaLejos(nuevosDatos.getForiaLejos());
        rev.setForiaCerca(nuevosDatos.getForiaCerca());
        rev.setPpc(nuevosDatos.getPpc());
        rev.setMem(nuevosDatos.getMem());
        rev.setStereopsis(nuevosDatos.getStereopsis());
        rev.setTratamientoActual(nuevosDatos.getTratamientoActual());

        // Validamos por si han borrado la LA pero dejado las Ks
        validarYCalcularLA(rev);

        // RECALCULAR ALERTAS (Importante: si cambia la graduación, cambia el
        // diagnóstico)
        String nuevasAlertas = calculadora.generarSugerenciasDiagnosticas(rev);
        rev.setAlertasSistema(nuevasAlertas);

        return revisionRepository.save(rev);
    }

    // 3. ELIMINAR (DELETE)
    public void eliminarRevision(Long id) {
        if (revisionRepository.existsById(id)) {
            revisionRepository.deleteById(id);
        } else {
            throw new RuntimeException("No existe la revisión");
        }
    }

    // --- MÉTODO AUXILIAR PRIVADO (Para no repetir código) ---
    private void validarYCalcularLA(Revision revision) {
        // Ojo Derecho
        if (revision.getOdLongitudAxial() == null) {
            if (revision.getOdK1() != null && revision.getOdK2() != null && revision.getOdEsfera() != null) {
                Double estimada = calculadora.estimarLongitudAxial(revision.getOdK1(), revision.getOdK2(),
                        revision.getOdEsfera());
                revision.setOdLongitudAxial(estimada);
            }
        }
        // Ojo Izquierdo
        if (revision.getOiLongitudAxial() == null) {
            if (revision.getOiK1() != null && revision.getOiK2() != null && revision.getOiEsfera() != null) {
                Double estimada = calculadora.estimarLongitudAxial(revision.getOiK1(), revision.getOiK2(),
                        revision.getOiEsfera());
                revision.setOiLongitudAxial(estimada);
            }
        }
    }
}