import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // state.recipe.bookmarked = state.bookmarks.some(
    //   (bookmark) => bookmark.id === id
    // )
    //   ? true
    //   : false;
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  // Add a bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  state.recipe.bookmarked = true;

  // Update local storage
  persistBookmarks();
}

export function deleteBookmark(id) {
  // Remove a bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  state.recipe.bookmarked = false;

  // Update local storage
  persistBookmarks();
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function restoreBookmarks() {
  const storage = localStorage.getItem("bookmarks");
  // console.log(storage);
  if (storage) state.bookmarks = JSON.parse(storage);
}
