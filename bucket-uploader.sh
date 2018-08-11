#!/usr/bin/env sh

# author: Gary A. Stafford
# site: https://programmaticponderings.com
# license: MIT License

# Create Storage bucket and upload public images

set -ex

# Set constants
PROJECT_ID="<your_project_id>"
REGION="<your_region>"
IMAGE_BUCKET="<your_bucket_name>"

# Create GCP Storage Bucket
gsutil mb \
  -p ${PROJECT_ID} \
  -c regional \
  -l ${REGION} \
   gs://${IMAGE_BUCKET}

# Upload images to bucket
for file in pics/image-*; do
  gsutil cp ${file} gs://${IMAGE_BUCKET}
done

# Make all images public in bucket
gsutil iam ch allUsers:objectViewer gs://${IMAGE_BUCKET}
