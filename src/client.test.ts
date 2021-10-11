import {instantRelevanceSearch} from './index';
test('Indexname can control sort options', async () => {
  const searchClient = instantRelevanceSearch({
    project:'dummy-collections',
    api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw'
  });
  const res = await searchClient.search([
    {
      indexName:'1000-movies/rating/asc',
      params:{
        query:''
      },
    }
  ]);
  expect(res.results[0].hits[0].rating).toBeLessThan(2);
});

