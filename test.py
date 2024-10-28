# Import the necessary libraries for testing.
from unittest import TestCase  # TestCase is a base class for writing unit tests in Python.
from app import app  # Import the Flask app that is being tested.
from flask import session  # Import session from Flask, which allows you to access session data.
from boggle import Boggle  # Import the Boggle class, which is part of the game logic.

# Define a test class for the Flask application, inheriting from TestCase.
class FlaskTests(TestCase):

    # The setUp method runs before every individual test. 
    # It prepares things that will be needed in all tests.
    def setUp(self):
        """Stuff to do before every test."""

        # Create a test client that simulates requests to the Flask app.
        # The test client allows you to make GET/POST requests and inspect the responses.
        self.client = app.test_client()

        # Set the Flask app's config to 'TESTING' mode.
        # This disables error catching and allows for better error reporting during tests.
        app.config['TESTING'] = True

    # This is a test method that will check if the homepage works as expected.
    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        # Use the test client to make a GET request to the homepage ('/').
        with self.client:
            response = self.client.get('/')

            # Check if the 'board' key exists in the session.
            self.assertIn('board', session)

            # Ensure that 'highscore' is None when starting the game (i.e., no high score yet).
            self.assertIsNone(session.get('highscore'))

            # Ensure that 'numplays' is None when starting the game (i.e., no plays yet).
            self.assertIsNone(session.get('numplays'))

            # Check if the phrase 'High Score:' appears in the response data (i.e., the HTML).
            self.assertIn(b'High Score:', response.data)

            # Check if the word 'Score:' is displayed in the HTML.
            self.assertIn(b'Score:', response.data)

            # Check if 'Seconds Left:' is shown in the HTML.
            self.assertIn(b'Seconds Left:', response.data)

    # Test for valid words by simulating a board and checking if the word 'cat' is found.
    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""

        # Use the test client to simulate a session and make modifications to it.
        with self.client as client:
            with client.session_transaction() as sess:
                # Modify the board in the session to be a specific configuration.
                # This is a 5x5 board where 'C', 'A', and 'T' appear in the first three columns of each row.
                sess['board'] = [["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"]]
        
        # After setting up the session, make a GET request to check if the word 'cat' is valid.
        # The '/check-word' route is used to validate the word, with 'cat' as the query parameter.
        response = self.client.get('/check-word?word=cat')

        # Assert that the response JSON contains 'result' as 'ok', meaning 'cat' is a valid word on the board.
        self.assertEqual(response.json['result'], 'ok')

    # Test for invalid words, checking if a word not present on the board is correctly flagged.
    def test_invalid_word(self):
        """Test if word is in the dictionary"""

        # First, load the homepage to set up the session and board.
        self.client.get('/')

        # Make a GET request to check if the word 'impossible' is valid.
        # 'impossible' should not be on the board.
        response = self.client.get('/check-word?word=impossible')

        # Assert that the response JSON contains 'result' as 'not-on-board', meaning the word doesn't exist on the board.
        self.assertEqual(response.json['result'], 'not-on-board')

    # Test for non-English words to see if they are flagged correctly.
    def non_english_word(self):
        """Test if word is on the board"""

        # Load the homepage to set up the session and board.
        self.client.get('/')

        # Make a GET request to check if a random string of letters ('fsjdakfkldsfjdslkfjdlksf') is a valid word.
        # This string should not be a valid English word.
        response = self.client.get('/check-word?word=fsjdakfkldsfjdslkfjdlksf')

        # Assert that the response JSON contains 'result' as 'not-word', meaning it's not an actual word.
        self.assertEqual(response.json['result'], 'not-word')
