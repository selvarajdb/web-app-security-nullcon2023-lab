import pickle

# Data to be serialized
data_to_serialize = {"name": "John", "age": 30, "city": "New York"}

# Serialize and write the data to a file
with open('data.pickle', 'wb') as file:
    pickle.dump(data_to_serialize, file)
