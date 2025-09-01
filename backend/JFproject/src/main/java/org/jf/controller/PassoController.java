package org.jf.controller;

import org.jf.entity.Passo;
import org.jf.service.PassoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//Diz que o controller vai devolver os dados já em JSON.
@RestController

// Serve pra dizer que todas as URLs dessa classe começam com "/Passos".
//Tudo em spring gira em torno de URLs, são como endereços para saber onde cada requisição vai.

@RequestMapping("/passos")
public class PassoController{

    @Autowired
    private PassoService passoService;

    // Mapping signfica mapeamento.
    //Serve para caso alguém mande uma requisição pra cá POST/passos/registrar. ele use esse método.
    @PostMapping("/registrar")
    public Passo registrar(@RequestParam Long usuarioId, @RequestParam int quantidadePassos){

        return passoService.registrarPasso(usuarioId, quantidadePassos);
    }


}
