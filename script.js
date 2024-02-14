// Selecting elements from the DOM
const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const tryAgainBtn = document.querySelector(".content button");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");

// Initializing variables
let timer; // Timer for tracking time
let maxTime = 60; // Maximum time allowed for typing in seconds
let timeLeft = maxTime; // Time left for typing
let charIndex = 0; // Index of the current character being typed
let mistakes = 0; // Number of mistakes made
let isTyping = false; // Flag to track whether typing is in progress

// Function to load a random paragraph for typing
function loadParagraph() {
    // Selecting a random paragraph from the predefined list
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    // Clearing the typing text area
    typingText.innerHTML = "";
    // Splitting the selected paragraph into characters and adding them as spans to the typing text area
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    // Adding the 'active' class to the first character span
    typingText.querySelectorAll("span")[0].classList.add("active");
    // Focusing on the input field when any key is pressed or when the typing text area is clicked
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

// Function to handle typing initialization
function initTyping() {
    // Selecting all the character spans
    let characters = typingText.querySelectorAll("span");
    // Getting the character typed by the user at the current index
    let typedChar = inpField.value.charAt(charIndex);
    // Checking if there are characters left to type and time is remaining
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        // Starting the timer if it's not already running
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        // Handling the case when a character is typed incorrectly or not typed
        if (typedChar === null) {
            if (charIndex > 0) {
                charIndex--;
                // Adjusting mistakes count and removing incorrect styling if applicable
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            // Handling the case when a character is typed correctly or incorrectly
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        // Removing the 'active' class from all characters and adding it to the current one
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        // Calculating and updating words per minute (WPM), mistakes count, and characters per minute (CPM)
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        // Stopping the timer and resetting the input field when typing is completed
        clearInterval(timer);
        inpField.value = "";
        // Showing the result in a popup
        showResult();
    }
}

// Function to handle the timer for typing
function initTimer() {
    if (timeLeft > 0) {
        // Decrementing the time left every second
        timeLeft--;
        timeTag.innerText = timeLeft;
        // Calculating and updating WPM based on characters typed and time elapsed
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        // Stopping the timer when time is up
        clearInterval(timer);
    }
}

// Function to reset the game
function resetGame() {
    // Loading a new random paragraph and resetting all variables
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

// Function to show the result in a popup
function showResult() {
    // Calculating accuracy and formatting the result message
    let accuracy = ((charIndex - mistakes) / charIndex) * 100;
    let resultMessage = `WPM: ${wpmTag.innerText}\nAccuracy: ${accuracy.toFixed(2)}%\nMistakes: ${mistakes}`;
    // Displaying the result message in a popup
    alert(resultMessage);
}

// Initial loading of a paragraph and event listeners for input and try again button
loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
