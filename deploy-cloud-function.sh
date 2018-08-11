#!/usr/bin/env sh

# author: Gary A. Stafford
# site: https://programmaticponderings.com
# license: MIT License

set -ex

# Set constants
REGION="<your_region>"
FUNCTION_NAME="<your_function_name>"

# Deploy the Google Cloud Function
gcloud beta functions deploy ${FUNCTION_NAME} \
  --runtime nodejs8 \
  --region ${REGION} \
  --trigger-http \
  --memory 256MB \
  --env-vars-file .env.yaml