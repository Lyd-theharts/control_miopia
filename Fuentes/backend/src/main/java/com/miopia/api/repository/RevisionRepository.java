package com.miopia.api.repository;

import com.miopia.api.model.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RevisionRepository extends JpaRepository<Revision, Long> {

    // Dame el historial médico completo de este niño

    // Dame el historial médico completo de este niño
    List<Revision> findByPacienteId(Long pacienteId);
}