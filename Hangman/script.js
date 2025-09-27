document.addEventListener("DOMContentLoaded", async () => {
  
    let theWord, hint, extraHint;
    let extraHintUsed = false;
    
    const suggestWordButton = document.getElementById("suggest_word_button");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarButton = document.getElementById("close_sidebar");
    
    // Toggle sidebar visibility on button click
    suggestWordButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default action
        suggestWordButton.style.display="none";
        sidebar.classList.toggle("visible"); // Toggle the 'visible' class to show/hide sidebar
        sidebar.classList.remove("hidden"); // Ensure the sidebar is not hidden
    });
    
    // Close sidebar when the close button is clicked
    closeSidebarButton.addEventListener("click", () => {
        
        sidebar.classList.remove("visible"); // Hide sidebar
        sidebar.classList.add("hidden"); // Optionally, add 'hidden' class back to hide it completely
        suggestWordButton.style.display="flex";
    });
    
    // Close sidebar when clicking outside of it
    document.addEventListener("click", (event) => {
        // Check if sidebar is visible and the click is outside of it and the suggest word button
        if (sidebar.classList.contains("visible") && !sidebar.contains(event.target) && !suggestWordButton.contains(event.target)) {
            sidebar.classList.remove("visible"); // Hide sidebar
            sidebar.classList.add("hidden"); // Optionally, add 'hidden' class back to hide it completely
            suggestWordButton.style.display="flex";
        }
    });
    
    // Prevent clicks inside the sidebar from closing it
    sidebar.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to the document
    });

    suggestWordButton.addEventListener('mouseenter', () => {
        suggestWordButton.textContent = 'Suggest a new word ';
    });
    
    suggestWordButton.addEventListener('mouseleave', () => {
        suggestWordButton.textContent = '+';
    });
    
    const suggestWordForm = document.getElementById("suggest_word_form");


    // Event listener for form submission
    suggestWordForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get values from the form
        const word = document.getElementById("new_word").value;
        const hint = document.getElementById("hint").value;
        const extraHint = document.getElementById("extra_hint").value;
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable the submit button
      
        // Create an object to send to the server
        const newWordData = {
            word,
            hint,
            extraHint
        };

        try {
            // Send data to the server using POST request
            const response = await fetch('/api/words', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newWordData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Handle success response
                alert('Word suggested successfully!'); // Alert the user
                suggestWordForm.reset(); // Reset the form
                closeSidebarButton.click();
            } else {
                const error = await response.json();
                console.error(error.message); // Handle error response
                alert('Failed to suggest word: ' + error.message); // Alert the user
            }
        } catch (error) {
            console.error('Error:', error); // Log any network errors
            alert('An error occurred while suggesting the word.');
        }finally {
            submitButton.disabled = false; // Re-enable the button
           
        }
        
       

    });

    // Fetch a random word from your API
    async function fetchRandomWord() {
    const response = await fetch('/api/word');
        const data = await response.json();
        theWord = data.word.toUpperCase();
        hint = data.hint;
        extraHint = data.extraHint;

        // Display the hint in the HTML div
        document.getElementById("hint_display").innerHTML = `Hint: ${hint}`;
        displayWord(); // Start displaying the word after fetching
    }

    // Variables for game logic
    let space = "_",
        hiddenWord = "",
        count = 0,
        fail = 0,
        hiddenWordSplit = [],
        theWordSplit = [];

    const wordDisplayed = document.getElementById("word_display"),
        keyboardDisplay = document.getElementById("keybord"),
        resultDisplay = document.getElementById("result_display"),
        newGameButton = document.querySelector(".new_game"),
        extraHintButton = document.getElementById("extra_hint_button"),
        hintDisplay = document.getElementById("hint_display"),
        extraHintDisplay = document.getElementById("extra_hint_display"),
        startGameButton = document.getElementById("start_game_button");
        skipButton = document.getElementById("skip_button");
        bgRes = document.getElementById("bg_res");

    // Hide hangman parts initially
    const hangmanParts = document.querySelectorAll(".deadguy, .deadguy > div");
    hangmanParts.forEach(part => part.style.visibility = "hidden");

    // Initially hide hint and extra hint button
    hintDisplay.style.display = "none";
    extraHintButton.style.display = "none";
    skipButton.style.display = "none";
    extraHintDisplay.style.display = "none";
    keyboardDisplay.style.display = "none"; // Hide keyboard initially
    bgRes.style.display = "none"; // Hide bg_res initially

    // Start fetching random word only after clicking the start button
    startGameButton.addEventListener("click", () => {
        resetGame();
        fetchRandomWord(); // Fetch a new word for the game
        hintDisplay.style.display = "block"; // Show hint display
        extraHintButton.style.display = "inline"; // Show extra hint button
        skipButton.style.display = "inline";
        startGameButton.style.display = "none"; // Hide the start game button
        keyboardDisplay.style.display = "block";
        bgRes.style.display = "block";
    });

    // Reset game state
    function resetGame() {
        fail = 0;
        count = 0;
        hiddenWordSplit = [];
        wordDisplayed.innerHTML = "";
        resultDisplay.innerHTML = "";
        resultDisplay.style.backgroundColor = ''; 
        resultDisplay.style.border='';
        keyboardDisplay.style.display = "block"; // Show keyboard
        hangmanParts.forEach(part => part.style.visibility = "hidden"); // Hide hangman parts
        
        extraHintButton.style.display = "none"; // Hide extra hint button initially
        extraHintDisplay.style.display = "none"; // Hide extra hint display initially
        newGameButton.style.display = "none"; // Hide new game button initially
    
      
        extraHintButton.classList.remove("disabled-button");
    }

    // Display the same number of "_" space as the stocked word
    function displayWord() {
        theWordSplit = theWord.split("");
     
        hiddenWord = space.repeat(theWord.length);
        hiddenWordSplit = hiddenWord.split("");

        for (let i = 0; i < theWordSplit.length; i++) {
            if (theWordSplit[i] === " ") {
                hiddenWordSplit[i] = "&nbsp;";
                count++;
            }
        }
        wordDisplayed.innerHTML = hiddenWordSplit.join(" ");
        const wordLength = theWord.length;
    const charWidth = 40; // Approximate width of each character in pixels
    const totalWidth = wordLength * charWidth; // Total width based on word length
    bgRes.style.width = `${totalWidth}px`; // Set the width dynamically
        setupKeyboard();
    }

    // Set up the QWERTY keyboard
    function setupKeyboard() {
        const alphabet = "qwertyuiopasdfghjklzxcvbnm";
        const alphabetArray = alphabet.toUpperCase().split("");
        
        const keyboardDisplay = document.getElementById("keybord");
        keyboardDisplay.innerHTML = ""; // Clear previous keyboard
    
        // Create rows for the keyboard
        const rows = [
            document.createElement("div"), // First row
            document.createElement("div"), // Second row
            document.createElement("div")  // Third row
        ];
        
        // Add classes to rows for styling
        rows[0].className = "row-1";
        rows[1].className = "row-2";
        rows[2].className = "row-3";
    
        alphabetArray.forEach((char, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "letter";
            button.textContent = char;
            
            // Add click event for each button
            button.addEventListener("click", pressedKey); 
            
            // Append button to the appropriate row
            if (index < 10) {
                rows[0].appendChild(button); // First row (10 buttons)
            } else if (index < 19) {
                rows[1].appendChild(button); // Second row (9 buttons)
            } else {
                rows[2].appendChild(button); // Third row (3 buttons)
            }
        });
    
        // Append rows to the keyboard display
        rows.forEach(row => keyboardDisplay.appendChild(row));
    }
    

    // Collect user's letter choice
    function pressedKey() {
        const letter = this.innerHTML;
        this.setAttribute("disabled", "");


        if (theWordSplit.indexOf(letter) === -1) {
            // Incorrect guess: apply the incorrect-button class
            this.classList.add("incorrect-button");
        } else {
            // Correct guess: apply the correct-button class
            this.classList.add("correct-button");
        }
        checkMatch(letter);
    }

    // Check the letter
    function checkMatch(letter) {
        if (theWordSplit.indexOf(letter) === -1) {
            fail++;
            drawHangman();
            if (fail === 6) {
               
                endGame();
            }
        } else {
            // Update the displayed word
            for (let i = 0; i < theWord.length; i++) {
                if (theWordSplit[i] === letter) {
                    hiddenWordSplit[i] = letter;
                   
                    
                    count++;
                }
            }
        }
        wordDisplayed.innerHTML = hiddenWordSplit.join(" ");
        if (count === theWord.length) {
            const score=6-fail;
            skipButton.style.display = "none";
            extraHintButton.style.display = "none"; 
            
            resultDisplay.style.backgroundColor = 'black'; 
            resultDisplay.style.border='7px solid ';
            resultDisplay.style.borderImage = 'linear-gradient(to right, #8be4f2, #1eff00) 1';

            
            // Modify the innerHTML to separate the text and apply animation only to the text
            resultDisplay.innerHTML = `<span style='color: #1eff00; display: inline-block; font-size: 50px;' class='popup-text'>You won! Score: ${score}</span>`;
            
            // Add the 'show-popup' class to the text for the animation effect
            const popupText = resultDisplay.querySelector('.popup-text');
            popupText.classList.add('show-popup');
            
            // Remove the animation class after 2 seconds
            setTimeout(() => {
                popupText.classList.remove('show-popup');
            }, 2000);
            endGame();
    }}
    skipButton.addEventListener("click", () => {
        newGameButton.click(); // Trigger the new game button click
    });
    
    // Display extra hint in HTML div on button click
    extraHintButton.addEventListener("click", () => {
        if (!extraHintUsed) { // Check if the extra hint has already been used
            extraHintUsed = true; // Set to true, indicating the hint has been used
            fail++; // Count the hint as a fail
            drawHangman(); // Update the hangman display
            extraHintDisplay.innerHTML = `Extra Hint: ${extraHint}`;
            extraHintDisplay.style.display = "block"; // Show extra hint display
            extraHintButton.classList.add("disabled-button");
            if (fail === 6) {
                endGame();}
        }
        
    });

    // Draw the hangman if wrong letter
    function drawHangman() {
        if (fail <= hangmanParts.length) {
            hangmanParts[fail - 1].style.visibility = "visible";
        }
    }

    // End the game
    function endGame() {
        if (count != theWord.length){
            skipButton.style.display = "none";
            extraHintButton.style.display = "none"; 
            
        document.getElementById('heading').classList.add('sad-animation');
       
        resultDisplay.innerHTML = "<span style='color: red; font-size: 70px;'>Game over!</span>";

        resultDisplay.style.marginBottom='20px';
        resultDisplay.classList.add('show-game-over');
        // Optionally, you can remove the class after some time
        setTimeout(() => {
            resultDisplay.classList.remove('show-game-over');
        }, 5000); // Duration should match the animation duration
        
        }
        
        keyboardDisplay.style.display = "none";
        
        newGameButton.style.display = "inline"; // Show the new game button
        const letters = document.querySelectorAll(".letter");
        letters.forEach((letter) => letter.removeEventListener("click", pressedKey));
        startGameButton.style.display = "none"; // Hide the start game button at the end of the game
    
    
        // Replace underscores with actual letters for unguessed indices
        for (let i = 0; i < theWordSplit.length; i++) {
            if (hiddenWordSplit[i] === space || hiddenWordSplit[i] === "&nbsp;") {
                hiddenWordSplit[i] = `<span id="revealed-letter">${theWordSplit[i]}</span>`;
            }
        }
     // Update the displayed word to reveal all letters
     wordDisplayed.innerHTML = hiddenWordSplit.join(" ");
    
    }
    
    

    // Start a new game
    newGameButton.addEventListener("click", () => {
        document.getElementById('heading').classList.remove('sad-animation');
       
        resetGame();
        

        extraHintUsed = false;
        startGameButton.click();
    });
});
