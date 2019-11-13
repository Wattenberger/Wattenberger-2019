from __future__ import print_function
import json
import numpy as np
import pandas as pd
from pandas.core.common import flatten
import nltk
import umap
import re
import os
import codecs
from sklearn import feature_extraction
import itertools
from progress import printProgressBar

from nltk.stem.snowball import SnowballStemmer
stemmer = SnowballStemmer("english")

input_path = "C:/Users/watte/Development/repos/book-tools/king"
facts = []
titles = ["11_22_63_ A Novel","Eyes of the Dragon, The","Night Shift","Bag of Bones","Face in the Crowd, A","Nightmares & Dreamscapes","Bazaar of Bad Dreams, The","Finders Keepers","Pet Sematary","Big Driver","Firestarter","Rage", "Black House","Four Past Midnight","Regulators, The","Blockade Billy","From a Buick 8","Revival","Carrie","Full Dark, No Stars","Riding the Bullet","Cell","Gerald's Game","Roadwork","Colorado Kid, The","Girl Who Loved Tom Gordon, The","Rose Madder","Cujo","Good Marriage","Running Man, The","Cycle of the Werewolf","Green Mile, The","Salem's Lot","Danse Macabre","Guns (Kindle Single)","Shining, The","Dark Half, The","Gunslinger, The","Skeleton Crew","Dark Tower IV Wizard and Glass, The","Hearts In Atlantis","Song of Susannah","Dark Tower, The","IT","Stand, The","Dead Zone, The","Insomnia","Talisman 01 - The TalismanCL Peter Straub","Desperation","Joyland","Thinner","Different Seasons","Just After Sunset","Tommyknockers, The","Doctor Sleep","Lisey's Story","Dolores Claiborne","Long Walk, The","Under the Dome","Drawing of the Three, The","Mile 81","Ur","Dreamcatcher","Misery","Waste Lands, The","Duma Key","Mist, The","Wind Through the Keyhole, The","End of Watch (The Bill Hodges Trilogy Book 3)","Mr. Mercedes","Wolves of the Calla","Everything's Eventual","Needful Things","Blaze","Christine","On Writing"]
number_of_books = len(titles)
texts = []
text_lengths = []

for book_name in titles:
    book_text = open("king/%s.txt" % book_name, "r").read()
    texts.append(book_text)
    text_lengths.append(len(book_text))


iterations = 0

def get_tokens(text):
    tokens = [word.lower() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = [token for token in tokens if re.search('[a-zA-Z]', token)]
    global iterations
    iterations += 1
    printProgressBar(iterations, number_of_books, prefix='Progress:', suffix='Complete', length=50)
    return filtered_tokens


def get_stems(text):
    return [stemmer.stem(token) for token in get_tokens(text)]


all_stems = list(itertools.chain.from_iterable([get_stems(text) for text in texts]))

iterations = 0
all_tokens = list(itertools.chain.from_iterable([get_tokens(text) for text in texts]))

vocab_frame = pd.DataFrame({'words': all_tokens}, index=all_stems)
print('there are ' + str(vocab_frame.shape[0]) + ' items in vocab_frame')


from sklearn.feature_extraction.text import TfidfVectorizer

tfidf_vectorizer = TfidfVectorizer(
    max_df=0.95,
    # max_features=200000,
    # min_df=0.05,
    # stop_words='english',
    use_idf=True,
    tokenizer=get_stems,
    ngram_range=(1,3)
)

tfidf_matrix = tfidf_vectorizer.fit_transform(texts) #fit the vectorizer to texts

print("shape: ", tfidf_matrix.shape)

terms = tfidf_vectorizer.get_feature_names()

print("terms: ", terms[1:10])

with open('terms.json', 'w') as outfile:
    json.dump(terms, outfile)

try:
    from sklearn.metrics.pairwise import cosine_similarity
    dist = 1 - cosine_similarity(tfidf_matrix)

    from sklearn.cluster import KMeans

    num_clusters = 21

    km = KMeans(n_clusters=num_clusters)

    km.fit(tfidf_matrix)

    clusters = km.labels_.tolist()
    print("clusters: ", clusters)

    import joblib

    # joblib.dump(km,  'doc_cluster.pkl')

    km = joblib.load('doc_cluster.pkl')
    clusters = km.labels_.tolist()

    books = {
        'title': titles,
        'text': texts,
        'text_length': text_lengths,
        'cluster': clusters
    }

    frame = pd.DataFrame(
        books,
        index=[clusters],
        columns=['title', 'text', 'text_length', 'cluster']
    )

    # number of books per cluster
    frame['cluster'].value_counts()

    # groupby cluster for aggregation purposes
    grouped = frame['text_length'].groupby(frame['cluster'])

    # average text length per cluster
    print("means", grouped.mean())


    print("Top [1:10] per cluster:")
    print()
    # sort cluster centers by proximity to centroid
    order_centroids = km.cluster_centers_.argsort()[:, ::-1]
    cluster_words = []

    for i in range(num_clusters):
        print("Cluster %d words:" % i, end='')
        print()

        for ind in order_centroids[i, :6]: #replace 6 with n words per cluster
            if terms[ind]:
                print(' %s' % vocab_frame.loc[terms[ind].split(' ')].values.tolist()[0][0].encode('utf-8', 'ignore'), end=',')
                print()
            cluster_words.append([terms[ind] for ind in order_centroids[i, :20]])

        print("Cluster %d titles:" % i, end='')
        for title in frame.loc[i]['title'].values.tolist():
            print(' %s,' % title, end='')
            print()

    embedding = umap.UMAP(
        n_neighbors=15,
        min_dist=0.3,
        metric='euclidean'
    ).fit_transform(dist)

    embedding_frame = pd.DataFrame(embedding)
    embedding_frame.columns = ['x','y']

    output = [{
        "index": index,
        "x": str(embedding[index][0]),
        "y": str(embedding[index][1]),
        "title": titles[index],
        "length": str(text_lengths[index]),
        "cluster": str(clusters[index]),
    } for index in range(len(titles))]

    from json import encoder
    encoder.FLOAT_REPR = lambda o: format(o, '.4f')

    with open('similarities.json', 'w') as outfile:
        json.dump({
            "output": output,
            "cluster_words": cluster_words,
        }, outfile)


except TypeError as e:

    import ipdb; ipdb.set_trace()
