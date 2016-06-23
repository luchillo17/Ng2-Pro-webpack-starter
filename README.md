# Angular 2 webpack pro template

## Donating

Please consider donating to this humble dev to incentive the development of this repo.

## Features list

- [x] App shell (is the home page)
- [ ] Angular Universal?
- [x] Lazy loading modules (probably needs SystemJS)
  - [x] Webpack code splitting? (es6-promise-loader)
  - [x] Angular 2 Router lazy loading? (Needs Angular 2 router v3)
- [ ] Offline: Service Worker with precache
- [x] Webpack dev server
- [x] HRM (Hot Module Replacement)
- [ ] Installable (Web app manifest)
- [ ] Testing
- [ ] Static template compilation (wait until Ng2 rc3 release)

## Resources

- [Progressive Web Apps](https://www.youtube.com/watch?v=wLWVASD0dvU)
- [Things that exite me about angular 2](http://teropa.info/blog/2016/05/19/things-that-excite-me-about-angular-2.html)

## Package.json comments

- 93-95: Polyfills for webpack, not source
- 97-112: Testing deps
- 114-124: Code compilation, formatting and docs
- 126-144: Webpack loaders and deps
- 146-148: Webpack plugins
- 150-155: Webpack and deps
