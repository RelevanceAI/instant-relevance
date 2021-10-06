## Getting started

### Javascript support, using [instantsearch.js](https://github.com/algolia/instantsearch.js)

```javascript
import instantsearch from "instantsearch.js";
import {instantRelevanceSearch} from "@relevanceai/relevance-instantsearch";

const searchClient = instantRelevanceSearch({
  username:'dummy-collections',
  api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw'
});
const search = instantsearch({
  searchClient,
  indexName: "1000-movies"
});
search.start();
```

### React support, [react-instantsearch](https://github.com/algolia/react-instantsearch)

```jsx harmony
import React from "react";
import ReactDOM from "react-dom";
import { searchbox } from "react-instantsearch-dom";
import {instantRelevanceSearch} from "@relevanceai/relevance-instantsearch";

const searchClient = instantRelevanceSearch({
  username:'dummy-collections',
  api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw'
});


const App = () => (
  <InstantSearch indexName="1000-movies" searchClient={searchClient}>
    <SearchBox />
    <Hits />
  </InstantSearch>
);
```

### Vue support with [vue-instantsearch](https://github.com/algolia/vue-instantsearch)

```vue
<template>
  <ais-instant-search :search-client="searchClient" index-name="1000-movies">
    <ais-search-box />
    <ais-hits>
      <div slot="item" slot-scope="{ item }">
        <h2>{{ item.name }}</h2>
      </div>
    </ais-hits>
  </ais-instant-search>
</template>

<script>

export default {
  data() {
    const searchClient = instantRelevanceSearch({
      username:'dummy-collections',
      api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw'
    });
    return {
      searchClient,
    };
  },
};
</script>
```