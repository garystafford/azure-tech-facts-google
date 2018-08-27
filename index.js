// author: Gary A. Stafford
// site: https://programmaticponderings.com
// license: MIT License

'use strict';

/* CONSTANTS AND GLOBAL VARIABLES */

const {
    dialogflow,
    Suggestions,
    BasicCard,
    SimpleResponse,
    Image,
} = require('actions-on-google');

const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({});
const winston = require('winston');

const app = dialogflow({debug: true});

app.middleware(conv => {
    conv.hasScreen =
        conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    conv.hasAudioPlayback =
        conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
});

// Setup Logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});


const IMAGE_BUCKET = process.env.IMAGE_BUCKET;

const SUGGESTION_1 = 'tell me a random fact';
const SUGGESTION_2 = 'help';
const SUGGESTION_3 = 'cancel';


/* INTENT HANDLERS */

app.intent('Welcome Intent', conv => {
    const WELCOME_TEXT_SHORT = 'What would you like to know about Microsoft Azure?';
    const WELCOME_TEXT_LONG = `What would you like to know about Microsoft Azure? ` +
        `You can say things like:  \n` +
        ` _'tell me about Azure certifications'_  \n` +
        ` _'when was Azure released'_  \n` +
        ` _'give me a random fact'_`;
    const WELCOME_IMAGE = 'image-16.png';

    conv.ask(new SimpleResponse({
        speech: WELCOME_TEXT_SHORT,
        text: WELCOME_TEXT_SHORT,
    }));

    if (conv.hasScreen) {
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
    }
});

app.intent('Fallback Intent', conv => {
    const FACTS_LIST = "Certifications, Cognitive Services, Competition, Compliance, First Offering, Functions, " +
        "Geographies, Global Infrastructure, Platforms, Categories, Products, Regions, and Release Date";
    const HELP_TEXT_SHORT = 'Need a little help?';
    const HELP_TEXT_LONG = `Current facts include: ${FACTS_LIST}.`;
    const HELP_IMAGE = 'image-15.png';

    conv.ask(new SimpleResponse({
        speech: HELP_TEXT_LONG,
        text: HELP_TEXT_SHORT,
    }));

    if (conv.hasScreen) {
        conv.ask(new BasicCard({
            text: HELP_TEXT_LONG,
            title: 'Azure Tech Facts Help',
            image: new Image({
                url: `${IMAGE_BUCKET}/${HELP_IMAGE}`,
                alt: 'Azure Tech Facts',
            }),
            display: 'WHITE',
        }));

        conv.ask(new Suggestions([SUGGESTION_1, SUGGESTION_2, SUGGESTION_3]));
    }
});

app.intent('Azure Facts Intent', async (conv, {facts}) => {
    let factToQuery = facts.toString();
    let fact = await buildFactResponse(factToQuery);

    const AZURE_TEXT_SHORT = `Sure, here's a fact about ${fact.title}`;

    conv.ask(new SimpleResponse({
        speech: fact.response,
        text: AZURE_TEXT_SHORT,
    }));

    if (conv.hasScreen) {
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
    }
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
                logger.log(`Entity: ${results[0][0]}`);
                resolve(results[0][0]);
            })
            .catch(err => {
                logger.log(`Error: ${err}`);
                reject(`Sorry, I don't know the fact, ${factToQuery}.`);
            });
    });
}


/* ENTRY POINT */

exports.functionAzureFactsAction = functions.https.onRequest(app);
