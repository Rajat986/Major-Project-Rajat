from __future__ import print_function
import os.path
import csv
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from apiclient import errors

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly', 'https://www.googleapis.com/auth/classroom.profile.emails', 'https://www.googleapis.com/auth/classroom.rosters']

def main():
    """Shows basic usage of the Classroom API.
    Prints the names of the first 10 courses the user has access to.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('classroom', 'v1', credentials=creds)
    retrieve_all_files(service)

def retrieve_all_files(service):
    students_id_email=[]
    page_token=None
    while True:
        try:
            param={}
            if page_token:
                param['pageToken']=page_token
            results=service.courses().students().list(**param, courseId='266316044397').execute()
            students = results.get('students', [])
            for student in students:
                print(student['userId']+" "+student['profile']['emailAddress'])
                student_id_email=[student['userId'],student['profile']['emailAddress']]
                students_id_email.append(student_id_email)
            page_token=results.get('nextPageToken')
            print(students_id_email)

            if not page_token:
                break

        except errors.HttpError as error:
            print ('An error occoured +: %s' %error)
            break
    
    with open('student_id_email.csv', 'a') as f:
                write = csv.writer(f, lineterminator='\n')
                write.writerows(students_id_email)
    
if __name__ == '__main__':
    main()
