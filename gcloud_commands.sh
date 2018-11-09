gcloud compute instances create curatevm --machine-type=f1-micro --zone europe-west1-d --image-project=ubuntu-os-cloud --image-family=ubuntu-1810

gcloud compute ssh curatevm

sudo apt-get update
sudo apt-get -y install postgresql postgresql-client postgresql-contrib

sudo su - postgres

psql
CREATE EXTENSION adminpack;
CREATE DATABASE curate;
CREATE USER curateadmin WITH PASSWORD '';
ALTER ROLE curateadmin SET client_encoding TO 'utf8';
ALTER ROLE curateadmin SET default_transaction_isolation TO 'read committed';
ALTER ROLE curateadmin SET timezone TO 'UTC';
ALTER USER curateadmin CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE curate TO curateadmin;
\q
exit

sudo nano /etc/postgresql/10/main/pg_hba.conf

sudo nano /etc/postgresql/10/main/postgresql.conf
sudo service postgresql restart
