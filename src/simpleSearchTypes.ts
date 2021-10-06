// IMPORTANT : [id:string]:any required
export interface SimpleSearchPostInput {
  [id:string]:any
  /**
   * A list of fields to search using the "query" parameter.
   *     Default behaviour is to search all fields.
   *     Example: ["name","favourite_color"]
   */
  query?: string;
  queryConfig?: {
    weight?: number;
    [k: string]: any;
  };
  /**
   * Prioritise the result list of documents based on semantic similarity to "query" provided here.
   *
   *     For example if field "animaltype_vector_" contains encoded vector values for "cat", lion, "dog","bird", and "query" is set to "kitten", documents with "cat", "lion" will be returned first in the results list.
   *
   *     It can be an object or a list of objects.
   *
   *
   *
   *     Example payloads:
   *
   *     {"field":"animaltype_vector_","query":"kitten"}
   *
   *     [
   *
   *     {"field":"animaltype_vector_","query":"kitten","weight":1","model":"text"}, {"field":"animaltype_vector_","query":"https://www.dogimage.com/dogimage.png","model":"image","weight":2}
   *
   *     ]
   */
  vectorSearchQuery?:
    | {
        field: string;
        query?: string;
        model?: string;
        weight?: number;
      }
    | {
        field: string;
        query?: string;
        model?: string;
        weight?: number;
      }[];
  /**
   * A list of fields to search using the "query" parameter.
   *
   *     Default behaviour is to search all fields.
   *
   *     Example: ["name","favourite_color"]
   */
  fieldsToSearch?: string[];
  /**
   * Page of results to return.
   *     Returns results from position page*pageSize to (page+1)*pageSize
   *
   *     Default: 0
   *
   *     Example: 3
   */
  page?: number;
  /**
   * Page size of results to return.
   *     Returns results from position page*pageSize to (page+1)*pageSize
   *
   *     Default: 10
   *
   *     Example: 25
   */
  pageSize?: number;
  /**
   * Only return documents with a _relevance above this threshold.
   *     Example: 0.3
   */
  minimumRelevance?: number;
  /**
   * Prioritise results based on integer, float and boolean fields values. Can sort ascending or descending.
   *
   *     Example 1: {"on_sale":"desc"}
   *
   *     Example 2: {"price":"asc"}
   */
  sort?: {
    [k: string]: "asc" | "desc";
  };
  /**
   * Only return fields of documents listed in this array.
   *
   *     Example: ["name","description_vector_"]
   */
  includeFields?: string[];
  /**
   * Don't return fields of documents listed in this array.
   *
   *     Example: ["name","description_vector"]
   */
  excludeFields?: string[];
  /**
   * Set to true to return all vector fields. IncludeFields / excludeFields has priority over this rule.
   *
   *     Example: true / false
   */
  includeVectors?: boolean;
  /**
   * Prioritise results based on integer, float and boolean fields values. Can sort ascending or descending.
   *
   *     Example 1: {"on_sale":"desc"}
   *
   *     Example 2: {"price":"asc"}
   */
  textSort?: {
    [k: string]: "asc" | "desc";
  };
  fieldsToAggregate?: FieldsToAggregate;
  /**
   * Control which fields aggregate stats data will be generated for. This includes, min value, max value, average value, and document counts per interval within the dataset.
   *
   *     Aggregate data will appear in the "aggregateStats" property of the response body.
   *
   *     Each list item can be:
   *
   *      a string stating which field to aggregate stats on
   *
   *     An object containing "key" to pick a field, and "interval" to control the range of each bucket when counting documents:
   *
   *     For example, if we had products {"price":50},{"price:"150"},{price:"180"},{"key":"price","interval":100}  would split results into 2 buckets.
   *
   *     Default: []
   *     Example: ["postcode",{"key":"price","interval":10}]
   */
  fieldsToAggregateStats?: (
    | string
    | {
        key: string;
        interval?: number;
      }
  )[];
  /**
   * Only Include results that match on this list of filters.
   *
   *     "match" property of filters requires "key" to control which field to match on, and an array of items in "value" to dictate exact match values.
   *
   *     "range" property of filters requires "key" to control which field to match on, and "greaterThan" and/or "lessThan", which must be a number or a date string.
   *
   *     "wildcard" property of filters requires "key" to control which field to match on, and an array of items in "value" to control wildcard match pattern. It may include * to match any string of characters, and ? To match one character.
   *
   *     "or" property of filters requires either: a list of ( subfilters / list of subfilters) etc. [{"match":...},[{"match":...},{"range":...}]].At least one of the subfilters must evaluate to true. If a subfilter is an array, it performs an AND over the sub-sub-filters. For example, [filter1,[filter2,filter3]] is equivalent to filter1 OR (filter2 AND filter3).
   *
   *     Example:
   *     [
   *
   *       {
   *
   *         "match":{
   *
   *           "key":"name",
   *
   *           "value":["television"]
   *
   *         }
   *
   *       },
   *
   *       {
   *
   *         "wildcard":{
   *
   *           "key":"name",
   *
   *           "value":["television*"]
   *
   *         }
   *
   *       },
   *
   *
   *
   *       {
   *
   *         "range":{
   *
   *           "key":"price",
   *
   *           "greaterThan":5.5,
   *
   *           "lessThan":20
   *
   *         }
   *
   *       },
   *
   *       {
   *
   *         "range":{
   *
   *           "key":"postcode",
   *
   *           "greaterThan":2000
   *
   *         }
   *
   *       },
   *
   *       {
   *
   *         "match":{
   *
   *           "key":"likes_dogs",
   *
   *           "value":[true]
   *
   *         }
   *
   *       },
   *
   *       {
   *
   *         "or": [ {"match":{"key":"name","value":["dog"]}},[{"match":{"key":"name","value":["cat"]}},{"wildcard":{"key":"color","value"["orange"]}] ]
   *
   *       },
   *
   *
   *
   *     ]
   */
  filters?: FilterListItem[];
}
export interface FilterListItem {
  match?: {
    key: string;
    value: any[];
  };
  range?: {
    key: string;
    greaterThan?: number | string;
    lessThan?: number | string;
  };
  wildcard?: {
    key: string;
    value: string[];
  };
  selfreference?: {
    a: string;
    b: string;
    operation: "<=" | ">=" | "<" | ">" | "==" | "!=";
  };
  or?: (FilterListItem[] | FilterListItem)[];
  not?: FilterListItem[] | FilterListItem;
}

