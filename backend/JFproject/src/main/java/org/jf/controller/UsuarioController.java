package org.jf.controller;

import org.jf.entity.Usuario;
import org.jf.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Criar usuário
    @PostMapping
    public Usuario criarUsuario(@RequestParam String nome) {
        return usuarioService.createUsuario(nome);
    }

    // Consultar usuário pelo ID
    @GetMapping("/{id}")
    public Usuario consultarUsuario(@PathVariable Long id) {
        return usuarioService.getUsuario(id);
    }

    @GetMapping("/criar")
    public Usuario criarUsuarioTeste(@RequestParam String nome) {
        return usuarioService.createUsuario(nome);
    }

}
