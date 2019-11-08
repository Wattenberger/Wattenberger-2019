#!/usr/bin/env python

# This script will create a json file (data.json) describing the structure
# and contents of files within the folder you specify

# you'll need to pip install gitpython to get the file edit info

# call it like python folder_structure_to_json.py /path/to/repo
# the git.log commands will be expensive - feel free to comment out for larger repos

import os
import sys
from git import Repo
import errno

repo = Repo(sys.argv[1])
git = repo.git

COUNT = 0
def increment():
    global COUNT
    COUNT += 1

def path_hierarchy(path):
    st = os.stat(path)
    name = os.path.basename(path)
    if len(name.split("/")) > 1:
        name = name.split("/")[-1]

    hierarchy = {
        'type': 'folder',
        'name': name,
        'path': "/".join(os.path.relpath(path).split("/")[1:-1]),
        'size': st.st_size,
        'id': COUNT
    }
    increment()

    try:
        hierarchy['children'] = [
            path_hierarchy(os.path.join(path, contents))
            for contents in os.listdir(path)
        ]
    except OSError as e:
        if e.errno != errno.ENOTDIR:
            raise
        hierarchy['type'] = path.split("/")[-1].split(".")[-1] if len(path.split("/")[-1].split(".")) > 1 else "text"
        last_edit = git.log('-1', path, format="%ad")
        num_of_edits = len(git.log(path, format="%ad").split("\n"))
        hierarchy["last_edit"] = last_edit
        hierarchy["num_of_edits"] = num_of_edits

    return hierarchy

if __name__ == '__main__':
    import json
    import sys

    try:
        directory = sys.argv[1]
    except IndexError:
        directory = "."

    hierarchy = path_hierarchy(directory)

    with open('hierarchy.json', 'w') as outfile:
        json.dump(hierarchy, outfile, indent=2)
