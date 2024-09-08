
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import preprocessor
import helper
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            data = file.read().decode("utf-8")
            df = preprocessor.preprocess(data)
            selected_user = request.form['selected_user']
            sentiment_sentence = helper.sentiment_analysis(selected_user, df)

            # Stats Area
            num_messages, words, num_media_messages, num_links = helper.fetch_stats(selected_user, df)

            # Add your response here
    # if request.method == 'POST':

    #     file = request.files['file']
    #     print(file)
    #     if file:
    #         data = file.read().decode("utf-8")
    #         df = preprocessor.preprocess(data)

    #         selected_user = request.form['selected_user']

    #         sentiment_sentence = helper.sentiment_analysis(selected_user, df)

    #         # Stats Area
    #         num_messages, words, num_media_messages, num_links = helper.fetch_stats(selected_user, df)

            # monthly timeline
            timeline = helper.monthly_timeline(selected_user, df)
            fig, ax = plt.subplots()
            ax.plot(timeline['time'], timeline['message'], color='green')
            plt.xticks(rotation='vertical')
            plt.tight_layout()
            monthly_timeline_img = fig_to_base64(fig)

            # daily timeline
            daily_timeline = helper.daily_timeline(selected_user, df)
            fig, ax = plt.subplots()
            ax.plot(daily_timeline['only_date'], daily_timeline['message'], color='black')
            plt.xticks(rotation='vertical')
            plt.tight_layout()
            daily_timeline_img = fig_to_base64(fig)

            # activity map
            busy_day = helper.week_activity_map(selected_user, df)
            fig, ax = plt.subplots()
            ax.bar(busy_day.index, busy_day.values, color='purple')
            plt.xticks(rotation='vertical')
            plt.tight_layout()
            busy_day_img = fig_to_base64(fig)

            busy_month = helper.month_activity_map(selected_user, df)
            fig, ax = plt.subplots()
            ax.bar(busy_month.index, busy_month.values, color='orange')
            plt.xticks(rotation='vertical')
            plt.tight_layout()
            busy_month_img = fig_to_base64(fig)

            user_heatmap = helper.activity_heatmap(selected_user, df)
            fig, ax = plt.subplots()
            ax = sns.heatmap(user_heatmap)
            plt.tight_layout()
            heatmap_img = fig_to_base64(fig)

            # if selected_user == 'Overall':
            #     x, new_df = helper.most_busy_users(df)
            #     fig, ax = plt.subplots()
            #     ax.bar(x.index, x.values, color='red')
            #     plt.xticks(rotation='vertical')
            #     plt.tight_layout()
            #     busiest_users_img = fig_to_base64(fig)
            # else:
            #     busiest_users_img = None
            #     new_df = None

            df_wc = helper.create_wordcloud(selected_user, df)
            fig, ax = plt.subplots()
            ax.imshow(df_wc)
            plt.tight_layout()
            wordcloud_img = fig_to_base64(fig)

            most_common_df = helper.most_common_words(selected_user, df)
            fig, ax = plt.subplots()
            ax.barh(most_common_df[0], most_common_df[1])
            plt.xticks(rotation='vertical')
            plt.tight_layout()
            common_words_img = fig_to_base64(fig)

            emoji_df = helper.emoji_helper(selected_user, df)
            emoji_table = emoji_df.to_html()
            print("emoji")

            return {"status": "success", "sentiment": sentiment_sentence, "stats": {"num_messages": num_messages, "words": words, "num_media_messages": num_media_messages, "num_links": num_links,"monthly_timeline_img":monthly_timeline_img, "emoji_table":emoji_table, "daily_timeline_img": daily_timeline_img,"busy_day_img":busy_day_img,"busy_month_img":busy_month_img,"heatmap_img":heatmap_img,"wordcloud_img":wordcloud_img,"common_words_img":common_words_img}}
        else:
            return {"status": "error", "message": "No file received"}
    else:
        return {"status": "error", "message": "Unsupported request method"}
        #     return jsonify({
        #         "sentiment_sentence": sentiment_sentence,
        #         "num_messages": num_messages,
        #         "words": words,
        #         "num_media_messages": num_media_messages,
        #         "num_links": num_links,
        #         "monthly_timeline_img": monthly_timeline_img,
        #         "daily_timeline_img": daily_timeline_img,
        #         "busy_day_img": busy_day_img,
        #         "busy_month_img": busy_month_img,
        #         "heatmap_img": heatmap_img,
        #         "busiest_users_img": busiest_users_img,
        #         "most_common_words_img": common_words_img,
        #         "wordcloud_img": wordcloud_img,
        #         "emoji_table": emoji_table,
        #         "user_activity_table": new_df.to_html() if new_df is not None else None
        #     })
        # else:
        #     return jsonify({"error": "No file uploaded"}), 400


def fig_to_base64(fig):
    img = io.BytesIO()
    fig.savefig(img, format='png')
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()

if __name__ == '__main__':
    app.run(debug=True)
