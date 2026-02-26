package com.miopia.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "optometristas")
public class Optometrista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCompleto; // Ej: "Juan Pérez"

    private String numeroColegiado; // Ej: "12345-AND"

    // --- RELACIÓN IMPORTANTE ---
    // Muchos optometristas (Many) pueden trabajar en Una clínica (One)
    // Esto crea la columna 'clinica_id' en la base de datos automáticamente
    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    // @JsonIgnore
    private Clinica clinica;
}