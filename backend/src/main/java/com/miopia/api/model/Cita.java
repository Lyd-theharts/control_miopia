package com.miopia.api.model;

import jakarta.persistence.*; // JPA
import lombok.Data; // Lombok
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "citas")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Column(length = 255)
    private String motivo;

    @Column(length = 50, nullable = false)
    private String estado; // e.g. "PENDIENTE", "COMPLETADA", "CANCELADA"

    @Column(length = 1000)
    private String notas;

    // --- RELACIONES ---

    // Relación con PACIENTE (Muchos a Uno)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Paciente paciente;

    // Relación con CLINICA (Muchos a Uno)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinica_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Clinica clinica;

    // Relación con OPTOMETRISTA (Opcional, Muchos a Uno)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "optometrista_id", nullable = true)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Optometrista optometrista;
}
