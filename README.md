# Ebola Tracker

[![Gitter](https://img.shields.io/gitter/room/opentrials/chat.svg)](https://gitter.im/opentrials/chat)
[![Travis Build Status](https://travis-ci.org/opentrials/tracker-ebola.svg?branch=fix%2Fmapping)](https://travis-ci.org/opentrials/tracker-ebola)
[![Coverage Status](https://coveralls.io/repos/github/opentrials/tracker-ebola/badge.svg?branch=fix%2Fmapping)](https://coveralls.io/github/opentrials/tracker-ebola?branch=fix%2Fmapping)

A mini app to track trials - [link](https://opentrials-tracker.herokuapp.com/).

## Development

To start development process:
```
$ git clone git@github.com:opentrials/tracker-ebola.git
$ cd tracker-ebola
$ npm install && npm dedup
$ npm run develop
```

## Configuration

The config system uses two sources of settings:
- environment variables e.g. `ACCESS_TOKEN=okfn` (overrides)
- `config.json` in the root of the project e.g. `{"access": {"token": "okfn"}}` (defaults)

To see the current configuration:
```
$ npm run config
```

## Reviewing

The project follow the next style guides:
- [Open Knowledge Coding Standards and Style Guide](https://github.com/okfn/coding-standards)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)

To check the project against JavaScript style guide:
```
$ npm run review
```

## Building

The project is building automatically using command to start the
development server or at CI/CD server for production. To manually
build the project use:
```
$ npm run build
```

## Testing

To start tests:
```
$ npm run test
```

To start tests with coverage:
```
$ npm run coverage
```

Coverage data will be in the `coverage` directory.

## Deployment

The project uses continous integration and deployment (CI/CD) approach.

To deploy you only have to push your changes to Github:
- changes will be automatically pulled by CI/CD service
- the project will be builded and tested
- the project will be deployed to Heroku

Deployment to Heroku will be done only on master branch on green builds.

> More sofisticated CI/CD strategy with stage/production splitting
is planned for next stages of the project.

To tweak the process use `.travis.yml` file in the root of the project.

## Notes

For now the static contents are checked into the repository because the building process relies on the `sass` gem for Ruby. Tasks:
- it should be migrated to `gulp-sass` based on `node-sass`
- `Dockerfile` should be updated to cover the build step
- static contents should be added to the `.gitignore` file
