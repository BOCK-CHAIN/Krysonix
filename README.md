# Krsyonix

## Tech Stack

- Framework: Next.js
- Database: PostgreSQL (via Prisma ORM)
- Authentication: NextAuth.js
- Storage/CDN: Google Cloud Storage or AWS S3

---

## Getting Started

### Deploying Locally

#### 1. Clone the Repository

```bash
git clone repo_link
cd krsyonix
```

#### 2. Creaate a .env file

```bash
DATABASE_URL=                     # PostgreSQL connection string
NEXTAUTH_URL=http://localhost:3000 

# CDN Configuration
NEXT_PUBLIC_CDN_LINK=gcp          # 'gcp' or 'aws'

# GCP Settings (if using GCP)(above cdn config)
GCS_BUCKET_NAME=your_bucket_name
GCS_FILE_NAME=gcs-key.json
NEXT_PUBLIC_GCS_CDN_URL=         # Load balancer IP from GCP Media CDN

# AWS Settings (if using AWS)(above cdn config)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
S3_BUCKET_NAME=
NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=

# NextAuth
NEXTAUTH_SECRET=                 # Generate a random secret from NextAuth docs
```
#### 3. Also place your gcs-key.json file in the root if using GCP.

#### 4. 
```bash
npm install
npm run dev
```

#### 5. Check errors for production
```bash 
npm run build
```

#### 6.  ``` npm run start ```

### Deploying in Production

### Configure nginx : 

#### 1. Install nginx
```bash
sudo apt update
sudo apt install nginx -y
```

#### 2. 
```bash
sudo nano /etc/nginx/sites-available/krsyonix
```

#### 3.
```bash
server {
  listen 80;
  server_name yourdomain.com; # add the domain name or the ip address if not applicable.

  location / {
    proxy_pass http://localhost:3000; # since the app is running on 3000
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

#### 4.
```bash
sudo ln -s /etc/nginx/sites-available/krsyonix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Same steps as development till step 5 ( skip ```npm run dev``` )

### Make sure ```NEXTAUTH_URL= # the app ip or domain name```

```bash
npm i -g pm2
pm2 start "npm run start" --name krysonix
pm2 save
pm2 logs # check the logs
```