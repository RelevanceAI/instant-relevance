## Getting started

Install with npm using:
```
npm i @relevanceai/instant-relevance
```

### Javascript support, using [instantsearch.js](https://github.com/algolia/instantsearch.js)

```javascript
import instantsearch from "instantsearch.js";
import {instantRelevanceSearch} from "@relevanceai/instant-relevance";

const searchClient = instantRelevanceSearch({
  project:'dummy-collections',
  api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw'
});
const search = instantsearch({
  searchClient,
  indexName: "1000-movies"
});
search.start();
```

### React support, [react-instantsearch](https://github.com/algolia/react-instantsearch)

### React movies [codesandbox demo](https://codesandbox.io/s/instant-relevance-react-movies-rvxcj?file=/src/App.js)


```jsx harmony
import React from "react";
import ReactDOM from "react-dom";
import { searchbox } from "react-instantsearch-dom";
import {instantRelevanceSearch} from "@relevanceai/instant-relevance";

const searchClient = instantRelevanceSearch({
  project:'dummy-collections',
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

### Vue ecommerce [codesandbox demo](https://codesandbox.io/s/instant-relevance-vue-ecommerce-w3q8g)

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

import { instantRelevanceSearch } from '@relevanceai/instant-relevance';

export default {
  data() {
    const searchClient = instantRelevanceSearch({
      project:'dummy-collections',
      api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw'
    });
    return {
      searchClient,
    };
  },
};
</script>
```
