from textblob import TextBlob

def analyze_sentiment(lyrics):
    """
    Analyzes the sentiment of the given lyrics using TextBlob.

    Args:
    - lyrics (str): The lyrics to be analyzed.

    Returns:
    - sentiment (str): The sentiment of the lyrics ('positive', 'neutral', or 'negative').
    """
    # Create a TextBlob object
    blob = TextBlob(lyrics)

    # Get the sentiment polarity
    sentiment_polarity = blob.sentiment.polarity

    # Classify sentiment based on polarity
    if sentiment_polarity > 0:
        sentiment = 'positive'
    elif sentiment_polarity == 0:
        sentiment = 'neutral'
    else:
        sentiment = 'negative'

    return sentiment

# Example usage
lyrics = """
I'm that flight that you get on, international
First-class seat, on my lap, girl, riding comfortable (Oh, yeah)
Ha, 'cause I know what the girl them need, New York to Haiti
I got lipstick stamps on my passport, you make it hard to leave

Been around the world, don't speak the language (Uh-huh)
But your booty don't need explaining (Uh-huh)
All I really need to understand is (Uh-huh)
When you talk dirty to me
Talk dirty to me (What?)
Talk dirty to me
Talk dirty to me (What?)
Get Jazzy on 'em
"""
result = analyze_sentiment(lyrics)
print(f"Sentiment: {result}")
