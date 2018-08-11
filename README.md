- <https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime>
- <https://github.com/googleapis/nodejs-datastore/tree/master/samples>
- <https://cloud.google.com/datastore/docs/concepts/queries>
- <https://github.com/actions-on-google/actions-on-google-nodejs/issues/174>
-<https://developers.google.com/actions/assistant/responses>
-<https://github.com/actions-on-google/dialogflow-facts-about-google-nodejs/blob/master/functions/index.js>


```bash
export PROJECT_ID="azure-tech-facts"
export REGION="us-central1"
export IMAGE_BUCKET="azure-tech-facts-gstafford"

gcloud auth login

gcloud config set project ${PROJECT_ID}

# Create Storage Bucket
gsutil mb \
  -p ${PROJECT_ID} \
  -c regional \
  -l ${REGION} \
   gs://${IMAGE_BUCKET}


gsutil iam ch allUsers:objectViewer gs://${BUCKET}

# Update or runtime nodejs8 may be unknown...
gcloud components update

gcloud beta auth application-default login

# upload Datastore entities
node ./data/upsert-entities.js 

# Deploy Cloud Function
gcloud beta functions deploy functionAzureFactsAction \
  --runtime nodejs8 \
  --region ${REGION} \
  --trigger-http \
  --memory 256MB \
  --env-vars-file .env.yaml
```
