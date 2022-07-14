package com.br.comunicacao.productapi.service;

import com.br.comunicacao.productapi.config.exception.ValidationException;
import com.br.comunicacao.productapi.dto.CategoryRequest;
import com.br.comunicacao.productapi.dto.CategoryResponse;
import com.br.comunicacao.productapi.module.Category;
import com.br.comunicacao.productapi.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryResponse save(CategoryRequest request){
        validateCategoryNameInformed(request);
        var category = categoryRepository.save(Category.of(request));
        return CategoryResponse.of(category);
    }

    private void validateCategoryNameInformed(CategoryRequest request){
        if (ObjectUtils.isEmpty(request.getDescription())) {
            throw new ValidationException("The category description was not informed.");
        }
    }

}
