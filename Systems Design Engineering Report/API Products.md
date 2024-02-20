# API Products

- First pass implementation for ‘/products/:id’ endpoint

product_id = 1

![Untitled](API%20Products/Untitled.png)

product_id = 1000011

![Untitled](API%20Products/Untitled%201.png)

Identified that features will be used to join to the products data by product_id. Noticed the initial cost is large on product_id in the Features table, so implemented indexing on ‘product_id’ on the Features table:

![Untitled](API%20Products/Untitled%202.png)

Result of Indexing:

![Untitled](API%20Products/Untitled%203.png)

![Untitled](API%20Products/Untitled%204.png)

- First pass implementation for ‘/products’ endpoint

![Untitled](API%20Products/Untitled%205.png)