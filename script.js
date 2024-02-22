const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Laver en const, hvor filteret starter med at vise alle tasks
const settings = { filter: "all" };

// Eventlistener på knapppen for at tilføje en ny task
document.querySelector("button").addEventListener("click", addTask);

function addTask() {
  // Tjek om inputfeltet er tomt
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    // Opret et nyt listeelement og tilføj det til listen
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);

    // Opret et span til sletknappen og tilføj det til listeelementet
    let span = document.createElement("span");
    // \u00D7 =  Unicode character ×
    span.innerHTML = "\u00D7";
    li.appendChild(span);
  }

  // Ryd inputfeltet
  inputBox.value = "";

  // Gem data og filtrer tasks
  saveData();
  filterTasks();
}

// Eventlistener til håndtering af tasks via enten afkrydsning eller sletning
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      const targetTask = e.target;
      targetTask.classList.toggle("checked");

      // Anvend fade-out animation, når filteret ikke er indstillet til "all"
      if (settings.filter !== "all") {
        if (targetTask.classList.contains("checked")) {
          targetTask.classList.add("fade-out");
          // tilføj fade-out class når tasks er afkrydset
          targetTask.addEventListener("transitionend", function () {
            filterTasks(); // Filtrer tasks efter at overgangen er færdig
          });
        } else {
          targetTask.classList.remove("fade-out"); // Fjern fade-out class, når task ikke er afkrydset
          filterTasks(); // Filtrer tasks efter at overgangen er færdig
        }
      } else {
        filterTasks(); // Filtrer tasks direkte uden at anvende animation (.fade-out)
      }

      // Gem data
      saveData();
    } else if (e.target.tagName === "SPAN") {
      //Fjern det "parent" list item, når sletknappen (×) klikkes på
      e.target.parentElement.remove();
      saveData();
      filterTasks(); // Filtrer tasks direkte efter fjernelse af en task
    }
  },
  false
);

// Filtrer opgaverne direkte efter fjernelse af tasks
const filterSelect = document.getElementById("filter");
filterSelect.addEventListener("change", function (e) {
  settings.filter = e.target.value;
  saveData();
  filterTasks();
});

// Funktion til at filtrere tasks baseret på de nuværende filterindstillinger
function filterTasks() {
  const filter = settings.filter;
  const tasks = listContainer.getElementsByTagName("li");

  // Gennemgå hver task og tjekker hvilket filter de opfylder kravene
  Array.from(tasks).forEach((task) => {
    if (filter === "all") {
      task.style.display = "list-item";
      task.classList.remove("fade-out"); // Fjern fade-out class når filteret er "all"
    } else if (filter === "checked" && task.classList.contains("checked")) {
      task.style.display = "list-item";
      task.classList.remove("fade-out"); // Fjern fade-out class når filteret er "checked"
    } else if (filter === "unchecked" && !task.classList.contains("checked")) {
      task.style.display = "list-item";
      if (task.classList.contains("checked")) {
        task.classList.add("fade-out");
      } else {
        task.classList.remove("fade-out");
      }
    } else {
      task.style.display = "none"; // Skjul task hvis den ikke matcher filteret
    }
  });
}

// Funktion til at gemme dataen i lokal lagring
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Funktion til at vise tasks fra lokal lagring
function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
  filterTasks();
}

showTask(); // Vis opgaver når siden indlæses
