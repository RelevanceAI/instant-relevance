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
## Options

```js
const searchClient = instantRelevanceSearch({
  project:'RELEVANCE_PROJECT_NAME',
  api_key:'RELEVANCE_API_KEY',
  options: {
    override: {}, // Sometimes parameters for the RelevanceAI api call need to be replaced. For example: override:{explainRelevance:0.2} will hide less relevant results. All options can be seen here: https://docs.relevance.ai/reference/simplesearchpost
    vector_fields?:['vectorfield_vector_'], // This is easiest way to perform a vector search in addition to traditional search. specify the vector field names here. to customise vector search further, use the 'beforeSearch' option.
    indexToSortMapping:{'indexname1':{'fieldtosort':'asc'},'indexname2':{'fieldtosort':'desc'}}, // This is one of two ways to control sorting. When a sort option is selected by a user, instantsearch will feed in a different indexname. Here you can map each indexname to a sort setting. Alternatively, specify the indexname in the instantsearch sort component in format: indexname/field/asc or indexname/field/desc. An example can be seen in the vue demo under demos/vue-ecommerce/src/App.vue
    indexName:'INITIAL_INDEX_NAME', // instantsearch sometimes changes the index name passed in. Use this to override instantsearches index name.
    beforeSearch:(payload) => {
      payload.minimumRelevance = 0.1;
      return payload;
    }, // This callback gives complete control over the payload body sent to the RelevanceAI api. The first argument is the initial payload body. It must return a valid SimpleSearchPost body as seen here: https://docs.relevance.ai/reference/simplesearchpost
  }
})
```