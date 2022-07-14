package com.br.comunicacao.productapi.repository;

import com.br.comunicacao.productapi.module.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
