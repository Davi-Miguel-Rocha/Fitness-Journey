package org.jf.entity;

import  jakarta.persistence.*;
import  java.time.LocalDate;


@Entity
public class Passo {


    //Isso aqui vai ser a chave primaria do banco de dados, e são geradas automaticamente pelo spring.
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private long id;

    private double distanciaKm;

    private int quantidadePassos;

    private double calorias;

    private LocalDate data;

    //Como já estudamos banco de dados antes, isso é facil de entender.
    //Essa anotação quer dizer que 1 usuario pode ter muitos passos.
    @ManyToOne
    private Usuario usuario;


    public Passo(){}

    public Passo(double distanciaKm, int quantidadePassos, double calorias, LocalDate data, Usuario usuario) {

        this.distanciaKm = distanciaKm;
        this.quantidadePassos = quantidadePassos;
        this.calorias = calorias;
        this.data = data;
        this.usuario = usuario;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public double getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(double distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public int getQuantidadePassos() {
        return quantidadePassos;
    }

    public void setQuantidadePassos(int quantidadePassos) {
        this.quantidadePassos = quantidadePassos;
    }

    public double getCalorias() {
        return calorias;
    }

    public void setCalorias(double calorias) {
        this.calorias = calorias;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
