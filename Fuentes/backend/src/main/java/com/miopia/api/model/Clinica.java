package com.miopia.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clinicas")
public class Clinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Login
    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    // Datos de la empresa
    @Column(unique = true) //El CIF debe ser único
    private String cif;

    private String nombreComercial;
    private String direccion;
    private String telefono;
}