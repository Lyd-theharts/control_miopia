package com.miopia.api.service;

import com.miopia.api.model.Optometrista;
import com.miopia.api.repository.OptometristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OptometristaService {

    @Autowired
    private OptometristaRepository optometristaRepository;

    // Listar trabajadores de una clínica concreta
    public List<Optometrista> listarPorClinica(Long clinicaId) {
        return optometristaRepository.findByClinicaId(clinicaId);
    }

    // Crear nuevo trabajador
    public Optometrista guardar(Optometrista opt) {
        return optometristaRepository.save(opt);
    }
}