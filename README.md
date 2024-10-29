# tombstone-service

Microservice that creates a [tombstone](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-tombstone) when a subject is deleted from the db.

## Installation

To add the service to your stack, add the following snippet to docker-compose.yml:

```
services:
  tombstone:
    image: lblod/tombstone-service

```

## Configuration

### Delta

```
  {
    match: {
      predicate: {
        type: 'uri',
        value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
      }
    },
    callback: {
      method: 'POST',
      url: 'http://tombstone/delta'
    },
    options: {
      resourceFormat: 'v0.0.1',
      gracePeriod: 1000,
      ignoreFromSelf: true
    }
  },
```
