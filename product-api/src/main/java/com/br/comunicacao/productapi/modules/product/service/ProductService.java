package com.br.comunicacao.productapi.modules.product.service;

import com.br.comunicacao.productapi.config.exception.ValidationException;
import com.br.comunicacao.productapi.modules.category.service.CategoryService;
import com.br.comunicacao.productapi.modules.product.dto.ProductRequest;
import com.br.comunicacao.productapi.modules.product.dto.ProductResponse;
import com.br.comunicacao.productapi.modules.product.model.Product;
import com.br.comunicacao.productapi.modules.product.repository.ProductRepository;
import com.br.comunicacao.productapi.modules.supplier.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class ProductService {

    private static final Integer ZERO = 0;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private CategoryService categoryService;

    public ProductResponse save(ProductRequest request){
        validateProductDataInformed(request);
        validateCategoryAndSupplierIdInformed(request);
        var category = categoryService.findById(request.getCategoryId());
        var supplier = supplierService.findById(request.getSupplierId());
        var product = productRepository.save(Product.of(request, category, supplier));
        return ProductResponse.of(product);
    }

    private void validateProductDataInformed(ProductRequest request){
        if (ObjectUtils.isEmpty(request.getName())) {
            throw new ValidationException("The Product's description was not informed.");
        }

        if (ObjectUtils.isEmpty(request.getQuantityAvailable())) {
            throw new ValidationException("The Product's QuantityAvailable was not informed.");
        }

        if (request.getQuantityAvailable() <= ZERO) {
            throw new ValidationException("The quantity should not be less or equal to zero.");
        }
    }

    private void validateCategoryAndSupplierIdInformed(ProductRequest request){
        if (ObjectUtils.isEmpty(request.getCategoryId())) {
            throw new ValidationException("The Category Id was not informed.");
        }

        if (ObjectUtils.isEmpty(request.getSupplierId())) {
            throw new ValidationException("The Supplier Id was not informed.");
        }
    }

}
