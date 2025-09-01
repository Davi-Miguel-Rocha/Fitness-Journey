package org.jf.service;

import org.jf.entity.Passo;
import org.jf.repository.UsuarioRepository;

import org.jf.entity.Usuario;
import org.jf.repository.PassoRepository;
import org.jf.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;


//Service é onde os dados são processados, a logica do app fica toda aqui.
@Service
public class PassoService {

    @Autowired
    private PassoRepository passoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


   public Passo registrarPasso(Long usuarioId, int quantidadePassos){

       double calorias = quantidadePassos * 0.0005;

      double distanciaKm = (quantidadePassos * 0.762) / 1000;

       LocalDate data = LocalDate.now();

       Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
       if (usuario == null) {

           throw new RuntimeException("Usuario não encontrado");
       }

       Passo passo =  new Passo(distanciaKm, quantidadePassos, calorias ,LocalDate.now(), usuario);

       return passoRepository.save(passo);

   }



}
