package com.miopia.api.dto;

import lombok.AllArgsConstructor; // Lombok nos regala el constructor
import lombok.Data;

@Data
@AllArgsConstructor // Crea un constructor con (edad, longitudAxial) automáticamente
public class PuntoGrafica {
    private Double edad;           // Eje X (Ej: 8.5 años)
    private Double longitudAxial;  // Eje Y (Ej: 23.45 mm)
}