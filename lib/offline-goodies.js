import errors from 'feathers-errors'

/**
* Add the current date as the fetch date
*/
const enrichWithFetchDate = (obj, fetchDateLabel = 'fetchedAt') => Object.assign(obj, {
  [fetchDateLabel]: Date()
})

/**
* Add the current date as the send date
*/
const enrichWithUpdateAttemptDate = (obj, updateAttemptDateLabel = 'updateAttemptedAt') => Object.assign(obj, {
  [updateAttemptDateLabel]: Date()
})

/**
* Reject outdated update strategy
* If the client fetch date is anterior to the update date from the database,
* the update is denied with a 409 error
*/
const rejectOutdatedUpdate = (options = {}) => (hook) => {
  const updateDateLabel = options.updateDateLabel || 'updatedAt';
  const fetchDateLabel = options.fetchDateLabel || 'fetchedAt';
  return hook.app.service(hook.path).get(hook.id)
  .then(serverObject => {
    if (serverObject[updateDateLabel] > new Date(hook.data[fetchDateLabel])) {
      return Promise.reject(new errors.Conflict('This object was updated since it was last fetched'));
    }
    return Promise.resolve(hook);
  });
};

/**
* Reject later attempted update strategy
* If there was an earlier attempt to update this object
* the update is denied with a 409 error
*/
const rejectLaterAttemptedUpdate = (options = {}) => (hook) => {
  const updateAttemptDateLabel = options.updateAttemptDateLabel || 'updateAttemptedAt';
  return hook.app.service(hook.path).get(hook.id)
  .then(serverObject => {
    if (serverObject[updateAttemptDateLabel] < new Date(hook.data[updateAttemptDateLabel])) {
      return Promise.reject(new errors.Conflict('There was an attempt to modify this object before this update\'s attempt'));
    }
    return Promise.resolve(hook);
  });
};

/**
* Reject sooner attempted update strategy
* If there was an later attempt to update this object
* the update is denied with a 409 error
*/
const rejectSoonerAttemptedUpdate = (options = {}) => (hook) => {
  const updateAttemptDateLabel = options.updateAttemptDateLabel || 'updateAttemptedAt';
  return hook.app.service(hook.path).get(hook.id)
  .then(serverObject => {
    if (serverObject[updateAttemptDateLabel] > new Date(hook.data[updateAttemptDateLabel])) {
      return Promise.reject(new errors.Conflict('There was an attempt to modify this object after this update\'s attempt'));
    }
    return Promise.resolve(hook);
  });
};

export default {
  enrichWithFetchDate,
  enrichWithSendDate,
  rejectOutdatedUpdate,
  rejectLaterAttemptedUpdate,
  rejectSoonerAttemptedUpdate
}
