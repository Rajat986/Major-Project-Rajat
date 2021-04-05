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
            q=row[0].replace('$%[',', ').replace(']#@',', ').split(", ")
            print(q[1])

student_find_activities('eng19cs0030.amoolya@gmail.com')
