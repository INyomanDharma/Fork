import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // render spinner
    recipeView.renderSpinner();

    // 0
    resultsView.update(model.getSearchResultPage());

    // 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2. Loading recipe
    await model.loadRecipe(id);

    //3. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load results search
    await model.loadSearchResult(query);

    //3. Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //4. Render initation page button
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (goToPage) {
  //!1. Render NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultPage(goToPage));

  //!2. Render NEW initation page button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // 1.) ADD or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  // 2.) Update recipe view
  recipeView.update(model.state.recipe);

  // 3.) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (dataNewRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    // Uploade the new recipe
    await model.uploadRecipe(dataNewRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(` 🌋${err}`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
