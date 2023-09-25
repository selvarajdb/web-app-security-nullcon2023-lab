import pickle

# Deserialize and read the data from the file
with open('data.pickle', 'rb') as file:
    deserialized_data = pickle.load(file)

# Display the deserialized data
print(deserialized_data)
