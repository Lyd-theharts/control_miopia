package com.miopia.api.service;

import com.miopia.api.model.Clinica;
import com.miopia.api.repository.ClinicaRepository;
import com.miopia.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClinicaService {

    @Autowired
    private ClinicaRepository clinicaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Herramienta de encriptado

    @Autowired
    private JwtUtil jwtUtil; // Herramienta de Tokens

    // 1. REGISTRO (Encriptando password)
    public Clinica registrarClinica(Clinica clinica) {
        // "1234" -> "$2a$10$Ha..."
        clinica.setPassword(passwordEncoder.encode(clinica.getPassword()));
        return clinicaRepository.save(clinica);
    }

    // 2. LOGIN (Devuelve el Token si es correcto)
    public String login(String username, String passwordRaw) {
        Optional<Clinica> clinicaOpt = clinicaRepository.findByUsername(username);

        if (clinicaOpt.isPresent()) {
            Clinica clinica = clinicaOpt.get();
            // Comparamos password escrita vs password encriptada en BD
            if (passwordEncoder.matches(passwordRaw, clinica.getPassword())) {
                return jwtUtil.generateToken(username, clinica.getId());
            }
        }
        return null; // Login fallido
    }
}