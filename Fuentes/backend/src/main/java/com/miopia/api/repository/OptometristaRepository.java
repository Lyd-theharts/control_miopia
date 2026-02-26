package com.miopia.api.repository;

import com.miopia.api.model.Optometrista;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OptometristaRepository extends JpaRepository<Optometrista, Long> {

    // Listar solo los optometristas de una tienda concreta
    List<Optometrista> findByClinicaId(Long clinicaId);
}