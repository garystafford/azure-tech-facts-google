// author: Gary A. Stafford
// site: https://programmaticponderings.com
// license: MIT License

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    SimpleResponse,
    Image,
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

const SUGGESTION_1 = 'Tell me a random fact';
const SUGGESTION_2 = 'Tell me about platforms';
const SUGGESTION_3 = 'Goodbye';

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

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask(fact.response);
        return;
    }

    conv.ask(new SimpleResponse({
        speech: fact.response,
    }));

    // Create a basic card
    conv.ask(new BasicCard({
        text: fact.response,
        title: fact.title,
        image: new Image({
            url: `${BUCKET}/${fact.image}`,
            alt: fact.title,
        }),
        display: 'CROPPED',
    }));

    conv.ask(new Suggestions([SUGGESTION_2, SUGGESTION_3]));

});

app.intent('Welcome Intent', conv => {
    const WELCOME_TEXT_SHORT = 'What would you like to know about Microsoft Azure? ' +
        'You can say things like, tell me about Azure\'s global infrastructure, ' +
        'or when was Azure released.';
    const WELCOME_TEXT_LONG = 'What would you like to know about Microsoft Azure? ' +
        'You can say things like, tell me about Azure\'s global infrastructure, ' +
        'or when was Azure released.';
    const WELCOME_IMAGE = 'azure-logo-192x192.png';

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask(WELCOME_TEXT_SHORT);
        return;
    }

    conv.ask(new SimpleResponse({
        speech: WELCOME_TEXT_SHORT,
        text: WELCOME_TEXT_SHORT,
    }));

    // Create a basic card
    conv.ask(new BasicCard({
        text: WELCOME_TEXT_LONG,
        title: 'Azure Tech Facts',
        image: new Image({
            url: `${BUCKET}/${WELCOME_IMAGE}`,
            alt: 'Azure Tech Facts',
        }),
        display: 'CROPPED',
    }));

    conv.ask(new Suggestions(SUGGESTION_1));

});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.functionAzureFactsAction = functions.https.onRequest(app);
