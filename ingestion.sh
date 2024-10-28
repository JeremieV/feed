#!/bin/bash

# run the ingestion script every hour
while true; do
    curl localhost:3000/api/updateAllFeeds
    echo " | $(date) | Batch complete"
    sleep 3600
done
