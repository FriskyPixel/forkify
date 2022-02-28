import PreviewView from "./previewView.js";

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it.";
  _message = "";
}

export default new BookmarksView();
