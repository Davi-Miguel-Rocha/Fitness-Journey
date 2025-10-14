package org.jf.service;

import org.jf.entity.Usuario;
import org.jf.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Criar usuário
    public Usuario createUsuario(Usuario usuario) {
       // Usuario usuario = new Usuario(nome);
        return usuarioRepository.save(usuario);
    }

    // Consultar usuário pelo ID
    public Usuario getUsuario(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }
}
