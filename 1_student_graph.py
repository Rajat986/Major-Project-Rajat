import numpy as np
import matplotlib.pyplot as plt


# creating the dataset
data = {'Activity 1':1, 'Activity 2':1, 'Activity 3':1, 'Activity 4':2, 'Activity 5':1, 'Activity 6':2, 'Activity 7':3, 'Activity 8':4, 'Activity 9':3, 'Activity 10':5, 'Activity 11':3, 'Activity 12':4, 'Activity 13':5, 'Activity 14':6}
courses = list(data.keys())
values = list(data.values())

fig = plt.figure(figsize = (26, 5))

# creating the bar plot
plt.bar(courses, values, color ='maroon',
		width = 0.4)

plt.xlabel("Activities")
plt.ylabel("Number of days worked")
plt.show()
