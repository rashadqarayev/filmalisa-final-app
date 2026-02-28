// Custom multi-select for actors inside the movie modal.
// The dropdown is teleported to <body> to escape Bootstrap modal's
// transform stacking context, which would break position:fixed children.

const cmsWrapper = document.getElementById("actorsMultiSelect");
const cmsTrigger = document.getElementById("cmsTrigger");
const cmsTags = document.getElementById("cmsTags");
const cmsDropdown = document.getElementById("cmsDropdown");
const cmsList = document.getElementById("cmsList");

document.body.appendChild(cmsDropdown);

export const selectedActorIds = new Set();

// ── Position ──────────────────────────────────────────────────────────────────
function position() {
  const rect = cmsTrigger.getBoundingClientRect();
  const h = cmsDropdown.offsetHeight || 220;
  cmsDropdown.style.left = rect.left + "px";
  cmsDropdown.style.width = rect.width + "px";
  cmsDropdown.style.top = rect.top - h - 4 + "px";
  cmsDropdown.style.bottom = "";
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function cmsToggle(forceClose = false) {
  const isOpen = cmsDropdown.classList.contains("cms-open");
  if (forceClose || isOpen) {
    cmsDropdown.classList.remove("cms-open");
    cmsWrapper.classList.remove("open");
  } else {
    cmsDropdown.classList.add("cms-open");
    cmsWrapper.classList.add("open");
    position();
    cmsFilterList("");
  }
}

// ── Render tags ───────────────────────────────────────────────────────────────
export function cmsRenderTags(allActors) {
  cmsTags.innerHTML = "";
  if (selectedActorIds.size === 0) {
    cmsTags.innerHTML = '<span class="cms-placeholder">Select Actors</span>';
    return;
  }
  const selectedCount = selectedActorIds.size;
  cmsTags.innerHTML = `<span class="cms-selected-count">✓ ${selectedCount} actors selected</span>`;
}

// ── Update selection state ────────────────────────────────────────────────────
export function cmsUpdateListSelection() {
  cmsList.querySelectorAll(".cms-option").forEach((li) => {
    li.classList.toggle(
      "selected",
      selectedActorIds.has(parseInt(li.dataset.id))
    );
  });
}

// ── Filter ────────────────────────────────────────────────────────────────────
export function cmsFilterList(query) {
  const q = query.toLowerCase();
  let visible = 0;
  cmsList.querySelectorAll(".cms-option").forEach((li) => {
    const show = li.textContent.toLowerCase().includes(q);
    li.style.display = show ? "" : "none";
    if (show) visible++;
  });
  let noResult = cmsList.querySelector(".cms-no-results");
  if (visible === 0) {
    if (!noResult) {
      noResult = document.createElement("li");
      noResult.className = "cms-no-results";
      noResult.textContent = "No actors found";
      cmsList.appendChild(noResult);
    }
    noResult.style.display = "";
  } else if (noResult) {
    noResult.style.display = "none";
  }
}

// ── Build list ────────────────────────────────────────────────────────────────
export function cmsBuildList(allActors) {
  cmsList.innerHTML = "";
  allActors.forEach((actor) => {
    const li = document.createElement("li");
    li.className = "cms-option";
    li.dataset.id = actor.id;
    li.textContent = `${actor.name} ${actor.surname}`;
    if (selectedActorIds.has(actor.id)) li.classList.add("selected");
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(li.dataset.id);
      selectedActorIds[selectedActorIds.has(id) ? "delete" : "add"](id);
      li.classList.toggle("selected", selectedActorIds.has(id));
      // tags are re-rendered by caller via allActors reference
      cmsRenderTags(allActors);
    });
    cmsList.appendChild(li);
  });
}

// ── Clear ─────────────────────────────────────────────────────────────────────
export function cmsClearSelection(allActors) {
  selectedActorIds.clear();
  cmsRenderTags(allActors);
  cmsUpdateListSelection();
}

// ── Events ────────────────────────────────────────────────────────────────────
export function initCmsEvents(allActorsRef) {
  cmsTrigger.addEventListener("click", () => {
    cmsToggle();
  });

  document.addEventListener("click", (e) => {
    if (!cmsWrapper.contains(e.target) && !cmsDropdown.contains(e.target)) {
      cmsToggle(true);
    }
  });

  window.addEventListener("resize", () => {
    if (cmsWrapper.classList.contains("open")) position();
  });

  document.addEventListener(
    "scroll",
    () => {
      if (cmsWrapper.classList.contains("open")) position();
    },
    true
  );
}
