# ChessGame

A real-time, multiplayer chess game built with Node.js, Express, and Socket.IO. This project allows two players to play chess interactively in their browsers, with a third (or more) able to join as spectators. The game features a draggable UI chessboard, turn-based play enforcement, and automatic board updates for all connected users.

## Features

- **Real-time Multiplayer**: Two users can play chess against each other live. Additional users can join as spectators.
- **Drag & Drop UI**: Chess pieces can be moved using drag-and-drop functionality.
- **Turn Enforcement**: Only the player whose turn it is may move their pieces.
- **Automatic Board Updates**: All player and spectator views are updated instantly after each move.
- **Invalid Move Handling**: Illegal moves are rejected with automatic board correction.
- **Responsive Chessboard**: The board visually flips for black, and pieces are rendered with Unicode symbols.
- **Spectator Mode**: Extra users can watch games live without interfering.

## Demo

![ChessGame UI](https://github.com/MaahiAgarwal/ChessGame/blob/main/DemoVideo.mp4) <!-- Add a screenshot of the main UI if available -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/MaahiAgarwal/ChessGame.git
   cd ChessGame
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

### Running the App

Start the development server:

```sh
node app.js
```

By default, the server runs on [http://localhost:3000](http://localhost:3000).

Open this URL in your browser. Open it in a second tab or a different device to play as both white and black, or to spectate.

## Project Structure

```
ChessGame/
├── app.js                # Main server application
├── public/
│   └── js/
│       └── chessgame.js  # Frontend client logic for the chessboard
├── views/
│   └── index.ejs         # Main HTML template using EJS
└── package.json
```

## Technologies Used

- **Node.js** & **Express**: Backend server
- **Socket.IO**: Real-time, bidirectional communication
- **chess.js**: Chess rules and game state management
- **EJS**: Templating for HTML rendering
- **Tailwind CSS** (via CDN): Styling

## How It Works

- The server assigns player roles (white, black, or spectator) as users connect.
- Moves are validated and processed on the server using chess.js, then broadcast to all clients.
- The frontend provides an interactive chessboard with drag-and-drop for piece movement, and visually enforces turn order.

## Customization & Contributing

Feel free to fork the repo and submit pull requests!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

---

