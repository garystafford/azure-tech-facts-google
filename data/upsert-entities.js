// author: Gary A. Stafford
// site: https://programmaticponderings.com
// license: MIT License

'use strict';

// gcloud beta auth application-default login

/* CONSTANTS */

const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({});

const ENTITIES = [{
    key: datastore.key(["AzureFact", "description"]),
    data: [{
        name: "response",
        value: "According to Wikipedia, Microsoft Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services through a global network of Microsoft-managed data centers.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "What is Azure?",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-01.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "released"]),
    data: [{
        name: "response",
        value: "According to Wikipedia, Azure was released on February 1, 2010 as 'Windows Azure' before being renamed 'Microsoft Azure' on March 25, 2014.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Release Date",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-11.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "global"]),
    data: [{
        name: "response",
        value: "According to Microsoft, with 54 Azure regions, Azure has more global regions than any other cloud provider. Azure is currently available in 140 countries.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Global Network",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-02.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "regions"]),
    data: [{
        name: "response",
        value: "According to Microsoft, an Azure region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Regions",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-03.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "geographies"]),
    data: [{
        name: "response",
        value: "According to Microsoft, Azure regions are organized into geographies. An Azure geography ensures that data residency, sovereignty, compliance, and resiliency requirements are honored within geographical boundaries.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Geography",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-07.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "functions"]),
    data: [{
        name: "response",
        value: "According to Microsoft, Azure Functions is a serverless compute service that enables you to run code on-demand without having to explicitly provision or manage infrastructure.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Functions",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-14.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "platforms"]),
    data: [{
        name: "response",
        value: "According to Wikipedia, Azure provides Software as a Service (SaaS), Containers as a Service (CaaS), Platform as a Service (PaaS), and Infrastructure as a Service (IaaS).",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Platforms",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-10.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "categories"]),
    data: [{
        name: "response",
        value: "Microsoft Azure offer eighteen categories of products, including Compute, Containers, Databases, Mobile, Networking, and Security.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Product Categories",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-04.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "products"]),
    data: [{
        name: "response",
        value: "Microsoft offers over 500 products within eighteen categories, including Machine Learning, Analytics, Functions, Containers, CosmosDB, and Visual Studio Team Services.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Products",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-12.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "cognitive"]),
    data: [{
        name: "response",
        value: "Azure's intelligent algorithms allow apps to see, hear, speak, understand and interpret user needs through natural methods of communication.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Cognitive Services",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-09.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "compliance"]),
    data: [{
        name: "response",
        value: "Microsoft provides the most comprehensive set of compliance offerings (including certifications and attestations) of any cloud service provider.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Compliance",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-06.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "first"]),
    data: [{
        name: "response",
        value: "According to Wikipedia, Microsoft announced SQL Azure Relational Database in March, 2009. Other early Azure products included AppFabric Service Bus, Access Control, and Windows Azure Drive, According to Microsoft.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure SQL",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-08.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "certifications"]),
    data: [{
        name: "response",
        value: "Microsoft currently offers ten different Azure certification exams, allowing IT professionals the ability to differentiate themselves and validate their knowledge and skills.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure Certifications",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-06.png",
            excludeFromIndexes: true,
        }
    ]
}, {
    key: datastore.key(["AzureFact", "competition"]),
    data: [{
        name: "response",
        value: "According to the G2 Crowd website, Azure's Cloud competitors include Amazon Web Services (AWS), Digital Ocean, Google Compute Engine (GCE), and Rackspace.",
        excludeFromIndexes: true,
    },
        {
            name: "title",
            value: "Azure's Competition",
            excludeFromIndexes: true,
        },
        {
            name: "image",
            value: "image-05.png",
            excludeFromIndexes: true,
        }
    ]
}];


/* HELPER FUNCTIONS */

function upsertFacts(entities) {
    return new Promise((resolve, reject) => {
        datastore
            .upsert(entities)
            .then(() => {
                resolve(`${entities.length} entities upserted successfully.`);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function queryFact(myFact) {
    const query = datastore
        .createQuery('AzureFact')
        .filter('__key__', '=', datastore.key(['AzureFact', myFact]));

    return new Promise((resolve, reject) => {
        datastore
            .runQuery(query)
            .then(results => {
                resolve(results[0][0].response);
            })
            .catch(err => {
                reject(err);
            });
    });
}


/* ENTRY POINT */

upsertFacts(ENTITIES)
    .then(results => {
        console.log(results);
        queryFact('competition')
            .then(results => {
                console.log(results);
            })
    });
