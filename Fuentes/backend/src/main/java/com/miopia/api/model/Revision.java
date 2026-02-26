package com.miopia.api.model;

import jakarta.persistence.*; // JPA
import lombok.Data; // Lombok
import java.time.LocalDate;

@Data
@Entity
@Table(name = "revisiones")
public class Revision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaRevision;

    @Column(length = 500)
    private String anamnesis;

    // --- 1. REFRACCIÓN ---
    private Double odEsfera;
    private Double odCilindro;
    private Integer odEje;
    private Double odAgudezaVisual;

    private Double oiEsfera;
    private Double oiCilindro;
    private Integer oiEje;
    private Double oiAgudezaVisual;

    // --- 2. BIOMETRÍA ---
    private Double odK1;
    private Double odK2;
    private Double odLongitudAxial;

    private Double oiK1;
    private Double oiK2;
    private Double oiLongitudAxial;

    // --- 3. VISIÓN BINOCULAR ---
    private String foriaLejos;
    private String foriaCerca;
    private Double ppc;
    private Double mem;
    private Double ac_a;
    private Integer stereopsis;

    // --- 4. TRATAMIENTO ---
    @Enumerated(EnumType.STRING)
    private MetodoTratamiento tratamientoActual;

    private String alertasSistema; // "Posible Insuficiencia..."

    // --- 5. RELACIONES ---

    // Relación con PACIENTE
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    // Relación con OPTOMETRISTA
    @ManyToOne
    @JoinColumn(name = "optometrista_id", nullable = true)
    private Optometrista optometrista;
}