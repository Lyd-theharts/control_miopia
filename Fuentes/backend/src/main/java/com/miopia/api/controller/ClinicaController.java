package com.miopia.api.controller;

import com.miopia.api.dto.LoginResponse;
import com.miopia.api.dto.LoginUserDTO;
import com.miopia.api.model.Clinica;
import com.miopia.api.service.ClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clinicas")
@CrossOrigin(origins = "http://localhost:4200")
public class ClinicaController {

    @Autowired
    private ClinicaService clinicaService;

    @PostMapping("/registro")
    public Clinica registrar(@RequestBody Clinica clinica) {
        return clinicaService.registrarClinica(clinica);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginUserDTO loginDto) {

        // Fíjate que ahora sacamos los datos del DTO (loginDto.getUsername())
        String token = clinicaService.login(loginDto.getUsername(), loginDto.getPassword());

        if (token != null) {
            return ResponseEntity.ok(new LoginResponse(token, loginDto.getUsername()));
        } else {
            return ResponseEntity.status(401).build();
        }
    }

}