# import csv
# import sys

# #input number you want to search
# number = raw_input('Enter number to find\n')

# #read csv, and split on "," the line
# csv_file = csv.reader(open('test.csv', "r"), delimiter=",")


# #loop through the csv list
# for row in csv_file:
#     #if current rows 2nd value is equal to input, print that row
#     if number == row[1]:
#          print (row)
import csv
import re
def link_student_id(emailId):
    csv_file_link_student=csv.reader(open('student_id_email.csv', "r"),delimiter=',')

    for row in csv_file_link_student:
        if emailId == row[1]:
            return row[0] 

def student_find_activities(emailId):
    student_id=link_student_id(emailId)
    print(student_id)
    str(student_id)
    csv_file_find_activities=csv.reader(open('drive_files_final_csv.csv', "r"))

    for row in csv_file_find_activities:
        if student_id in row[0]:
            #print(re.split(r'$%', row[0]))
            #print(row[0].split('$%['))
            q=row[0].replace('$%[',', ').replace(']#@',', ').split(', ')
            print(q[1])


student_find_activities('eng19cs0063.bharatha@gmail.com')
