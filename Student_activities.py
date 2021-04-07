import csv
import re
def link_student_id(emailId):
    csv_file_link_student=csv.reader(open('student_id_email_section.csv', "r"),delimiter=',')

    for row in csv_file_link_student:
        if emailId == row[1]:
            return row[0] 

def student_find_activities(emailId):
    student_id=link_student_id(emailId)
    print("Student ID: "+student_id)
    print("Student Email ID: "+emailId)
    csv_file_find_activities=csv.reader(open('drive_files_final_csv.csv', "r"))

    for row in csv_file_find_activities:
        if student_id in row[0]:
            q=row[0].replace('$%[',', ').replace(']#@',', ').replace(')!*',', ').split(", ")
            student_timestamp=activity_timestamps(q[3],student_id)
            days_worked=student_days_worked(student_timestamp)
            print(days_worked, q[1])
            student_time_worked(student_timestamp)


def activity_timestamps(activity_timestamps, student_id):
    timestamps=activity_timestamps.split('*&*')
    stu_timestamps=[]
    for i in timestamps:
        temp_id=i[-21:]
        if(temp_id==student_id):
            stu_timestamps.append(i[0:19:1])
    return stu_timestamps


def student_days_worked(stu_timestamps):
    days=[]
    for i in stu_timestamps:
        days.append(i.split('T')[0])
    days=set(days)
    return len(days)

def student_time_worked(stu_timestamps):
    day_time_dict={}
    day_time_tuple_list=[]
    for i in stu_timestamps:
        day_time=i.split('T')
        day_time_tuple=tuple(day_time)
        day_time_tuple_list.append(day_time_tuple)
    #print(day_time_tuple_list)

    for k,v in day_time_tuple_list:
        day_time_dict.setdefault(k,[]).append(v)
    print(day_time_dict)

student_find_activities('eng19cs0368.yashodha@gmail.com')
