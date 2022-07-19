package com.br.comunicacao.productapi.modules.product.service;

import com.br.comunicacao.productapi.config.exception.SucessReponse;
import com.br.comunicacao.productapi.config.exception.ValidationException;
import com.br.comunicacao.productapi.modules.category.service.CategoryService;
import com.br.comunicacao.productapi.modules.product.dto.ProductRequest;
import com.br.comunicacao.productapi.modules.product.dto.ProductResponse;
import com.br.comunicacao.productapi.modules.product.model.Product;
import com.br.comunicacao.productapi.modules.product.repository.ProductRepository;
import com.br.comunicacao.productapi.modules.supplier.dto.SupplierResponse;
import com.br.comunicacao.productapi.modules.supplier.model.Supplier;
import com.br.comunicacao.productapi.modules.supplier.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Integer ZERO = 0;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private CategoryService categoryService;

    public ProductResponse findByIdResponse(Integer id){
        return ProductResponse.of(findById(id));
    }

    public List<ProductResponse> findAll(){
        return productRepository
                .findAll()
                .stream()
                .map(ProductResponse::of)
                .collect(Collectors.toList());
    }

    public Product findById(Integer id){
        validateInformedId(id);

        return productRepository
                .findById(id)
                .orElseThrow(() -> new ValidationException("There's no product for the given ID."));
    }

    public List<ProductResponse> findByName(String name){
        if (ObjectUtils.isEmpty(name)){
            throw new ValidationException("The product description must be informed.");
        }
        return productRepository
                .findByNameIgnoreCaseContaining(name)
                .stream()
                .map(ProductResponse::of)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> findBySupplierId(Integer supplierId){
        if (ObjectUtils.isEmpty(supplierId)){
            throw new ValidationException("The product supplier must be informed.");
        }
        return productRepository
                .findBySupplierId(supplierId)
                .stream()
                .map(ProductResponse::of)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> findByCategoryId(Integer categoryId){
        if (ObjectUtils.isEmpty(categoryId)){
            throw new ValidationException("The product category must be informed.");
        }
        return productRepository
                .findByCategoryId(categoryId)
                .stream()
                .map(ProductResponse::of)
                .collect(Collectors.toList());
    }

    public ProductResponse save(ProductRequest request){
        validateProductDataInformed(request);
        validateCategoryAndSupplierIdInformed(request);
        var category = categoryService.findById(request.getCategoryId());
        var supplier = supplierService.findById(request.getSupplierId());
        var product = productRepository.save(Product.of(request, category, supplier));
        return ProductResponse.of(product);
    }

    public ProductResponse update(ProductRequest request,
                                  Integer id){
        validateProductDataInformed(request);
        validateCategoryAndSupplierIdInformed(request);
        validateInformedId(id);
        var category = categoryService.findById(request.getCategoryId());
        var supplier = supplierService.findById(request.getSupplierId());
        var product = Product.of(request, category, supplier);
        product.setId(id);
        productRepository.save(product);
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

    public Boolean existsByCategoryId(Integer categoryId){
        return productRepository.existsByCategoryId(categoryId);
    }

    public Boolean existsBySupplierId(Integer supplierId){
        return productRepository.existsBySupplierId(supplierId);
    }

    public SucessReponse delete(Integer id){
        validateInformedId(id);
        productRepository.deleteById(id);
        return SucessReponse.create("The product was deleted.");
    }

    private void validateInformedId(Integer id){
        if (ObjectUtils.isEmpty(id)) {
            throw new ValidationException("The product id must be informed.");
        }
    }

}
