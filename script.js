const monthYear = document.getElementById("monthYear");
const datesContainer = document.getElementById("dates");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const notePopup = document.getElementById("notePopup");
const noteInput = document.getElementById("noteInput");
const saveNote = document.getElementById("saveNote");
const closeNote = document.getElementById("closeNote");
const clearAllNotes = document.getElementById("clearAllNotes");

let currentDate = new Date();
let selectedDate = "";

/* load saved notes */
let notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};

function renderCalendar(){

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  datesContainer.innerHTML = "";

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  monthYear.innerText = monthNames[month] + " " + year;

  /* empty boxes before first day */
  for(let i = 0; i < firstDay; i++){
    const empty = document.createElement("div");
    datesContainer.appendChild(empty);
  }

  /* create days */
  for(let day = 1; day <= lastDate; day++){

    const dayBox = document.createElement("div");
    dayBox.innerText = day;

    const dateKey = `${year}-${month}-${day}`;

    const today = new Date();

if(
  day === today.getDate() &&
  month === today.getMonth() &&
  year === today.getFullYear()
){
  dayBox.classList.add("today");
}

    /* mark days with notes */
    if(notes[dateKey]){
      dayBox.classList.add("has-note");
    }

    /* click date → open popup */
    dayBox.addEventListener("click", () => {

      selectedDate = dateKey;

      noteInput.value = notes[dateKey] || "";

      notePopup.style.display = "flex";

    });

    datesContainer.appendChild(dayBox);

  }

}

/* save note */
saveNote.addEventListener("click", () => {

  if(noteInput.value.trim() === ""){
    delete notes[selectedDate];
  } else {
    notes[selectedDate] = noteInput.value;
  }

  localStorage.setItem("calendarNotes", JSON.stringify(notes));

  notePopup.style.display = "none";

  renderCalendar();

});

/* close popup */
closeNote.addEventListener("click", () => {
  notePopup.style.display = "none";
});

/* escape key closes popup */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    notePopup.style.display = "none";
  }
});

/* clear all saved notes with a aleart */
clearAllNotes.addEventListener("click", () => {
  if (Object.keys(notes).length === 0) {
    alert("No notes found to clear.");
    return;
  }
  if (confirm("Delete all saved notes?")) {
    notes = {};
    localStorage.removeItem("calendarNotes");
    renderCalendar();
    alert("All notes cleared.");
  }
});

/* previous month */
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

/* next month */
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

/* initial render */
renderCalendar();