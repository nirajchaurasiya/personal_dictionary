document.addEventListener("DOMContentLoaded", () => {
  const dictionaryForm = document.getElementById("dictionaryForm");
  const wordInput = document.getElementById("wordInput");
  const meaningInput = document.getElementById("meaningInput");
  const wordTableBody = document.getElementById("wordTableBody");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const loader = document.getElementById("loader");

  // Add word form submit event
  dictionaryForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission

    const word = wordInput.value;
    const meaning = meaningInput.value;

    // Make a request to the server to store the word
    if (prompt("Enter the password to verify.") === "1234567890") {
      fetch("/addWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word, meaning }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Clear input fields
            wordInput.value = "";
            meaningInput.value = "";

            // Reload the word list
            loadWords();
          }
        });
    } else {
      alert("Invalid Password");
    }
  });

  // Search form submit event
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission

    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
      // Clear the search results if the search term is empty
      wordTableBody.innerHTML = "";
    } else {
      // Make a request to the server to search for words
      fetch(`/search?term=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            displayWords(data.words);
          }
        });
    }
  });

  // Load words on page load
  loadWords();

  // Function to load all words
  function loadWords() {
    // Show the loader
    loader.style.display = "block";

    // Make a request to the server to fetch all words
    fetch("/words")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          displayWords(data.words);
        }
        // Hide the loader
        loader.style.display = "none";
      });
  }

  // Function to display words in the table
  function displayWords(words) {
    wordTableBody.innerHTML = "";

    if (words.length === 0) {
      const noWordsRow = document.createElement("tr");
      const noWordsCell = document.createElement("td");
      noWordsCell.setAttribute("colspan", "3");
      noWordsCell.textContent = "No words found";
      noWordsRow.appendChild(noWordsCell);
      wordTableBody.appendChild(noWordsRow);
    } else {
      words.forEach((word) => {
        const row = document.createElement("tr");
        const wordCell = document.createElement("td");
        const meaningCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const editButton = document.createElement("button");
        const editIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        const editPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const deleteButton = document.createElement("button");
        wordCell.textContent = word.word;
        meaningCell.textContent = word.meaning;
        meaningCell.classList.add("overflow_td");

        editIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        editIcon.setAttribute("width", "16");
        editIcon.setAttribute("height", "16");
        editIcon.setAttribute("viewBox", "0 0 24 24");
        editPath.setAttribute(
          "d",
          "M16.5 4.5l3.5 3.5L7 21H3v-4L16.5 4.5zm1 1L9 19.25 5.75 16 17.5 4.5l.75.75z"
        );
        editIcon.appendChild(editPath);

        editButton.appendChild(editIcon);
        editButton.classList.add("btn", "btn-primary", "btn-sm", "mr-1");
        editButton.addEventListener("click", () => {
          editMeaning(word._id, word.meaning);
        });

        deleteButton.textContent = "X";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.addEventListener("click", () => {
          deleteWord(word._id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(wordCell);
        row.appendChild(meaningCell);
        row.appendChild(actionCell);
        wordTableBody.appendChild(row);
      });
    }
  }

  // Function to delete a word
  function deleteWord(wordId) {
    if (prompt("Enter the password to verify.") === "1234567890") {
      // Make a request to the server to delete the word
      fetch(`/deleteWord/${wordId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Reload the word list
            loadWords();
          }
        });
    } else {
      alert("Invalid Password.");
    }
  }

  // ...

  // Function to edit the meaning of a word
  function editMeaning(wordId, currentMeaning) {
    if (prompt("Enter the password to verify.") === "1234567890") {
      const newMeaning = prompt("Enter the new meaning:", currentMeaning);

      if (newMeaning !== null) {
        // Make a request to the server to update the meaning of the word
        fetch(`/updateWord/${wordId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meaning: newMeaning }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Reload the word list
              loadWords();
            }
          });
      }
    } else {
      alert("Invalid Password.");
    }
  }

  // Attach event listener to the table body for handling edit button clicks
  wordTableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("edit-button")) {
      const wordId = target.getAttribute("data-id");
      const currentMeaning = target.getAttribute("data-meaning");
      editMeaning(wordId, currentMeaning);
    }
  });

  // ...
});
