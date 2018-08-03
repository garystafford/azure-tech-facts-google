'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    SimpleResponse,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Import the Google Datastore module
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({});

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

app.middleware(conv => {
    conv.hasScreen =
        conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    conv.hasAudioPlayback =
        conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
});

// GCP Storage Bucket path
const BUCKET = 'https://storage.googleapis.com/azure-tech-facts';

// Build the response
function buildFactResponseDatastore(factToQuery) {
    // Return a random fact
    const FACTS_ARRAY = ['description', 'released', 'global', 'regions',
        'geographies', 'platforms', 'categories', 'products', 'cognitive',
        'compliance', 'first', 'certifications', 'competition'];
    if (factToQuery === 'random') {
        factToQuery = FACTS_ARRAY[Math.floor(Math.random() * FACTS_ARRAY.length)];
    }

    return new Promise((resolve, reject) => {
        const query = datastore
            .createQuery('AzureFact')
            .filter('__key__', '=', datastore.key(['AzureFact', factToQuery]));

        datastore
            .runQuery(query)
            .then(results => {
                console.log(results[0][0]);
                const factResponse = results[0][0];
                resolve(factResponse);
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                reject(`Sorry, I don\'t know the fact, ${factToQuery}.`);
            });
    });
}

// Handle the Dialogflow intent named 'Azure Fact Intent'.
// The intent collects a parameter named 'facts'.
app.intent('Azure Facts Intent', async (conv, {facts}) => {
    const factToQuery = facts.toString();

    // Respond with a fact and end the conversation.
    let fact = await buildFactResponseDatastore(factToQuery);

    if (conv.hasScreen) {
        // conv.ask(fact.response);
        conv.close(new BasicCard({
            title: fact.title,
            image: `${BUCKET}/${fact.image}`,
            alt: fact.title,
            url: 'https://azure.microsoft.com'
        }));
    }
    // conv.close(new SimpleResponse({
    //     speech: fact.response,
    //     text: fact.response,
    // }));

    // conv.close(fact.response);
});

app.intent('Default Welcome Intent', conv => {
    conv.ask('Hi, I am in welcome intent.')
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.functionAzureFactsAction = functions.https.onRequest(app);
