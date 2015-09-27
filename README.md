# opentrials-ebola-tracker

A mini app to track trials - [link](https://opentrials-tracker.herokuapp.com/).

[![Shippable](https://img.shields.io/shippable/5604ab341895ca447417f6fe.svg)](https://app.shippable.com/projects/5604ab341895ca447417f6fe)

## Development

To start development process:
```
$ git clone git@github.com:okfn/opentrials-ebola-tracker.git
$ cd opentrials-ebola-tracker
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

To start tests with coverage:
```
$ npm run test
```

All coverage data will be in the `coverage` directory.

## Deployment

The project uses continous integration and deployment (CI/CD) approach.

To deploy you only have to push your changes to Github:
- changes will be automatically pulled by CI/CD service
- the project will be builded and tested
- the project will be deployed to Heroku

Deployment to Heroku will be done only on master branch on green builds.

> More sofisticated CI/CD strategy with stage/production splitting
is planned for next stages of the project.

To tweak the process use `shippable.yml` ([reference](http://docs.shippable.com/yml_reference/))
file in the root of the project.
