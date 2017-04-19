const offlineGoodies = require('../dist/offline-goodies').default;

const enriched = offlineGoodies.enrichWithFetchDate({
  data: {
    id: 1,
    text: 'Example',
  },
});
