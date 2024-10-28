# Import necessary modules from Flask
from flask import Flask, request, render_template, jsonify, session
# Import the Boggle class from the boggle module, which handles game logic
from boggle import Boggle

# Create a new Flask app instance
app = Flask(__name__)

# Set the secret key for the Flask session, used to securely sign the session cookie
app.config["SECRET_KEY"] = "superDuper$ecret"

# Create an instance of the Boggle game, which will be used to generate the board and check words
boggle_game = Boggle()


@app.route("/")
def homepage():
    """Show the game board on the homepage."""

    # Create a new board using the Boggle game instance
    board = boggle_game.make_board()

    # Store the generated board in the session, so it can be accessed during the game
    session['board'] = board

    # Get the current high score from the session, or default to 0 if not set
    highscore = session.get("highscore", 0)

    # Get the number of plays from the session, or default to 0 if not set
    numplays = session.get("numplays", 0)

    # Render the 'index.html' template and pass the board, high score, and number of plays to it
    return render_template("index.html", board=board,
                           highscore=highscore,
                           numplays=numplays)


@app.route("/check-word")
def check_word():
    """Check if the submitted word is valid on the board and in the dictionary."""

    # Get the word to check from the query string (URL parameters)
    word = request.args["word"]

    # Get the current board from the session (which was generated earlier and stored)
    board = session["board"]

    # Check if the word is valid on the board and in the dictionary using the Boggle game logic
    response = boggle_game.check_valid_word(board, word)

    # Return the result of the word check as a JSON response (to be handled by the front-end)
    return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive the player's score and update the high score and number of plays in the session."""

    # Get the score from the JSON data sent in the POST request
    score = request.json["score"]

    # Get the current high score from the session, or default to 0 if not set
    highscore = session.get("highscore", 0)

    # Get the current number of plays from the session, or default to 0 if not set
    numplays = session.get("numplays", 0)

    # Update the session's number of plays by incrementing it by 1
    session['numplays'] = numplays + 1

    # Update the high score in the session if the current score is higher than the previous high score
    session['highscore'] = max(score, highscore)

    # Return a JSON response indicating whether the current score broke the high score record
    return jsonify(brokeRecord=score > highscore)
