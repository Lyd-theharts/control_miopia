package com.miopia.api.dto;

import lombok.Data;

@Data
public class LoginUserDTO {
    // Usamos 'username' porque es lo que tiene tu entidad Clinica
    private String username;
    private String password;
}