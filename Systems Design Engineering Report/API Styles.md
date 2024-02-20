# API Styles

Prior to indexing:

![Untitled](API%20Styles%209522c19418b64bb2b5595544d6de4188/Untitled.png)

After indexing the foreign keys ‘style_id’ of skus and photos tables:

![Untitled](API%20Styles%209522c19418b64bb2b5595544d6de4188/Untitled%201.png)

Further optimization in indexing and query: (indexing product_id in styles table, eliminated grouping query commands, removed any calculations on the controllers side):

![Untitled](API%20Styles%209522c19418b64bb2b5595544d6de4188/Untitled%202.png)