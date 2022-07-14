INSERT INTO CATEGORY (id, description) VALUES (1, 'Comic books');
INSERT INTO CATEGORY (id, description) VALUES (2, 'Movies');
INSERT INTO CATEGORY (id, description) VALUES (3, 'Books');


INSERT INTO SUPPLIER (id, name) VALUES (1, 'Panini comics');
INSERT INTO SUPPLIER (id, name) VALUES (2, 'Amazon');


INSERT INTO PRODUCT (id, name, fk_supplier, fk_category, quantity_available) VALUES (1, 'Crise nas infinitas terras', 1, 1, 10);

INSERT INTO PRODUCT (id, name, fk_supplier, fk_category, quantity_available) VALUES (2, 'Interestelar', 2, 2, 5);

INSERT INTO PRODUCT (id, name, fk_supplier, fk_category, quantity_available) VALUES (3, 'Harry Potter', 2, 3, 3);