# BudgetStream.Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.6.

## VAPID Keys

Start by creating local VAPID keys. They can be craeted at [VapidKeys](https://vapidkeys.com/). Once generated:
- Add them to the function projects local.settings.json file (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT). You may need to create this file at the root of the project.
- Add the VAPID_PUBLIC_KEY (only) to the client projects environment files (src/environments/environment.ts).

## Functions host

First start the functions running locally. Currently setup to run on port 7131 by default.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## PWA
To enable the PWA features of the app when running locally, serve from a seperate http server. First `ng build`, then run `http-server -p 8080 -c-1 dist/budget-stream.client` (uses http-server package from npm). CORS are enabled for this domain with the functions.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
