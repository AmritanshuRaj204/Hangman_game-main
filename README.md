# Hangman Game

Welcome to the Hangman Game! This is a fun and interactive web-based version of the classic word-guessing game. The goal is to guess the hidden word one letter at a time before running out of attempts.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
-  [Screenshots and Demo](#screenshots-and-demo)

## Features

- Random word selection from a predefined list.
- User-friendly interface with an interactive keyboard.
- Display of hints for better guessing.
- Extra hint option available.
- Keep track of attempts and display the hangman graphic.
- Option to suggest new words for the game.

## Installation

To get a local copy of this project up and running, follow these simple steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/hangman-game.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd hangman-game/Hangman/hangman-api
   ```

3. **Install dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

4. **Run the server:**
   Start the server with the following command:
   ```bash
   node server.js
   ```

5. **Open the game in your web browser:**
   Visit `http://localhost:3000` to play the game.

## Usage

1. Click on the letters on the keyboard to guess the hidden word.
2. Use the hints provided to assist your guesses.
3. If you want to suggest a new word, fill out the form in the sidebar and submit it.
4. Keep an eye on the hangman graphic; you have a limited number of incorrect guesses!

## Game Rules

- You start with a certain number of attempts.
- Each time you guess a letter that is not in the word, you lose an attempt.
- If you guess all the letters in the word before running out of attempts, you win!
- If the hangman is completed before you guess the word, you lose.


## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 engine, enabling server-side development.
- **Express.js**: A minimal and flexible Node.js web application framework, providing robust features for web and mobile applications.
- **JavaScript**: The primary programming language for both the frontend and backend, enhancing interactivity and functionality.
- **JSON**: A lightweight data interchange format used to store and transfer words and hints.
- **HTML/CSS**: Markup and styling languages used to create and design the user interface of the Hangman game.

## Custom API

The Hangman game features a custom API that allows users to:

- **Retrieve a random word** from a predefined list, along with its corresponding hints.
- **Submit new words** to the game by providing a word, hint, and optional extra hint, which are then stored in a JSON file.

This API enhances the gameplay experience by allowing users to contribute new words and hints to the game, making it more engaging and diverse.

## Screenshots and Demo
   ### main interface ###

https://github.com/user-attachments/assets/5d264050-fa0a-491d-a6a8-866b139f1f9f

   

https://github.com/user-attachments/assets/81ca2ba5-a060-485e-9793-04874d4efe01

   ### adding new words ###


## Contributing

Contributions are welcome! If you have suggestions for improvements or want to report issues, please feel free to open an issue or a pull request.

## License

This project is licensed under the MIT License.
