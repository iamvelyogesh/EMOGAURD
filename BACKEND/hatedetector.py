import joblib
import PreprocessUtil as PreProcess
import pandas as pd


def hatedetectorfunc(text):

    model = joblib.load("SVM_model.sav")

    X = pd.DataFrame([text])

    X.columns = ['tweet']

    X = PreProcess.run(X)

    isHate = model.predict(X['tweet'])

    return isHate

if __name__ == "__main__":

    print("\nHate") if hatedetectorfunc("I will kill you") else print("\nNo Hate")


