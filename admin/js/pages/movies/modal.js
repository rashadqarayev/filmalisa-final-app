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
const previewHint = document.getElementById("previewHint");

const PLACEHOLDER_IMG =
  "../../assets/images/film-image-default.png";

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
  if (previewImg) {
    previewImg.src = PLACEHOLDER_IMG;
    previewImg.classList.remove("has-image");
  }
  if (previewHint) previewHint.textContent = "Enter a URL above to see the cover";
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
  if (previewImg) {
    previewImg.src = isValid ? movie.cover_url : PLACEHOLDER_IMG;
    previewImg.classList.toggle("has-image", !!isValid);
  }
  if (previewHint) previewHint.textContent = isValid ? "✓ Cover loaded" : "Enter a URL above to see the cover";
}

export function showDeleteModal(movieId, movieTitle) {
  state.currentEditId = movieId;
  if (deleteItemName) deleteItemName.textContent = movieTitle;
  deleteModal.showModal();
}

function toEmbedUrl(url) {
  if (!url) return "";
  url = url.trim();

  // ── 1. Extract YouTube video ID from ANY known format ─────────────────────
  // Covers: youtube.com/watch?v=, youtu.be/, youtube.com/embed/,
  //         youtube.com/shorts/, youtube.com/v/, m.youtube.com,
  //         music.youtube.com, with or without https://, with extra params
  const ytMatch = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&enablejsapi=1`;
  }

  // ── 2. Already a bare video ID (11 chars, no slashes) ────────────────────
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}?rel=0&modestbranding=1&enablejsapi=1`;
  }

  // ── 3. Non-YouTube URL (Vimeo, direct mp4, etc.) — return as-is ─────────
  return url;
}

export function getFormData() {
  return {
    title: movieTitleInput.value.trim(),
    overview: movieOverviewInput.value.trim(),
    cover_url: movieCoverInput.value.trim(),
    fragman: toEmbedUrl(movieTrailerInput.value),
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