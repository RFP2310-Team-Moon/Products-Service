# Results

After implementing load balancer with least connections and caching, we’ve received a substantial improvement in performance and stability that is quantified below:

### Indexing Localhost Postman Tests Prior to Deployment

| Endpoint | Original Latency | Indexing Latency | Percentage |
| --- | --- | --- | --- |
| /products/(product_id) | 71ms | 13ms | 81.69% |
| /products/(product_id)/styles | 310ms | 5ms | 98.39% |
| /products/(product_id)/related | 30ms | 9ms | 70% |
- **Before Optimization Specs:**
    - 1 EC2 Database, 1 EC2 Service
- **After Optimization Specs:**
    - 2 EC2 Database, 4 EC2 Service, 2 EC2 Load Balancer, Caching, Least Connections Load Balancing Algorithm, Indexing, AWS Route 53 Failover Policy
- **Test method for data below:**
    - 1000 clients per second
    - Duration: 1 minute
    - Randomized product_id from last 10% of *full* datasets (see test method page for explanation)

## /products

| Metric | Before Optimization | After Optimization | Percentage |
| --- | --- | --- | --- |
| Request Per Second (RPS) | 872.82  | 1000 | 14.58% |
| Latency  | 1871ms | 60ms | 97.19% |
| Error Rate | 0% | 0% | 0% |

## /products/id

| Metric | Before Optimization | After Optimization | Percentage |
| --- | --- | --- | --- |
| Request Per Second (RPS) | 689.03 | 1000 | 45.11% |
| Latency  | 2335ms | 62ms | 97.35% |
| Error Rate | 0.1% | 0% | 100% |

## /products/id/styles

| Metric | Before Optimization | After Optimization | Percentage |
| --- | --- | --- | --- |
| Request Per Second (RPS) | 0 | 1000 | 100% |
| Latency  | 10206ms | 60ms | 99.41% |
| Error Rate | 100% | 0% | 100% |

## /products/id/related

| Metric | Before Optimization | After Optimization | Percentage |
| --- | --- | --- | --- |
| Request Per Second (RPS) | 963.65 | 999.98 | 3.77% |
| Latency  | 1572ms | 60ms | 96.19% |
| Error Rate | 0% | 0% | 0% |

Significantly enhancing the performance of the /styles endpoint, which constitutes data-intensive and latency-sensitive queries, resulted in a substantial improvement in system capacity. Previously, the system faced constraints, being unable to sustain more than 250 clients per second due to a high error rate threshold. Following optimizations by implementing horizontal scaling, load balancer, caching and least connecting load balancing algorithm, the system's capability increased dramatically, enabling it to efficiently handle up to 5000 clients per second with a reduced latency of 62 ms.