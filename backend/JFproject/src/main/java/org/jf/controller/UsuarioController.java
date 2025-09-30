package org.jf.controller;

import org.jf.entity.Usuario;
import org.jf.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    

    // Endpoint para criar usuário
    // URL: POST /usuarios
    // Parâmetro:
    //   nome -> nome do usuário (String)
    // Retorno: objeto Usuario criado em JSON
    //@PostMapping
    //public Usuario criarUsuario(@RequestBody String nome) {
      //  return usuarioService.createUsuario(nome);
    //}

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario) {
        // Usa a anotação @RequestBody para converter o JSON em um objeto Usuario
        Usuario novoUsuario = usuarioService.createUsuario(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }
    // Endpoint para consultar usuário pelo ID
    // URL: GET /usuarios/{id}
    // Parâmetro:
    //   id -> ID do usuário (Long)
    // Retorno: objeto Usuario em JSON
    // Consultar usuário pelo ID
    //@GetMapping("/{id}")
    //public Usuario consultarUsuario(@PathVariable Long id) {
      //  return usuarioService.getUsuario(id);
    //}

    //@GetMapping("/criar")
    //public Usuario criarUsuarioTeste(@RequestParam String nome) {
      //  Usuario novoUsuario = new Usuario();
       // novoUsuario.setNome(nome);
       // return usuarioService.createUsuario(novoUsuario);
   // }

}

