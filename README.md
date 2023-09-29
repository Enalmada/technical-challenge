Note: archived due to this now being the recommended stack
https://github.com/Enalmada/nextjs-boilerplate


# Technical Challenge

[https://nextjs-stack-example.adam-lane.vercel.app/app](https://nextjs-stack-example.adam-lane.vercel.app/app)

Note: backend api on vercel is very slow to respond.  Prod env would use dedicated express backend

## About this project
### Frontend
    /src
        /apollo     - client interfaces 
            apollo.tsx - next.js specific code
            apolloClient.ts - apollo client initialization
            queries-mutations.ts - core interface 
        /components - templates
        /pages      - routing
            _document.js - initial SSR response optimizations
            _app.tsx - layout/init wrapper for each page
        /utils
            /auth     - client authentication 
            routes.ts - keep page urls from being duplicate strings     
          
* framework - React/Next.js offers very powerful constantly improving featureset.     
* language - typescript.  Have used reasonML in the past and interfaces are too immature
* API - Graphql provides a very clear interface to the front end.  Apollo Server/Client add 
significant featureset on top of that interface.
* Authentication - Firebase.  Free/secure make it my starting point.    
* validation - YEP is lightweight for client bundles
* forms - react-hook-form makes forms simple and high performance
* CSS - mostly tailwind, I am appreciating composable utility classes 
* apollo query typing - graphql-codegen
* error logging - sentry (see src/pages/_app.js) 
* e2e testing - Cypress
* unit testing - Jest (majestic ui for convenient dev coverage review)
* deployment - Vercel is quick and easy but demo only.  backend api routes are slow, and db connections have no persistence  
  
### Backend
    /src
        /pages/api/graphql.ts - graphql server
        /backend
            /apollo
                TypeDefs.ts - consumer API interface
                Mutation & Query - route interface to service
            /services - business logic    
                
* backend framework - Next.js backend serverless api routes provide easy node.js starting point.
* database - postgres is the safe choice though I have had my eye on FaunaDB
* db object mapping - prisma 2 is gaining on TypeORM but it is still maturing.
See schema.prisma for mapping
* migrations - db-migrate seems like a common choice. 
* email templating - mjml
* validation - YEP to stay consistent with front end 

### Other
* eslint/prettier formatting everything to team agreement
* fixpack for package.json consistency

## TODO
### Technical
* graphql endpoint post uses csrf and server cookie
* optimistic actions - app performs instant despite slow network
* service worker - PWA, temporary offline support
* graphql subscriptions (multi device real time)
* full coverage of Jest and Cypress testing
* analytics
* localization - easier if everyone keeps english out of templates from the start

### Features
* social auth
* account management 
* delete confirmation
* textarea autoexpand

## Notes

### Auth
[NextAuth](https://next-auth.js.org/getting-started/introduction#secure-by-default) has the most robust implementation 
I have seen.  I would recommend starting there if you only needed a web api.  However, it currently is difficult to use
from other places like mobile to use firebase directly. 

### Other Boilerplates
[Next Right Now](https://github.com/UnlyEd/next-right-now) has great examples on how to do some things production ready.

