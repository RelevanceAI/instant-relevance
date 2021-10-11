import fetch from 'cross-fetch';
import { SimpleSearchPostInput, SimpleSearchPostOutput } from "./simpleSearchTypes";
import {  InstantRelevanceSearchInstance, InstantSearchInput, InstantSearchOutput, options,context, _highlightResult } from "./types";
export function instantRelevanceSearch(
  {project,api_key,options}:
  {
  project: string,
  api_key:string,
  options?:options
}
):InstantRelevanceSearchInstance {
  return {
    search: async function (requests) {
      const results =  await Promise.all(requests.map(async r => {
        const context:context = {r,processingTimeMS:10,options: options??{}};
        const simpleSearchPayload = TransformInstantSearchFilters(r,context);
        const {processingTimeMS,simpleSearchResult} = await SimpleSearchPost({body:simpleSearchPayload,project,api_key,dataset_id:options?.indexName ?? r.indexName});
        context.processingTimeMS = processingTimeMS;
        const transformedRes = TransformSimpleSearchResult(simpleSearchResult,context);
        return transformedRes;
      }));
      return {results};
    }
  }
}
function TransformInstantSearchFilters(request:InstantSearchInput,context:context):SimpleSearchPostInput{
  // for facets: [a,[b,c]] -> [a,{or:[b,c]}]
  if (typeof request?.params?.facets === 'string') request.params.facets = [request.params.facets];
  const op_handlers:{[id:string]:(key:string,val:any) => any} = {
    '<=':(key,val) => {return {range:{key,lessThan:val}}},
    '>=':(key,val) => {return {range:{key,greaterThan:val}}},
    ':':(key,val) => {
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      return {match:{key,value:[val]}};
    }
  };
  function transformToRelevanceFilter(filter:string|string[]):any{
    if (Array.isArray(filter)) {
      return {or:filter.map(transformToRelevanceFilter)};
    }
    else {
      for (const [op,callback] of Object.entries(op_handlers)) {
        if (filter.indexOf(op) === -1) continue;
        return callback(filter.split(op)[0],filter.split(op)[1]);
      }
    }
  }
  const filters: SimpleSearchPostInput['filters'] = (request?.params?.numericFilters ?? [])
  .concat(request?.params?.facetFilters ?? [])
  .map(transformToRelevanceFilter);
  let res:SimpleSearchPostInput = {
    page: request?.params?.page ?? 0,
    pageSize:request?.params?.hitsPerPage ?? 10,
    query:request?.params?.query,
    fieldsToAggregate:request?.params?.facets??[],
    explainRelevance:true,
    filters,
    ...(context?.options?.override??{}),
  };
  if (request?.params?.query?.length > 0) res.vectorSearchQuery = (context?.options?.vector_fields??[]).map(field => {return {field}});
  // index/field/dir
  const indexSortParts = request.indexName.match(/^(.*)\/(.*)\/(.*)$/);
  if (indexSortParts) {
    res.sort = {[indexSortParts[2]]:indexSortParts[3] as 'asc' | 'desc'}
    request.indexName = indexSortParts[1];
  }
  if (request.indexName in (context?.options?.indexToSortMapping ?? {})) res.sort = (context?.options?.indexToSortMapping ?? {})[request.indexName];
  if (context?.options?.beforeSearch) res = context.options.beforeSearch({...res,...context?.options?.override??{}});
  return res;

}
function TransformSimpleSearchResult(res:SimpleSearchPostOutput,context:context):InstantSearchOutput{
  const disjunctiveFacets:InstantSearchOutput['disjunctiveFacets'] = [];
  for (const [k,v] of Object.entries(res.aggregations ?? {})) {
    const disjunctiveFacet:InstantSearchOutput['disjunctiveFacets'][0] = {name:k,exhaustive:false,data:v};
    if (k in res?.aggregateStats) disjunctiveFacet.stats = res.aggregateStats[k];
    disjunctiveFacets.push(disjunctiveFacet);
  }
  return {
    hits:res.results.map(hit => { 
      const _highlightResult:_highlightResult = {};
      for (const [k,v] of Object.entries(hit)) {
        if (typeof v === 'string') {
          let relevanceHighlight:string = (((hit as any)?._relevanceExplanation?.query?.highlight ?? {})[k]?? [])[0] ?? "";
          relevanceHighlight = relevanceHighlight
          .replace(/(\<em\>)/g,context?.r?.params?.highlightPreTag??"")
          .replace(/(\<\/em\>)/g,context?.r?.params?.highlightPostTag??"");
          let matchedWords = (relevanceHighlight?.match(/<em>(.*)<\/em>/) ?? [])[1];
          _highlightResult[k] = {
            value:relevanceHighlight?.length ? relevanceHighlight : v,
            matchedWords:matchedWords ? [matchedWords] : [], 
            matchLevel:relevanceHighlight?.length ? 'full' : 'none'};
        }
      }
      const final:InstantSearchOutput['hits'][0] = {
        ...hit,
        objectID:hit._id,
        _highlightResult
      };
      return final;
    }),
    nbHits:res.resultsSize,
    nbPages:Math.ceil(res.resultsSize / (context?.r?.params?.hitsPerPage??10)),
    hitsPerPage:context?.r?.params?.hitsPerPage ?? 10,
    processingTimeMS: context.processingTimeMS,
    query: context.r.params.query, 
    params: '',
    index: context.r.indexName,
    facets: res.aggregations || {},
    facets_stats: res.aggregateStats || {},
    page:context?.r?.params?.page ?? 0,
    disjunctiveFacets,
    exhaustiveFacetsCount:false,
    exhaustiveNbHits:true,
    queryAfterRemoval:"",
    hierarchicalFacets:[]
    // TODO hierarchicalFacets queryAfterRemoval exhaustiveFacetsCount params
  };
}
const SimpleSearchPost = async ({body,dataset_id,project,api_key,endpoint}:{body:SimpleSearchPostInput,dataset_id:string,project:string,api_key:string,endpoint?:string}) => {
  try {
    const start_time = Date.now();
    const res = await fetch(`https://${endpoint ?? 'ingest-api-aueast.relevance.ai'}/latest/datasets/${dataset_id}/simple_search`,{method:'post',headers:{authorization:`${project}:${api_key}`},body:JSON.stringify(body)});
    if(!res.ok) {
      const message = `${res.status} ${(await res.text())}`;
      throw new Error(message)
    }
    const simpleSearchResult = await res.json();
    return {simpleSearchResult:simpleSearchResult as SimpleSearchPostOutput,processingTimeMS:Date.now()-start_time};
  } catch (e) {
    console.error(e);
    throw new Error(e as any);
  }
}