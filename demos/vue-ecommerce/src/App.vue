<template>
  <div id="root">
    <ais-instant-search
      :search-client="searchClient"
      :index-name="indexName"
      :routing="routing"
    >
      <ais-configure
        :attributesToSnippet="['description:10']"
        snippetEllipsisText="…"
        removeWordsIfNoResults="allOptional"
      />

      <header
        class="header"
        id="header"
      >

        <ais-search-box placeholder="Product, brand, color, …">
          <template v-slot:submit-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 18"
              width="16"
              height="16"
            >
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.67"
                transform="translate(1 1)"
              >
                <circle
                  cx="7.11"
                  cy="7.11"
                  r="7.11"
                ></circle>
                <path d="M16 16l-3.87-3.87"></path>
              </g>
            </svg>
          </template>
        </ais-search-box>
      </header>

      <main class="container">
        <div class="container-wrapper">
          <section class="container-filters">
            <div class="container-header">
              <h2>Filters</h2>

              <ais-clear-refinements data-layout="desktop">
                <template v-slot:resetLabel>
                  <div class="clear-filters">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 11 11"
                    >
                      <g
                        fill="none"
                        fill-rule="evenodd"
                        opacity=".4"
                      >
                        <path d="M0 0h11v11H0z"></path>
                        <path
                          fill="#000"
                          fill-rule="nonzero"
                          d="M8.26 2.75a3.896 3.896 0 1 0 1.102 3.262l.007-.056a.49.49 0 0 1 .485-.456c.253 0 .451.206.437.457 0 0 .012-.109-.006.061a4.813 4.813 0 1 1-1.348-3.887v-.987a.458.458 0 1 1 .917.002v2.062a.459.459 0 0 1-.459.459H7.334a.458.458 0 1 1-.002-.917h.928z"
                        ></path>
                      </g>
                    </svg>
                    Clear filters
                  </div>
                </template>
              </ais-clear-refinements>

              <ais-stats data-layout="mobile">
                <template v-slot="{ nbHits }">
                  <span class="ais-Stats-text">
                    <strong>{{ formatNumber(nbHits) }}</strong> results
                  </span>
                </template>
              </ais-stats>
            </div>

            <div class="container-body">
              <ais-panel>
                <template v-slot:header>Category</template>

                <template v-slot:default>
                  <ais-hierarchical-menu :attributes="[
                      'hierarchicalCategories.lvl0',
                      'hierarchicalCategories.lvl1'
                    ]" />
                </template>
              </ais-panel>

              <ais-panel>
                <template v-slot:header>Brands</template>

                <template v-slot:default>
                  <ais-refinement-list
                    attribute="brand"
                    searchable
                    searchablePlaceholder="Search for brands…"
                  />
                </template>
              </ais-panel>

              <ais-panel>
                <template v-slot:header>Price</template>

                <template v-slot:default>
                  <ais-range-input attribute="price">
                    <template v-slot="{ currentRefinement, range, refine, canRefine }">
                      <vue-slider
                        :min="range.min"
                        :max="range.max"
                        :value="toValue(currentRefinement, range)"
                        :disabled="!canRefine"
                        :lazy="true"
                        :useKeyboard="true"
                        :enableCross="false"
                        tooltip="always"
                        :duration="0"
                        @change="refine({ min: $event[0], max: $event[1] })"
                      >
                        <template v-slot:dot="{ index, value }">
                          <div
                            :aria-valuemin="range.min"
                            :aria-valuemax="range.max"
                            :aria-valuenow="value"
                            :data-handle-key="index"
                            class="vue-slider-dot-handle"
                            role="slider"
                            tabindex="0"
                          />
                        </template>
                        <template v-slot:tooltip="{ value }">
                          {{ formatNumber(value) }}
                        </template>
                      </vue-slider>
                    </template>
                  </ais-range-input>
                </template>
              </ais-panel>

              <ais-panel>
                <template v-slot:header>Free shipping</template>

                <template v-slot:default>
                  <ais-toggle-refinement
                    attribute="free_shipping"
                    label="Display only items with free shipping"
                  />
                </template>
              </ais-panel>

              <ais-panel>
                <template v-slot:header>Ratings</template>

                <template v-slot:default>
                  <ais-rating-menu attribute="rating">
                    <template v-slot="{ items, refine, createURL }">
                      <ul class="ais-RatingMenu-list">
                        <li
                          :class="cx('ais-RatingMenu-item', {
                          'ais-RatingMenu-item--selected': items.every(item => !item.isRefined) || item.isRefined
                        })"
                          v-for="item in items"
                          :key="item.value"
                        >
                          <a
                            class="ais-RatingMenu-link"
                            :aria-label="item.value + ' & up'"
                            :href="createURL(item.value)"
                            @click.prevent="refine(item.value)"
                          >
                            <span
                              v-for="(full, index) in item.stars"
                              :key="index"
                            >
                              <svg
                                :class="cx('ais-RatingMenu-starIcon', {
                                'ais-RatingMenu-starIcon--full': full,
                                'ais-RatingMenu-starIcon--empty': !full,
                              })"
                                aria-hidden="true"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10.472 5.008L16 5.816l-4 3.896.944 5.504L8 12.616l-4.944 2.6L4 9.712 0 5.816l5.528-.808L8 0z"
                                ></path>
                              </svg>
                            </span>

                            <span class="ais-RatingMenu-count">{{ item.count }}</span>
                          </a>
                        </li>
                      </ul>
                    </template>
                  </ais-rating-menu>
                </template>
              </ais-panel>
            </div>
          </section>

          <footer
            class="container-filters-footer"
            data-layout="mobile"
          >
            <clear-refinements
              class="container-filters-footer-button-wrapper"
              @click="closeFilters"
            />

            <ais-stats class="container-filters-footer-button-wrapper">
              <template v-slot="{ nbHits }">
                <button
                  class="button button-primary"
                  @click="closeFilters"
                >
                  See {{ formatNumber(nbHits) }} results
                </button>
              </template>
            </ais-stats>
          </footer>
        </div>

        <section class="container-results">
          <header class="container-header container-options">
            <ais-sort-by
              class="container-option"
              :items="[
                { value: 'ecommerce-instantsearch', label: 'Featured' },
                { value: 'ecommerce-instantsearch/price/asc', label: 'Price ascending' },
                { value: 'ecommerce-instantsearch/price/desc', label: 'Price descending' },
              ]"
            />

            <ais-hits-per-page
              class="container-option"
              :items="[
                {
                  label: '16 hits per page',
                  value: 16,
                  default: getSelectedHitsPerPageValue() === 16 || !getSelectedHitsPerPageValue(),
                },
                {
                  label: '32 hits per page',
                  value: 32,
                  default: getSelectedHitsPerPageValue() === 32,
                },
                {
                  label: '64 hits per page',
                  value: 64,
                  default: getSelectedHitsPerPageValue() === 64,
                },
              ]"
            />
          </header>

          <ais-hits>
            <template v-slot:item="{ item }">
              <article class="hit">
                <header class="hit-image-container">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="hit-image"
                  >
                </header>

                <div class="hit-info-container">
                  <p class="hit-category">{{ item.categories[0] }}</p>
                  <h1>
                    <ais-highlight
                      attribute="name"
                      :hit="item"
                    />
                  </h1>
                  <p class="hit-description">
                    <ais-snippet
                      attribute="description"
                      :hit="item"
                    />
                  </p>
                  <footer>
                    <p>
                      <span class="hit-em">$&nbsp;</span>
                      <strong>{{ formatNumber(item.price) }}</strong>
                      <span class="hit-em hit-rating">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          width="8"
                          height="8"
                        >
                          <path
                            fill="#e2a400"
                            fill-rule="evenodd"
                            d="M10.472 5.008L16 5.816l-4 3.896.944 5.504L8 12.616l-4.944 2.6L4 9.712 0 5.816l5.528-.808L8 0z"
                          ></path>
                        </svg>
                        {{ item.rating }}
                      </span>
                    </p>
                  </footer>
                </div>
              </article>
            </template>
          </ais-hits>

          <no-results />

          <footer class="container-footer">
            <ais-pagination :padding="2">
              <template v-slot="{
                  currentRefinement,
                  pages,
                  isFirstPage,
                  isLastPage,
                  refine,
                  createURL
                }">
                <ul class="ais-Pagination-list">
                  <li
                    class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled"
                    v-if="isFirstPage"
                  >
                    <span class="ais-Pagination-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        width="10"
                        height="10"
                      >
                        <g
                          fill="none"
                          fill-rule="evenodd"
                          stroke="#000"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.143"
                        >
                          <path d="M9 5H1M5 9L1 5l4-4"></path>
                        </g>
                      </svg>
                    </span>
                  </li>

                  <li
                    class="ais-Pagination-item ais-Pagination-item--previousPage"
                    v-if="!isFirstPage"
                  >
                    <a
                      class="ais-Pagination-link"
                      :href="createURL(currentRefinement - 1)"
                      @click.prevent="refine(currentRefinement - 1)"
                      aria-label="Previous"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        width="10"
                        height="10"
                      >
                        <g
                          fill="none"
                          fill-rule="evenodd"
                          stroke="#000"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.143"
                        >
                          <path d="M9 5H1M5 9L1 5l4-4"></path>
                        </g>
                      </svg>
                    </a>
                  </li>

                  <li
                    :class="cx('ais-Pagination-item', 'ais-Pagination-item--page', {
                      'ais-Pagination-item--selected': page === currentRefinement
                    })"
                    v-for="page in pages"
                    :key="page"
                  >
                    <a
                      class="ais-Pagination-link"
                      :href="createURL(page)"
                      :style="{ fontWeight: page === currentRefinement ? 'bold' : '' }"
                      @click.prevent="refine(page)"
                    >{{ page + 1 }}</a>
                  </li>

                  <li
                    class="ais-Pagination-item ais-Pagination-item--nextPage"
                    v-if="!isLastPage"
                  >
                    <a
                      class="ais-Pagination-link"
                      :href="createURL(currentRefinement + 1)"
                      @click.prevent="refine(currentRefinement + 1)"
                      aria-label="Next"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        width="10"
                        height="10"
                      >
                        <g
                          fill="none"
                          fill-rule="evenodd"
                          stroke="#000"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.143"
                        >
                          <path d="M1 5h8M5 9l4-4-4-4"></path>
                        </g>
                      </svg>
                    </a>
                  </li>

                  <li
                    class="ais-Pagination-item ais-Pagination-item--nextPage ais-Pagination-item--disabled"
                    v-if="isLastPage"
                  >
                    <span class="ais-Pagination-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        width="10"
                        height="10"
                      >
                        <g
                          fill="none"
                          fill-rule="evenodd"
                          stroke="#000"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.143"
                        >
                          <path d="M1 5h8M5 9l4-4-4-4"></path>
                        </g>
                      </svg>
                    </span>
                  </li>
                </ul>
              </template>
            </ais-pagination>
          </footer>
        </section>
      </main>

      <aside data-layout="mobile">
        <button
          class="filters-button"
          @click="openFilters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewbox="0 0 16 14"
          >
            <path
              d="M15 1H1l5.6 6.3v4.37L9.4 13V7.3z"
              stroke="#fff"
              stroke-width="1.29"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          Filters
        </button>
      </aside>
    </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import VueSlider from 'vue-slider-component';
