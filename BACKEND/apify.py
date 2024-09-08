from apify_client import ApifyClient

def tweetcrawl(word, count):
    # Initialize the ApifyClient with your API token

    # If account used is chganged, just change this API token and you're good to go
    client = ApifyClient("apify_api_wvYHtZK6DoQ1tOBathmJ26IXg45SRS35MUmW")

    run_input = {
        "queries": [word],
        "max_tweets": count,
        "language": "en",
        "use_experimental_scraper": False,
        "user_info": "user info and replying info",
        "max_attempts": 2,
    }

    # Run the Actor and wait for it to finish
    run = client.actor("wHMoznVs94gOcxcZl").call(run_input=run_input)

    # Fetch and return Actor results from the run's dataset (if there are any)
    tweets = []
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        tweets.append(item)
    return tweets

#     Result contains the following fields for every single tweet:
#       {
#     "tweet_avatar": "https://pbs.twimg.com/profile_images/1732250791724101632/uKlYkD18_400x400.jpg",
#     "tweet_id": "1735315954454950285",
#     "url": "https://twitter.com/the1n1lee/status/1735315954454950285",
#     "query": "win lang:en  -filter:nativeretweets",
#     "text": "INC will never win with this lazy leadership. Forget 2024. Its gone",
#     "username": "@the1n1lee",
#     "fullname": "அருண் | ARUN",
#     "timestamp": "2023-12-14 15:08:00+00:00",
#     "language": null,
#     "in_reply_to": [
#       "@Anjan94150697"
#     ],
#     "replies": 0,
#     "retweets": 0,
#     "quotes": 0,
#     "images": [],
#     "likes": 0,
#     "banner_image": null,
#     "total_tweets": null,
#     "num_following": null,
#     "num_followers": null,
#     "total_likes": null,
#     "tweet_links": [],
#     "tweet_hashtags": [],
#     "tweet_mentions": []
#   }

if __name__ == "__main__":
    print(tweetcrawl("nike", 20))