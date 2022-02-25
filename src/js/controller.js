import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

async function controlRecipes() {
  try {
    // Get hash from browser
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Load spinner
    recipeView.renderSpinner();

    // Load receipe
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load spinner
    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

function controlPagination(goToPage) {
  // Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render pagination buttons
  paginationView.render(model.state.search);
}

function init() {
  recipeView.addHandlerRecipes(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
}

init();
