# angelica

accessibility detector and page insights

## Docker

if using this service in a docker env make sure to create a .env file and add the env var DOCKER_ENV=true

## Installation

```
npm install
```

## Start

```
npm run dev
```

The server will run on port 8080.

## Testing against localhost

The easiest way to bypass port issues when targeting localhost is to use `hostname -f` and then `http://$yourhost:port` for development

## LICENSE

check the license file in the root of the project.
