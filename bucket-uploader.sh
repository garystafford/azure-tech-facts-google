#!/bin/sh

# author: Gary A. Stafford
# site: https://programmaticponderings.com
# license: MIT License

set -ex

# Set constants
export PROJECT_ID="azure-tech-facts"
export REGION="us-central1"
export BUCKET="azure-tech-facts-gstafford"

# Create GCP Storage Bucket
gsutil mb \
  -p ${PROJECT_ID} \
  -c regional \
  -l ${REGION} \
   gs://${BUCKET}

# Upload images to bucket
for file in pics/image-*; do
  gsutil cp ${file} gs://${BUCKET}
done

# Make all images public in bucket
gsutil iam ch allUsers:objectViewer gs://${BUCKET}
