import json
from pprint import pprint

musicians = [ "bell", "ehnes", "gitlis", "heifetz", "hristova", "kremer", "midori", "milstein", "perlman", "vengerov", "zimmerman", ]

for musician in musicians:
    with open("{}.json".format(musician)) as f:
        data = json.load(f)

    faces = data["Faces"]

    small = []
    for face in faces:
        emotions = {}
        for emotion in face["Face"]["Emotions"]:
            emotions[emotion["Type"]] = emotion["Confidence"]

        d = {
            "time": face["Timestamp"],
            "smile": face["Face"]["Smile"]["Confidence"] * (1 if face["Face"]["Smile"]["Value"] else -1),
            "mouthOpen": face["Face"]["MouthOpen"]["Confidence"] * (1 if face["Face"]["MouthOpen"]["Value"] else -1),
            "eyesClosed": face["Face"]["EyesOpen"]["Confidence"] * (-1 if face["Face"]["EyesOpen"]["Value"] else 1),
            "emotions": emotions,
        }
        small.append(d)

    with open("{}-small.json".format(musician), 'w') as outfile:
        json.dump(small, outfile)