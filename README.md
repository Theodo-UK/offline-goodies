# Offline-Goodies

Adds facilities for offline apps

# Features

* Decorate objects on the client side to provide the date at which they were fetched and the date at which they were requested to be updated
* Get some nice feather hooks for your back-end to handle simple strategies for conflict resolutions when updated were attempted offline.

# Installing

`yarn add offline-goodies`


# Client side decorators

```js
import { enrichWithFetchDate, enrichWithUpdateAttemptDate } from 'offline-goodies'

// Receive object from back-end
let receivedObject = {
  id: 1,
  text: 'Text',
};

// Enrich with fetch Date
receivedObject = enrichWithFetchDate(receivedObject);

// Modify object
receivedObject.text = 'Modified text';

// Send object decorated with update attempt date
receivedObject = enrichWithUpdateAttemptDate(receivedObject);
```

`enrichWithFetchDate` accepts 2 parameters:

* obj - the Javascript object to be decorated (required)
* fetchDateLabel - String - The key to use to store the fetch timestamp (optional, default 'fetchedAt')

`enrichWithUpdateAttemptDate` accepts 2 parameters:

* obj - the Javascript object to be decorated (required)
* updateAttemptDateLabel - String - The key to use to store the update attempt timestamp (optional, default 'updateAttemptedAt')


# Back-end conflict resolution strategies

We provide 3 strategies to handle simple conflict resolution when requesting an update of a row on the database.
The easiest strategy which is "latest update to arrive on the back-end" wins is not provided as it is by default what is happening when doing a PUT request.

All strategies are directly usable as feathers hooks to be added to the update or patch before sections.

If you don't use Feathers, feel free to read the code as it is quite easy to understand.

## Reject outdated update strategy

If the client fetch date is anterior to the update date from the database, the update is denied with a 409 error.

`rejectOutdatedUpdate` accepts the `options` parameters in which two key-values can be taken into account.

* updateDateLabel - String - the name of the column on the database to store the update date (optional, default 'updatedAt')
* fetchedAt - String - the key holding the fetched at timestamp in the request payload (optional, default 'fetchedAt')

## Reject later attempted update strategy

If there was an earlier attempt to update this object, the update is denied with a 409 error.

`rejectLaterAttemptedUpdate` accepts the `options` parameters in which one key-value can be taken into account.

* updateAttemptDateLabel - String - the name of both the column on the database to store the update attempt timestamp and of the key holding the update attempt timestamp on the request payload (optional, default 'updateAttemptedAt')
