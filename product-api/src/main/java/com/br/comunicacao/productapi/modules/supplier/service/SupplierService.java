package com.br.comunicacao.productapi.modules.supplier.service;

import com.br.comunicacao.productapi.config.exception.ValidationException;
import com.br.comunicacao.productapi.modules.supplier.dto.SupplierRequest;
import com.br.comunicacao.productapi.modules.supplier.dto.SupplierResponse;
import com.br.comunicacao.productapi.modules.supplier.model.Supplier;
import com.br.comunicacao.productapi.modules.supplier.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public Supplier findById(Integer id){
        return supplierRepository
                .findById(id)
                .orElseThrow(() -> new ValidationException("There's no Supplier for the given ID."));
    }

    public SupplierResponse save(SupplierRequest request){
        validateSupplierNameInformed(request);
        var supplier = supplierRepository.save(Supplier.of(request));
        return SupplierResponse.of(supplier);
    }

    private void validateSupplierNameInformed(SupplierRequest request){
        if (ObjectUtils.isEmpty(request.getName())) {
            throw new ValidationException("The Supplier description was not informed.");
        }
    }
}
