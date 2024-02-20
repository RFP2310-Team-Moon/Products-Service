# How To’s & ReadMe

- **How to create tables in Postgres using Sequelize**
    - Create database in Postgres
        - `psql postgres`
        - List all databases: `\l`
        - Create new DB: `CREATE DATABASE "Products";`
        - Connect to database: `\c "Products"`
        - List all tables: `\dt`
        - Show table schema/structure: `\d table_name`
    - Define schema in `postgres.sql` file
    - Run in terminal: `node postgres.sql`
    - Check your schema has been loaded
        - `psql postgres`
        - `\c Products`
        - `\dt`
        - `\d "Characteristics”`
    - Drop table if you need to restart: `DROP DATABASE "Products";`
- **How to bulk load data into db**
    - `fs.createReadStream(filepath)` initializes the `fs.ReadStream` object -- since this is under-the-hood, we won't interact with `fs.ReadStream` explicitly.
    - `.on('error', () => {} )` checks for errors with the given filepath before we start trying to pipe in its data.
    - `.pipe(csvParser())` begins to pipe data into our ReadStream, which is now listening for the next two events:
        - `.on('data', (row) => {} )` returns each line of the CSV row-by-row, accessible in its callback as `row`.
        - `.on('end', () => {} )` listens for the end of the CSV. You can use this event to call methods you need after the entire file is read.
- **Query List:**
    - Unique count of reviews with a photo
        - `SELECT COUNT(DISTINCT "review_id") FROM "Photos";`
    - Count of reviews that aren’t reported
        - `select count(*) from "Reporteds" where "reported"=false;`
- **Increase node’s memory limit for a script (4gb)**
    - `node --max-old-space-size=4096 {YOUR_SCRIPT.JS}`
- **K6 install instructions:**
    - [https://grafana.com/docs/k6/latest/get-started/installation/](https://grafana.com/docs/k6/latest/get-started/installation/)
    - [https://grafana.com/docs/k6/latest/get-started/running-k6/](https://grafana.com/docs/k6/latest/get-started/running-k6/)
- **AWS EC2 Instance Setup**
    - **DB Instance:**
        - allow server ip connect in in bound rules (allow the EC2 service server’s private ipv4 with a /32 at the end of the ip on your EC2 db server security settings)

            ![Untitled](How%20To%E2%80%99s%20&%20ReadMe/Untitled.png)

        - **Download POSTGRES ([ARTICLE](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart))**

            ```jsx
            // restart postgres server
            sudo systemctl start postgresql.service
            // refresh server's local package index
            sudo apt update
            // Install postgres + contrib package
            sudo apt install postgresql postgresql-contrib
            // Ensure service is started
            sudo systemctl start postgresql.service
            //installation procedure created a user account called postgres that is associated with the default Postgres role
            sudo -i -u postgres
            // connect to db
            psql -h localhost -d {NAME OF DB} -U {USERNAME} -W
            	psql -h localhost -d Review -U postgres -W
            ```


        **Refer to** **Connect EC2 DB and Server Instances (ARTICLE) for how to set up Postgres to accept connection to not just localhost**

        - **Download Node ([ARTICLE](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html))**

            ```bash
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
            . ~/.nvm/nvm.sh
            nvm install --lts
            node -e "console.log('Running Node.js ' + process.version)"
            ```

        - clone repo
        - `npm i`
        - create .env file

            ```bash
            nano .env

            // UPDATE HOST TO Public IPV4 DNS from SERVER EC2 INSTANCE
            ```

        - How to upload data to EC2 instance without RDS

            ```bash

            scp -i {EC2 PERMISSION FILE} ~{RELATIVE LOCATION OF CSV} {SSH LINK}:~{WHERE TO STORE CSV IN EC2 INSTANCE}
            scp -i SDC.pem ~/file-path/sdc/Products-Service/data/raw/products.csv ubuntu@ec2-ipaddress.compute-1.amazonaws.com:~/Products/data/
            ```

    - **Service Instance:**
        - Download Node: [https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)
        - Clone repo
        - `npm i`
        - create .env file
            - `nano .env`
                - Update host: public ipv4 dns from db ec2

                ![Untitled](How%20To%E2%80%99s%20&%20ReadMe/Untitled%201.png)

    - **Connect EC2 DB and Server Instances (ARTICLE)**
        - [https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)

        ```jsx
        sudo nano /etc/postgresql/14.10/main/pg_hba.con
        sudo nano /etc/postgresql/14/main/pg_hba.conf
        ```

        - [https://blog.devart.com/configure-postgresql-to-allow-remote-connection.htm](https://blog.devart.com/configure-postgresql-to-allow-remote-connection.html)
        - Allow External Access to DB

            ```bash
            sudo nano /etc/postgresql/14/main/postgresql.conf
            sudo nano /etc/postgresql/14/main/pg_hba.conf
            sudo ufw allow 5432/tcp
            sudo service postgresql restart
            ```


**NGINX EC2 SETUP**

- Spin up an instance for Nginx EC2
- Add port 80 and port 443 on security inbound and outbound rules to allow http and https type

    ![Untitled](How%20To%E2%80%99s%20&%20ReadMe/Untitled%202.png)

- Start the EC2 instance and proceed to install Nginx: [https://medium.com/@stevernewman/installation-of-nginx-on-aws-ubuntu-instance-e73e72cb8450](https://medium.com/@stevernewman/installation-of-nginx-on-aws-ubuntu-instance-e73e72cb8450)

**NGINX COMMANDS**

```bash
sudo apt update -y
sudo apt install nginx -y
sudo systemctl status nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
sudo systemctl start nginx

// CHECK CACHE IS WORKING
curl -I [http://host.port/](http://ipaddress/products/meta)products
```

**Nginx Config File**

```
# Configure the proxy cache path with specified levels, keys_zone, max_size, and other settings
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

# Define an upstream block named sdcmoon with load balancing settings
upstream sdcmoon{
  least_conn;              # Use the least connections load balancing algorithm
  keepalive 500;           # Keep up to 500 connections alive for reuse
  server ip:port;
  server ip:port;
  server ip:port;
}

# Configure the main server block listening on port 80
server {
  listen 80 backlog=4096;  # Listen on port 80 with a backlog of 4096 connections
  gzip on;                 # Enable gzip compression

  # Handle requests to any endpoints
  location / {
    proxy_cache_valid any 10m;        # Set cache validity to 10 minutes
    proxy_http_version 1.1;           # Use HTTP/1.1 protocol
    proxy_set_header Connection "";   # Set Connection header to an empty string
    proxy_pass http://sdcmoon;        # Proxy requests to the upstream sdcmoon
	proxy_cache_key "$scheme$request_method$host$request_uri$1";
    proxy_cache my_cache;              # Use the cache defined in proxy_cache_path
    add_header X-Cache-Status $upstream_cache_status;  # Add X-Cache-Status header with cache status
	proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    proxy_connect_timeout 5s;
  }

  # Handle requests to the specific loader.io endpoint for verification
  location /loaderio-key {
    return 200 'loaderio-key';  # Return a specific response for verification
  }
}
```

sudo systemctl restart nginx