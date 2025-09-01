package org.jf.repository;

import org.jf.entity.Passo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.jf.entity.Usuario;
import java.util.List;


//Repository é a camada mais proxima do banco de dados.
//É ela que busca, atualiza... o famoso CRUD no banco de dados.
@Repository
public interface PassoRepository extends JpaRepository<Passo, Long> {

    List<Passo> findByUsuario(Usuario usuario);
}
