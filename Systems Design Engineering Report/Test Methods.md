# Test Methods

1. Randomized query request from the bottom 10% of each end point starting with full data fetching.
    1. As an example styles would end at 92194 product_id because it receives the full join computation from 2 other tables: skus and photos. Data without the full join computation would be disregarded. Thus, the bottom 10% of this range would be a product_id of a random number between 82975-92194
    2. Product will receive a random page, count and start number due to pagination
    3. Product Id and related will also follow the same suit as styles endpoint mentioned in point i)
2. Test controls:
    1. Test type: Client per second
    2. Duration: 1 minute
    3. Path and endpoint: randomize product_id per requests (controlled due to advantage of caching- we’d want to randomize the product_id request to provide a larger data set instead of querying the same data set, which would have inherit advantage by using the same cached dataset)
    4. Client Amount: 250, 500, 1000
3. Test for system set up as follows:
    1. 1 database and 1 service EC2 instances (total 2 instances)
    2. 2 database, 4 services, 2 load balancer EC2 instances (total 8 instances)
    3. Same as ii), but implement other optimizations: caching, load balancer algorithms, set up redundancies in database, failover policies
