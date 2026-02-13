package com.miopia.api.controller;

import com.miopia.api.model.Optometrista;
import com.miopia.api.service.OptometristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/optometristas")
@CrossOrigin(origins = "http://localhost:4200")
public class OptometristaController {

    @Autowired
    private OptometristaService optometristaService;

    // GET http://localhost:9090/api/optometristas?clinicaId=1
    @GetMapping
    public List<Optometrista> listar(@RequestParam Long clinicaId) {
        return optometristaService.listarPorClinica(clinicaId);
    }

    @PostMapping
    public Optometrista crear(@RequestBody Optometrista optometrista) {
        return optometristaService.guardar(optometrista);
    }
}