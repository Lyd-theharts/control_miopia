package com.miopia.api.service;

import com.miopia.api.model.Revision;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class CalculadoraClinicaService {

    // --- 1. CÁLCULO DE LONGITUD AXIAL ESTIMADA ---
    public Double estimarLongitudAxial(Double k1, Double k2, Double esfera) {
        if (k1 == null || k2 == null || esfera == null) {
            return null;
        }
        double kPromedio = (k1 + k2) / 2;
        // Fórmula aproximada de ejemplo
        double resultado = 23.5 + (esfera * -0.4) + ((43.0 - kPromedio) * 0.3);
        return Math.round(resultado * 100.0) / 100.0;
    }

    // --- 2. LÓGICA DE DIAGNÓSTICO (EL CEREBRO) ---
    public String generarSugerenciasDiagnosticas(Revision r) {
        List<String> alertas = new ArrayList<>();

        // --- NUEVAS REGLAS AÑADIDAS ---

        // Regla D: MIOPÍA (Refracción)
        if (r.getOdEsfera() != null) {
            if (r.getOdEsfera() <= -6.00) {
                alertas.add("⚠️ ALERTA: Miopía Magna (Alto Riesgo Patológico)");
            } else if (r.getOdEsfera() <= -0.50) {
                alertas.add("Miopía Simple");
            } else if (r.getOdEsfera() >= 2.00) {
                alertas.add("Hipermetropía Significativa");
            }
        }

        // Regla E: LONGITUD AXIAL (Riesgo físico)
        if (r.getOdLongitudAxial() != null) {
            if (r.getOdLongitudAxial() > 26.0) {
                alertas.add("⚠️ Riesgo Maculopatía (LA > 26mm)");
            } else if (r.getOdLongitudAxial() > 24.0 && (r.getOdEsfera() != null && r.getOdEsfera() > -0.50)) {
                // Ojo largo pero sin miopía (Pre-miopía)
                alertas.add("Ojo largo (Riesgo de desarrollar miopía)");
            }
        }

        // --- REGLAS ANTIGUAS (Que ya tenías) ---

        // Regla A: Insuficiencia de Convergencia
        if (r.getPpc() != null && r.getPpc() > 10.0) {
            if (r.getForiaCerca() != null && r.getForiaCerca().toUpperCase().contains("EXO")) {
                alertas.add("Posible Insuficiencia de Convergencia");
            } else {
                alertas.add("PPC Alejado");
            }
        }

        // Regla B: Exceso de Acomodación
        if (r.getMem() != null && r.getMem() < 0.25) {
            alertas.add("Sospecha de Exceso Acomodativo (MEM bajo)");
        }

        // Regla C: Lag Alto
        if (r.getMem() != null && r.getMem() > 0.75) {
            alertas.add("Lag Acomodativo Alto");
        }

        // RESULTADO
        if (alertas.isEmpty()) {
            return "NORMAL";
        }

        return String.join(" | ", alertas);
    }

    // --- 3. CÁLCULO DE EDAD ---
    public Double calcularEdadExacta(LocalDate fechaNacimiento, LocalDate fechaRevision) {
        if (fechaNacimiento == null || fechaRevision == null) return 0.0;
        long diasVividos = ChronoUnit.DAYS.between(fechaNacimiento, fechaRevision);
        double edad = diasVividos / 365.25;
        return Math.round(edad * 100.0) / 100.0;
    }
}