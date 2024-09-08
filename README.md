# EMOGAURD - Police Interrogation and Investigation Tool

## Aim
The aim of this project is to assist law enforcement agencies by analyzing chat data and monitoring social media to detect threats or abusive behavior, thereby enhancing interrogation and investigation processes.

## Overview
This tool leverages machine learning to analyze chat data (e.g., WhatsApp) and social media comments to identify potential threats or harmful behavior. It provides law enforcement with real-time analysis and insights, aiding in interrogations and improving public safety.

## Description

### Features
- **Chat Data Analysis:** Processes chat data from platforms like WhatsApp.
- **Threat Detection:** Identifies abusive or threatening language using machine learning models.
- **Real-time Monitoring:** Monitors social media for negative or abusive sentiment.
- **Backend & Frontend Integration:** Flask for the backend, React.js for the frontend.
  
### Steps Involved

#### Data Collection
Collect chat data and social media comments for analysis.

#### Data Preprocessing
Tokenize and clean the text data by removing stop words and irrelevant characters.

```python
import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word not in stopwords.words('english') and word not in string.punctuation]
    return ' '.join(tokens)

df['cleaned_text'] = df['text'].apply(preprocess_text)
```

#### Model Training
Train a machine learning model to classify the text as abusive or non-abusive.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, df['label'], test_size=0.3, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred):.2f}')
```
#### Model Evaluation
Evaluate the model's performance using accuracy, precision, recall, and F1-score.

```python
from sklearn.metrics import classification_report

print(classification_report(y_test, y_pred))

```
#### Visualization
Visualize the sentiment distribution and results using charts and graphs.

```python
import matplotlib.pyplot as plt
from wordcloud import WordCloud

# Generate a Word Cloud for abusive comments
abusive_text = ' '.join(df[df['label'] == 'abusive']['cleaned_text'])
wordcloud = WordCloud(width=800, height=400, background_color='white').generate(abusive_text)

plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')
plt.show()
```
#### Relevance to Sentiment Analysis
Understanding the Issue:
Sentiment analysis can play a crucial role in identifying and mitigating cyberbullying. By analyzing online conversations and comments, sentiment analysis tools can help detect harmful content and patterns of abuse.

##### Monitoring Online Sentiment
Use sentiment analysis to monitor social media platforms for negative or harmful sentiments directed towards individuals. For example, analyze comments on sensitive posts to detect instances of cyberbullying.

```python
from textblob import TextBlob

def analyze_sentiment(text):
    analysis = TextBlob(text)
    if analysis.sentiment.polarity < 0:
        return 'Negative'
    elif analysis.sentiment.polarity == 0:
        return 'Neutral'
    else:
        return 'Positive'

comment = "Your cross-dressing is disgusting!"
print(analyze_sentiment(comment))  # Output: Negative
```
##### Identifying Patterns
Aggregate sentiment data to reveal patterns of abuse and target specific areas or individuals for intervention. This helps in designing better support systems and preventive measures.

```python
import pandas as pd

# Sample data
data = {'comment': ["Your cross-dressing is disgusting!", "You look great today!", "Stop being yourself."],
        'sentiment': [analyze_sentiment("Your cross-dressing is disgusting!"),
                      analyze_sentiment("You look great today!"),
                      analyze_sentiment("Stop being yourself.")]}
df = pd.DataFrame(data)
print(df)
```
##### Promoting Positive Engagement
Highlight supportive interactions to encourage a more inclusive online environment. Recognizing and rewarding positive comments can help foster a supportive and engaging community.

```python
positive_comments = df[df['sentiment'] == 'Positive']
print(positive_comments)
```
## Installation

1. **Install Required Libraries**

   Install the necessary Python libraries using pip:

   ```bash
   pip install pandas scikit-learn nltk textblob matplotlib wordcloud```
## Download Dataset

To perform sentiment analysis, you'll need a dataset with text and sentiment labels. You can use publicly available datasets or create your own. Here are a few sources for datasets:

### Sources

1. **Sentiment140 Dataset**

   - **Description**: This dataset contains 1.6 million tweets with sentiment labels (positive, negative, and neutral).
   - **Download**: [Sentiment140 Dataset](http://help.sentiment140.com/for-students)

2. **IMDb Reviews Dataset**

   - **Description**: This dataset consists of movie reviews from IMDb, with labels for sentiment (positive and negative).
   - **Download**: [IMDb Reviews Dataset](https://ai.stanford.edu/~amaas/data/sentiment/)

### Instructions

1. **Download the Dataset**

   - Visit the links provided and download the dataset files.
   - Save the dataset files to a directory within your project folder.

2. **Prepare the Dataset**

   - Ensure the dataset is in CSV format with columns for `text` and `sentiment`.
   - If your dataset is not in CSV format, convert it to CSV or adjust the code accordingly to handle the format you have.

3. **Load the Dataset**

   - Use the following code snippet to load the dataset into a pandas DataFrame:

     ```python
     import pandas as pd

     # Replace 'path_to_your_dataset.csv' with the path to your downloaded dataset
     df = pd.read_csv('path_to_your_dataset.csv')

     # Display the first few rows of the dataframe
     print(df.head())
     ```

   - Verify that the dataset contains the expected columns (`text` and `sentiment`).

4. **Preprocess the Data**

   - Clean and preprocess the text data as needed (e.g., tokenization, removing stop words).

     ```python
     from nltk.tokenize import word_tokenize
     from nltk.corpus import stopwords
     import string

     def preprocess_text(text):
         tokens = word_tokenize(text.lower())
         tokens = [word for word in tokens if word not in stopwords.words('english') and word not in string.punctuation]
         return ' '.join(tokens)

     df['cleaned_text'] = df['text'].apply(preprocess_text)
     ```

   - Save the preprocessed dataset if needed for further use.

---

Follow these instructions to download and prepare your dataset for  analysis. Adjust paths and preprocessing steps based on the specific requirements of your dataset.




