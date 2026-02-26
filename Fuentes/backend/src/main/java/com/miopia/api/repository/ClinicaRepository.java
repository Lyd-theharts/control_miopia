package com.miopia.api.repository;

import com.miopia.api.model.Clinica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClinicaRepository extends JpaRepository<Clinica, Long> {

    // Buscar por usuario (Login)
    Optional<Clinica> findByUsername(String username);

    // Buscar por CIF (Para evitar duplicados al registrarse)
    Optional<Clinica> findByCif(String cif);
}