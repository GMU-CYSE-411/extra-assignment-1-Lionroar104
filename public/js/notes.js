function createNoteCard(note) {
  const a = document.createElement("article");
  a.className = "note-card";

  const t = document.createElement("h3");
  t.textContent = note.title;

  const m = document.createElement("p");
  m.className = "note-meta";
  m.textContent = `Owner: ${note.ownerUsername} | ID: ${note.id} | Pinned: ${note.pinned}`;

  const b = document.createElement("div");
  b.className = "note-body";
  b.textContent = note.body;

  a.appendChild(t);
  a.appendChild(m);
  a.appendChild(b);

  return a;
}

  

async function loadNotes(ownerId, search) {
  const query = new URLSearchParams();

  if (ownerId) {
    query.set("ownerId", ownerId);
  }

  if (search) {
    query.set("search", search);
  }

  const result = await api(`/api/notes?${query.toString()}`);
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = result.notes.map(noteCard).join("");
}

(async function bootstrapNotes() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("notes-list").textContent = "Please log in first.";
      return;
    }

    document.getElementById("notes-owner-id").value = user.id;
    document.getElementById("create-owner-id").value = user.id;
    await loadNotes(user.id, "");
  } catch (error) {
    document.getElementById("notes-list").textContent = error.message;
  }
})();

document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  await loadNotes(formData.get("ownerId"), formData.get("search"));
});

document.getElementById("create-note-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = {
    ownerId: formData.get("ownerId"),
    title: formData.get("title"),
    body: formData.get("body"),
    pinned: formData.get("pinned") === "on"
  };

  await api("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  await loadNotes(payload.ownerId, "");
  event.currentTarget.reset();
  document.getElementById("create-owner-id").value = payload.ownerId;
});
