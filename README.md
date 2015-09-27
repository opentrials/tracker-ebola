# opentrials-ebola-tracker

A mini app to track trials.

![Shippable](https://img.shields.io/shippable/5604ab341895ca447417f6fe.svg)

## Development

To start development process:
```
$ npm install && npm dedup
$ npm run develop
```

## Configuration

The config system uses two sources of settings:
- environment variables e.g. `ACCESS_TOKEN=okfn` (overrides)
- `config.json` in the root of the project e.g. `{"access": {"token": "okfn"}}` (defaults)

For example to change access token update `config.json` or start the server like:
```
$ ACCESS_TOKEN=new npm run develop
```

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
