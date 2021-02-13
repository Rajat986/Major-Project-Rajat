import json
import matplotlib.pyplot as plt
import numpy as np

directory="C:/Users/press/Desktop/Discord chats/Section A/Akash B/"

json_file=open(directory+"Wed 12_15pm_Thur 9_45am A - 11-20 akash b - eng19cs0020-akhila [806415735764156456].json")

data=json.load(json_file)

instructor_name="cursim"
instructor_message_count=0
total_message_count=0
for i in data['messages']:
    total_message_count=total_message_count+1
    if "author" in i:
        if "name" in i['author']:
            print(i['author']['name'])
            if i['author']['name'] == instructor_name:
                instructor_message_count=instructor_message_count+1
                
print("Instructor (",instructor_name,") message count:", instructor_message_count)
print("Total message count:", total_message_count)


#graph
height=[instructor_message_count, total_message_count]
bars=('A', 'B')
y_pos=np.arange(len(bars))
plt.bar(y_pos, height)

names = ("Student Messages","Total Messages")
plt.xticks(y_pos, names)

plt.xlabel('X-axis')
plt.ylabel('Number of messages')
plt.show()
