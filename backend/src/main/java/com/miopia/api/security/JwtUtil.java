package com.miopia.api.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // En producción esto iría en application.properties, pero para empezar lo ponemos aquí
    private String SECRET = "miopia_secret_key_12345";
    private long EXPIRATION_DATE = 864_000_000; // 10 días

    // Generar el Token cuando se hace Login
    public String generateToken(String username, Long clinicaId) {
        return JWT.create()
                .withSubject(username)
                .withClaim("clinicaId", clinicaId) // Guardamos el ID dentro del token
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_DATE))
                .sign(Algorithm.HMAC256(SECRET));
    }

    // Validar si el token es real
    public DecodedJWT validateToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(SECRET))
                    .build()
                    .verify(token);
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public String getUsernameFromToken(String token) {
        DecodedJWT decodedJWT = validateToken(token);
        return decodedJWT != null ? decodedJWT.getSubject() : null;
    }
}