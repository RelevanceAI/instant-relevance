import { SimpleSearchPostInput, SimpleSearchPostOutput } from "./simpleSearchTypes"

export type GeoRectangle = [number, number, number, number]
export type GeoPolygon = [number, number, number, number, number, number]

type InstantSearchParams = {
  query:string,
  // Attributes
  attributesToRetrieve?: string[]
  restrictSearchableAttributes?: string[]

  // Filtering
  filters?: string
  facetFilters?: (string|string[])[]
  optionalFilters?: string[]
  numericFilters?: (string|string[])[]
  sumOrFiltersScores?: boolean

  // Faceting
  facets?: string[] | string
  maxValuesPerFacet?: number
  facetingAfterDistinct?: boolean
  sortFacetValuesBy?: string

  // Highlighting / Snippeting
  attributesToHighlight?: string[]
  attributesToSnippet?: string[]
  highlightPreTag?: string
  highlightPostTag?: string
  snippetEllipsisText?: string
  restrictHighlightAndSnippetArrays?: boolean

  // Pagination
  page?: number
  hitsPerPage?: number
  offset?: number
  length?: number

  // Typos
  minWordSizefor1Typo?: number
  minWordSizefor2Typos?: number
  typoTolerance?: string | boolean
  allowTyposOnNumericTokens?: boolean
  ignorePlurals?: boolean | string[]
  disableTypoToleranceOnAttributes?: string[]

  // Geo-Search
  aroundLatLng?: string
  aroundLatLngViaIP?: boolean
  aroundRadius?: number | 'all'
  aroundPrecision?: number
  minimumAroundRadius?: number
  insideBoundingBox?: GeoRectangle | GeoRectangle[]
  insidePolygon?: GeoPolygon | GeoPolygon[]

  // Query Strategy
  queryType?: string
  removeWordsIfNoResults?: string
  advancedSyntax?: boolean
  optionalWords?: string | string[]
  removeStopWords?: boolean | string[]
  disableExactOnAttributes?: string[]
  exactOnSingleWordQuery?: string
  alternativesAsExact?: string[]

  // Query Rules
  enableRules?: boolean
  ruleContexts?: string[]

  // Advanced
  minProximity?: number
  responseFields?: string[]
  maxFacetHits?: number
  percentileComputation?: boolean
  distinct?: number | boolean
  getRankingInfo?: boolean
  clickAnalytics?: boolean
  analytics?: boolean
  analyticsTags?: string[]
  synonyms?: boolean
  replaceSynonymsInHighlight?: boolean
}
export type InstantSearchInput = {
  params:InstantSearchParams,
  indexName:string,
}

export interface options {
  override?:SimpleSearchPostInput,
  vector_fields?:string[]
  indexToSortMapping?:{[id:string]:SimpleSearchPostInput['sort']}
  indexName?:string
  beforeSearch?:(a:SimpleSearchPostInput) => SimpleSearchPostInput
}
export interface context {
  r: InstantSearchInput;
  processingTimeMS: number;
  options: options;
  
}
export interface _highlight {value:string,matchLevel:'none' | 'full',matchedWords:string[],fullyHighlighted?:boolean}
export interface _highlightResult {
  [id:string]:_highlight[] | _highlight
}
export type InstantSearchOutput = {
  hits: {objectID:any,_highlightResult:_highlightResult,[id:string]:any}[]
  page: number
  nbHits: number
  nbPages: number
  hitsPerPage: number
  processingTimeMS: number
  query: string
  params: string, 
  index: string,
  facets:{[id:string]:{[id:string]:number}}
  facets_stats:{[id:string]:{min:number,max:number,avg:number,sum:number}},
  disjunctiveFacets: {name:string,data:{[id:string]:number},exhaustive:boolean,stats?:{min:number,max:number,avg:number,sum:number}}[]
  exhaustiveFacetsCount:boolean 
  exhaustiveNbHits: boolean
  hierarchicalFacets: []
  queryAfterRemoval: string
}

export type InstantRelevanceSearchInstance = {
  search: ( requests: InstantSearchInput[]) => Promise<{ results: InstantSearchOutput[] }>
}
