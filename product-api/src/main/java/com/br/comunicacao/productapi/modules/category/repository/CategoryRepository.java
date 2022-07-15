package com.br.comunicacao.productapi.modules.category.repository;

import com.br.comunicacao.productapi.modules.category.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
