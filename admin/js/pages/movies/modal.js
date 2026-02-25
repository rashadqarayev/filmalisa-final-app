import { state } from "./state.js";
import {
  selectedActorIds,
  cmsRenderTags,
  cmsUpdateListSelection,
  cmsClearSelection,
  cmsBuildList,
} from "./actorSelect.js";

const editModalElement = document.getElementById("editModal");
export const editModal = new bootstrap.Modal(editModalElement);
const deleteModal = document.getElementById("deleteModal");
const deleteItemName = document.getElementById("deleteItemName");

const movieTitleInput = document.getElementById("movieTitle");
const movieOverviewInput = document.getElementById("movieOverview");
const movieCoverInput = document.getElementById("movieCover");
const movieTrailerInput = document.getElementById("movieTrailer");
const movieWatchInput = document.getElementById("movieWatch");
const movieImdbInput = document.getElementById("movieImdb");
const movieRuntimeInput = document.getElementById("movieRuntime");
const movieAdultInput = document.getElementById("movieAdult");
const catSelect = document.getElementById("catSelect");
const previewImg = document.getElementById("previewImg");

const PLACEHOLDER_IMG =
  "https://qqcdnpictest.mxplay.com/pic/cc1f9610b1cc638cf9b60f305ee1b4d6/en/2x3/312x468/test_pic1759756606210_badged_1761714017652.webp";

export function resetForm() {
  movieTitleInput.value = "";
  movieOverviewInput.value = "";
  movieCoverInput.value = "";
  movieTrailerInput.value = "";
  movieWatchInput.value = "";
  movieImdbInput.value = "";
  movieRuntimeInput.value = "";
  movieAdultInput.checked = false;
  catSelect.value = "";
  cmsClearSelection(state.allActors);
  if (previewImg) previewImg.src = PLACEHOLDER_IMG;
}

export function openCreateModal() {
  state.currentEditId = null;
  resetForm();
  editModal.show();
}

export function fillEditForm(movie) {
  movieTitleInput.value = movie.title || "";
  movieOverviewInput.value = movie.overview || "";
  movieCoverInput.value = movie.cover_url || "";
  movieTrailerInput.value = movie.fragman || "";
  movieWatchInput.value = movie.watch_url || "";
  movieImdbInput.value = movie.imdb || "";
  movieRuntimeInput.value = movie.run_time_min || "";
  movieAdultInput.checked = movie.adult || false;
  catSelect.value = movie.category?.id || "";

  cmsClearSelection(state.allActors);
  if (movie.actors?.length) {
    movie.actors.forEach((a) => selectedActorIds.add(a.id));
    cmsRenderTags(state.allActors);
    cmsUpdateListSelection();
  }

  const isValid = movie.cover_url?.startsWith("http");
  if (previewImg) previewImg.src = isValid ? movie.cover_url : PLACEHOLDER_IMG;
}

export function showDeleteModal(movieId, movieTitle) {
  state.currentEditId = movieId;
  if (deleteItemName) deleteItemName.textContent = movieTitle;
  deleteModal.showModal();
}

export function getFormData() {
  return {
    title: movieTitleInput.value.trim(),
    overview: movieOverviewInput.value.trim(),
    cover_url: movieCoverInput.value.trim(),
    fragman: movieTrailerInput.value.trim(),
    watch_url: movieWatchInput.value.trim(),
    imdb: movieImdbInput.value.trim(),
    run_time_min: parseInt(movieRuntimeInput.value) || 0,
    adult: movieAdultInput.checked,
    category: parseInt(catSelect.value),
    actors: Array.from(selectedActorIds),
  };
}

export {
  editModalElement,
  deleteModal,
  movieCoverInput,
  previewImg,
  catSelect,
};
