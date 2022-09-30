// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Short fix to enabling the PWA to run locally. In production, the relative /api path will work because of the SWA configuration.
  // When running locally however, currently have not found a way to run both the SWA and the PWA under the same local dev server.
  apiBasePath: "http://localhost:7131/api",

  apiPaths: {
    plaid: 'http://localhost:4280/api',
  },

  PUBLIC_VAPID_KEY: "BAbMJGRwLHHc76NTvulB-1di3wjxqqLEOgYyz1_DwsfvQQXC57Tp-f_R_qmY-QaF0n7c4tBnX2eyrKwy2ieUBsg"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
