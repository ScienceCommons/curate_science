#!/bin/bash
#
# Backup a Postgresql database into a daily file.
# Run daily at midnight as a cron job: 
# crontab -e
# 0 0 * * * sudo /bin/su -c "/var/lib/postgresql/daily_backup.sh" - postgres >/dev/null 2>&1
#
TODAY=`date --iso-8601`
BACKUP_DIR=/home/alex/curate_backups
DAYS_TO_KEEP=30
DATABASE=curate
USER=postgres
OUTPUT_FILE=${BACKUP_DIR}/curate$TODAY.bak

# do the database backup (dump)
# use this command for a database server on localhost. add other options if need be.
pg_dump ${DATABASE} > ${OUTPUT_FILE}

# gzip the mysql database dump file
# gzip $OUTPUT_FILE

# show the user the result
# echo "${OUTPUT_FILE} was created."
# ls -l ${OUTPUT_FILE}.gz

# prune old backups
find $BACKUP_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*.bak" -exec rm -rf '{}' ';'