export interface SimpleSearchPostOutput {
  /**
   * List of documents. List items are affected by page, pageSize, query, filters. Items order is affected by vectorSeachQuery, sort, textSort.
   *
   *     Example: [{"_id":"abcd","animal":"cat","price":10}, {"_id":"abcd","price":13}]
   */
  results: {
    _relevance: number;
    [k: string]: any;
  }[];
  /**
   * Total number of documents matched in the dataset.
   *
   *     Example: 100
   */
  resultsSize: number;
  aggregates: OutputAggregations;
  /**
   * Dictionary of most common field values specified in "fieldsToAggregate".
   *
   *     Example: {"color":{"red":15,"blue":7,"green":1},"name":{"roger":10000,"bill":500,"jo":200}}
   */
  aggregations: {
    [k: string]: {
      [k: string]: number;
    };
  };
  /**
   * Dictionary of field stats.
   *
   *     Fields to summarise is specified in "fieldsToAggregateStats" of request body.
   *
   *     Example: {"price":{"min":0.5,"max":2000,"avg":100,sum:"40230032","results":{"0":202,"100":43,"200":16}}}
   */
  aggregateStats: {
    [k: string]: {
      max: number;
      min: number;
      avg: number;
      sum: number;
    };
  };
}
export interface OutputAggregations {
  [k: string]: {
    results: {
      [k: string]: number;
    };
    aggregates: OutputAggregations;
  };
}
export type FieldsToAggregate = (
  | string
  | {
      key: string;
      resultsSize?: number;
      fieldsToAggregate?: FieldsToAggregate;
    }
)[];