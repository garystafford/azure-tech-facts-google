#!/usr/bin/env sh

# author: Gary A. Stafford
# site: https://programmaticponderings.com
# license: MIT License

# Deploy the Google Cloud Function

set -ex

REGION="<your_region>"
FUNCTION_NAME="<your_function_name>"

gcloud beta functions deploy ${FUNCTION_NAME} \
  --runtime nodejs8 \
  --region ${REGION} \
  --trigger-http \
  --memory 256MB \
  --env-vars-file .env.yaml