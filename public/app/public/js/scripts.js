window.onload = function() {
  const submitButton = document.getElementById("submit-button");
  submitButton.onclick = addNewNote;

  const cancelButton = document.getElementById("cancel-button");
  cancelButton.onclick = viewNoteTable;

  const updateNoteButton = document.getElementById("update-button");
  updateNoteButton.onclick = updateNote;

  const viewCurrentNotesButton = document.getElementById("view-notes-button");
  viewCurrentNotesButton.onclick = viewNoteTable;

  const loginButton = document.getElementById("login-button");
  loginButton.onclick = login;

  const newNoteLink = document.getElementById("new-note-link");
  newNoteLink.onclick = viewNoteForm;

  const currentNotesLink = document.getElementById("current-notes-link");
  currentNotesLink.onclick = viewNoteTable;
};

const addNewNote = function(e) {
  e.preventDefault();

  const newNote = {
    username: document.getElementById("username").value,
    noteEntry: document.getElementById("noteEntry").value,
    date: document.getElementById("date").value
  };

  const body = JSON.stringify(newNote);
  fetch("/submit", {
    method: "POST",
    body
  }).then(function(response) {
    document.getElementById("note-entered").style.display = "flex";
    document.getElementById("form").style.display = "none";
    resetForm();
  });

  return false;
};

const updateNote = e => {
  e.preventDefault();

  const updatedNote = {
    username: document.getElementById("update-username").value,
    noteEntry: document.getElementById("update-noteEntry").value,
    date: document.getElementById("update-date").value,
    id: parseInt(document.getElementById("update-id").value)
  };

  const body = JSON.stringify(updatedNote);
  fetch("/update", {
    method: "POST",
    body
  }).then(function(response) {
    viewNoteTable();
  });

  return false;
};

const fetchCurrentNotes = async function() {
  const response = await fetch("/notes", { method: "GET" });
  const data = await response.json();
  const notes = data.notes;

  let HTMLDiv = document.getElementById("notes");

  HTMLDiv.innerHTML =
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Note</th>\n" +
    "<th>Date</th>\n" +
    "<th></th>\n" +
    "<th></th>\n" +
    "</tr>";

  for (let i = 0; i < notes.length; i++) {
    const currentNote = notes[i];
    const noteString = JSON.stringify(notes[i]);
    if (
      currentNote.createdBy ===
      document.getElementById("current-username").value
    ) {
      let row = "<tr>\n";
      row += `<td> ${currentNote.username} </td>\n`;
      row += `<td> ${currentNote.noteEntry} </td>\n`;
      row += `<td> ${currentNote.date} </td>\n`;
      row +=
        `<td> <button id="update-button-${i}" class="table-button" style="font-size: 1vw" onclick="viewUpdateForm(${i})" data-string=` +
        encodeURIComponent(noteString) +
        `>Edit</button> </td>\n`;
      row += `<td> <button id="delete-button-${i}" class="table-button" style="font-size: 1vw" onclick="deleteNote(${currentNote.id})">Delete</button> </td>\n`;
      row += "</tr>";
      HTMLDiv.innerHTML += row;
    }
  }

  return false;
};

const deleteNote = function(noteid) {
  const noteNum = { id: noteid };
  const body = JSON.stringify(noteNum);

  fetch("/delete", {
    method: "POST",
    body
  });
  fetchCurrentNotes();
};

const viewNoteTable = function() {
  document.getElementById("table").style.display = "flex";
  document.getElementById("form").style.display = "none";
  document.getElementById("update-form").style.display = "none";
  document.getElementById("note-entered").style.display = "none";

  fetchCurrentNotes();
  return false;
};

const viewNoteForm = function() {
  document.getElementById("table").style.display = "none";
  document.getElementById("form").style.display = "block";
  document.getElementById("update-form").style.display = "none";
  document.getElementById("note-entered").style.display = "none";
  resetForm();
};

const viewUpdateForm = function(num) {
  let note = decodeURIComponent(
    document.getElementById(`update-button-${num}`).dataset.string
  );
  note = JSON.parse(note);

  document.getElementById("table").style.display = "none";
  document.getElementById("update-form").style.display = "block";
  document.getElementById("update-button").dataset.index = num;
  document.getElementById("update-username").value = note.username;
  document.getElementById("update-noteEntry").value = note.noteEntry;
  document.getElementById("update-date").value = note.date;
  document.getElementById("update-id").value = note.id;

  return false;
};

const resetForm = () => {
  document.getElementById("username").value = "";
  document.getElementById("noteEntry").value = "";
  document.getElementById("date").value = "";
};

const login = function(e) {
  e.preventDefault();

  const loginInfo = {
    username: document.getElementById("login-username").value,
    password: document.getElementById("password").value
  };

  const body = JSON.stringify(loginInfo);
  fetch("/login", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(console.log)
    .then(function(response) {
      document.getElementById("new-note-link").style.display = "flex";
      document.getElementById("current-notes-link").style.display = "flex";
      document.getElementById("login").style.display = "none";
      document.getElementById("current-username").value = loginInfo.username;
      viewNoteForm();
    });
};
