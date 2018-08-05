// author: Gary A. Stafford
// site: https://programmaticponderings.com
// license: MIT License

'use strict';

/* CONSTANTS */

const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    SimpleResponse,
    Image,
} = require('actions-on-google');

const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({});

const app = dialogflow({debug: true});

app.middleware(conv => {
    conv.hasScreen =
        conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    conv.hasAudioPlayback =
        conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
});

const IMAGE_BUCKET = 'https://storage.googleapis.com/azure-tech-facts';

const SUGGESTION_1 = 'Tell me a random fact';
const SUGGESTION_2 = 'Help';
const SUGGESTION_3 = 'Cancel';


/* INTENT HANDLERS */

app.intent('Azure Facts Intent', async (conv, {facts}) => {
    let factToQuery = facts.toString();

    let fact = await buildFactResponse(factToQuery);

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask(fact.response);
        return;
    }
    conv.ask(new SimpleResponse({
        speech: fact.response,
        text: `Sure, here\'s a fact about ${fact.title}`,
    }));

    conv.ask(new BasicCard({
        text: fact.response,
        title: fact.title,
        image: new Image({
            url: `${IMAGE_BUCKET}/${fact.image}`,
            alt: fact.title,
        }),
        display: 'WHITE',
    }));

    conv.ask(new Suggestions([SUGGESTION_1, SUGGESTION_2, SUGGESTION_3]));
});

app.intent('Welcome Intent', conv => {
    const WELCOME_TEXT_SHORT = 'What would you like to know about Microsoft Azure?';
    const WELCOME_TEXT_LONG = 'What would you like to know about Microsoft Azure?  \n' +
        'You can say things like:  \n' +
        '   _\'tell me about Azure certifications\'_  \n' +
        '   _\'when was Azure released\'_  \n' +
        '   _\'give me a random fact\'_';
    const WELCOME_IMAGE = 'azure-logo-192x192.png';

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask(WELCOME_TEXT_SHORT);
        return;
    }

    conv.ask(new SimpleResponse({
        speech: WELCOME_TEXT_SHORT,
        text: WELCOME_TEXT_SHORT,
    }));

    conv.ask(new BasicCard({
        text: WELCOME_TEXT_LONG,
        title: 'Azure Tech Facts',
        image: new Image({
            url: `${IMAGE_BUCKET}/${WELCOME_IMAGE}`,
            alt: 'Azure Tech Facts',
        }),
        display: 'WHITE',
    }));

    conv.ask(new Suggestions([SUGGESTION_1, SUGGESTION_2, SUGGESTION_3]));
});

app.intent('Fallback Intent', conv => {
    const FACTS_LIST = "Certifications, Cognitive Services, Competition, Compliance, First Offering, Functions, " +
        "Geographies, Global Infrastructure, Platforms, Categories, Products, Regions, and Release Date";
    const WELCOME_TEXT_SHORT = 'What would you like to know about Microsoft Azure?';
    const WELCOME_TEXT_LONG = `Current facts include: ${FACTS_LIST}.`;
    const WELCOME_IMAGE = 'image-15.png';

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask(WELCOME_TEXT_LONG);
        return;
    }

    conv.ask(new SimpleResponse({
        speech: WELCOME_TEXT_SHORT,
        text: WELCOME_TEXT_SHORT,
    }));

    conv.ask(new BasicCard({
        text: WELCOME_TEXT_LONG,
        title: 'Azure Tech Facts Help',
        image: new Image({
            url: `${IMAGE_BUCKET}/${WELCOME_IMAGE}`,
            alt: 'Azure Tech Facts',
        }),
        display: 'WHITE',
    }));

    conv.ask(new Suggestions([SUGGESTION_1, SUGGESTION_2, SUGGESTION_3]));
});


/* HELPER FUNCTIONS */

function selectRandomFact() {
    const FACTS_ARRAY = ['description', 'released', 'global', 'regions',
        'geographies', 'platforms', 'categories', 'products', 'cognitive',
        'compliance', 'first', 'certifications', 'competition', 'functions'];
    return FACTS_ARRAY[Math.floor(Math.random() * FACTS_ARRAY.length)];
}

function buildFactResponse(factToQuery) {
    return new Promise((resolve, reject) => {

        if (factToQuery.toString().trim() === 'random') {
            factToQuery = selectRandomFact();
        }

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


/* ENTRY POINT */

exports.functionAzureFactsAction = functions.https.onRequest(app);
