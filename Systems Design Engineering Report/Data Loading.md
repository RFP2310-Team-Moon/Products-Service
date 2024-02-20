# Data Loading

**Data Loading Process Challenges:**

### 1. Memory Allocation Issues for Large CSV Files:

One challenge encountered during the data loading process is the potential for memory allocation issues, specifically the "heap out of memory" error code. This occurs when handling large CSV files. To address this, implementing a batch processing method is necessary. This involves loading data in batches, mitigating memory concerns.

### 2. Nameless Columns Cleanup:

Another issue involves nameless columns with random data entries in the CSV. To tackle this, a cleanup process is required before transforming and loading the data. Expecting a specific number of columns, discrepancies between expectations and actual data necessitate precise column location specification during data extraction.

### 3. Schema Edits Based on Intuition:

Intuitive schema edits were made during the process, including:

- Representing binary data (0 and 1) as boolean instead of smallint. Postgres interprets 0 and 1 as True or False when specified in the schema.
- Deciding whether to transform related IDs into arrays or keep them as single entries. Transformation to arrays benefits read functionality, optimizing request lookup time. The tradeoff is the initial load complexity.
- Choosing between single integer columns and arrays for related IDs based on the use case. Single integers provide faster lookup times for overwriting and deletion, while arrays enhance data retrieval speed. The decision to transform into arrays prioritizes improved data retrieval, considering the infrequency of overwrite or delete operations.

### 4. Handling Large CSV Files in Git:

Pushing CSV files to Git is discouraged due to file size. To resolve commits with large files, the recommended approach involves reverting the commit head, pulling from the main branch, resolving conflicts, and pushing changes. Additionally, adding **`*.csv`** to the **`.gitignore`** file prevents future CSV files from being committed.

### 5. Postgres Innate Commands:

After multiple testing, it was concluded that fs ETL methods, while having more controllability, was not as efficient as Postgres commands, thus  the following commands and some clean up update commands were used to load data:

\copy "skus" (id,style_id,size,quantity) FROM './data/skus.csv' WITH CSV HEADER;
\copy "photos" (id,style_id,url,thumbnail_url) FROM './data/photos.csv' WITH CSV HEADER;
\copy "styles" (style_id, product_id, name, sale_price, original_price, "default?") FROM './data/styles.csv' WITH CSV HEADER;
\copy "relateds" (id,product_id,related_product_id) FROM './data/related.csv' WITH CSV HEADER;
\copy "features" (id,product_id,feature,value) FROM './data/features.csv' WITH CSV HEADER;
\copy "products" (id,name,slogan,description,category,default_price) FROM './data/product.csv' WITH CSV HEADER;

UPDATE "photos" SET url = REPLACE(url, E'\n', '');
UPDATE "photos" SET thumbnail_url = REPLACE(thumbnail_url, E'\n', '');

**Set Indexing:**
CREATE INDEX idx_skus_style_id ON "skus" (style_id);
CREATE INDEX idx_photos_style_id ON "photos" (style_id);
CREATE INDEX idx_relateds_product_id ON "relateds" (product_id);
CREATE INDEX idx_features_product_id ON "features" (product_id);
CREATE INDEX idx_style_product_id ON styles (product_id);