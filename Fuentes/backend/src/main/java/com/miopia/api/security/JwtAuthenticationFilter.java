package com.miopia.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;

        // El token viene así: "Bearer eyJhbGciOi..."
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // DEBUG: Ver qué token llega
            // System.out.println(">>> JWT FILTER: Token recibido: " + token.substring(0,
            // 10) + "...");

            String username = jwtUtil.getUsernameFromToken(token);

            if (username != null) {
                // DEBUG: Token válido
                // System.out.println(">>> JWT FILTER: Token VÁLIDO para usuario: " + username);

                // Si el token es válido, dejamos pasar al usuario como "Autenticado"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.emptyList() // No usamos roles complejos por ahora
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println(">>> JWT FILTER: Token INVÁLIDO o EXPIRADO");
            }
        } else {
            // System.out.println(">>> JWT FILTER: No hay token o ya autenticado");
        }

        filterChain.doFilter(request, response);
    }
}