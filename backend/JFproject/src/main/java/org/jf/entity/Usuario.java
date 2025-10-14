package org.jf.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String sobrenome;
    private int idade;
    private String senha;

    public Usuario() {}

    public Usuario(String nome) {
        this.nome = nome;
    }

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) {this.id = id;}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome;}

    public String getSobrenome() { return sobrenome; }
    public void setSobrenome(String sobrenome) { this.sobrenome = sobrenome;}

    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade;}

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha;}
    
}