import cx from 'classnames';
import ClearRefinements from './widgets/ClearRefinements.vue';
import NoResults from './widgets/NoResults.vue';
import { formatNumber } from './utils';
import getRouting from './routing';
import {instantRelevanceSearch} from '@relevanceai/instant-relevance';

import './Theme.css';
import './App.css';
import './App.mobile.css';
import './widgets/PriceSlider.css';

export default {
  components: {
    VueSlider,
    ClearRefinements,
    NoResults,
  },
  created() {
    this.onKeyUp = (event) => {
      if (event.key !== 'Escape') {
        return;
      }
      this.closeFilters();
    };

    this.onClick = (event) => {
      if (event.target !== this.header) {
        return;
      }

      this.closeFilters();
    };
  },
  mounted() {
    this.resultsContainer = document.querySelector('.container-results');
    this.header = document.querySelector('#header');
  },
  data() {
    let indexName = 'ecommerce-instantsearch';
    let searchClient = instantRelevanceSearch({
      project:'dummy-collections',
      api_key:'UzdYRktIY0JxNmlvb1NpOFNsenU6VGdTU0s4UjhUR0NsaDdnQTVwUkpKZw',
      options:{
        override:{fieldsToAggregateStats:['rating']},
        indexName,
        vector_fields:[],
        // indexToSortMapping:{'instant_search_price_asc':{'price':'asc'},'instant_search_price_desc':{'price':'desc'}}

      },
    }); 
    return {
      cx,
      searchClient,
      indexName,
      routing: getRouting({ indexName }),
    };
  },
  methods: {
    formatNumber,
    toValue(value, range) {
      return [
        typeof value.min === 'number' ? value.min : range.min,
        typeof value.max === 'number' ? value.max : range.max,
      ];
    },
    getSelectedHitsPerPageValue() {
      const [, hitsPerPage] =
        document.location.search.match(/hitsPerPage=([0-9]+)/) || [];
      return Number(hitsPerPage);
    },
    openFilters() {
      document.body.classList.add('filtering');
      window.scrollTo(0, 0);
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('click', this.onClick);
    },
    closeFilters() {
      document.body.classList.remove('filtering');
      this.resultsContainer.scrollIntoView();
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('click', this.onClick);
    },
  },
};
</script>
