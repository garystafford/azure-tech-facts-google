- <https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime>
- <https://github.com/googleapis/nodejs-datastore/tree/master/samples>
- <https://cloud.google.com/datastore/docs/concepts/queries>
- <https://github.com/actions-on-google/actions-on-google-nodejs/issues/174>

```bash
export PROJECT_ID="payx-tech-facts"
gcloud config set project ${PROJECT_ID}
gcloud auth login

export BUCKET="facts-import-export-gstafford"
gcloud datastore export --namespaces="(default)" gs://${BUCKET}


gcloud beta auth application-default login

# update or runtime nodejs8 may be unknown...
gcloud components update

gcloud beta functions deploy functionAzureFactsAction \
  --runtime nodejs8 \
  --region us-central1 \
  --trigger-http \
  --memory 256MB \
  --verbosity info
```
