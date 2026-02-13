package com.miopia.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // Importante para manejar fechas

@Data
@Entity
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos del niño
    private String nombre;
    private String apellidos;

    // FECHAS: Usamos LocalDate (Año-Mes-Dia)
    // Esto es vital para calcular si la miopía avanza rápido según su edad
    private LocalDate fechaNacimiento;

    private String sexo; // "M" o "F" (Importante para curvas de crecimiento)

    // Datos de contacto (Padres/Tutores)
    private String nombreTutor;
    private String telefono;
    private String emailTutor;

    private LocalDate fechaAlta; // Cuando empezó con nosotros

    // --- RELACIÓN DE SEGURIDAD ---
    // Un paciente PERTENECE a una clínica específica.
    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    // @JsonIgnore
    private Clinica clinica;
}