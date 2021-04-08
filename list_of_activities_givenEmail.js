const lineReader = require('line-reader');
const LineReaderSync = require("line-reader-sync")

function link_student_id(email_ID,callback){
    console.log("Student Email ID: "+email_ID);
    lineReader.eachLine('student_id_email_section.csv', function(line) {
        email_ID_file=line.split(',')[1];
        student_id=line.split(',')[0];
        if(email_ID == email_ID_file)
            callback(student_id); 
    })
}
function days_worked(stu_timestamps_people_id,student_ID,total_days) {
    days=[];
    stu_timestamp_people_id=stu_timestamps_people_id.split("*&*");
    stu_timestamp_people_id.forEach(element => {
        stu_ID=element.split('/')[1];
        timestamp_single=element.split('/')[0];
        if(stu_ID == student_ID) {
            date=timestamp_single.split('T')[0];
            days.push(date);
        }
    });
    var days_set=new Set(days);
    console.log("Days worked: "+days_set.size);
    let days_set_array = [];
    days_set.forEach(v => days_set_array.push(v));
    console.log("Dates: "+days_set_array+'\n');
    total_days=total_days+days_set.size;
    return total_days;
}


function student_find_activities(student_ID) {
    var total_days=0;
    console.log("Student ID: "+student_ID+'\n');
    lrs=new LineReaderSync("drive_activity_files.txt")
    while(true){
            var line = lrs.readline();
            if(line === null){
                break;
            }
            else{
                stu_doc_id=line.split('***')[0];
                stu_email_id=line.split('***')[1];
                stu_doc_name=line.split('***')[2];
                stu_timestamps_people_id=line.split('***')[3];
                if(line.includes(student_ID)) {
                    console.log(stu_doc_name);
                    total_days=days_worked(stu_timestamps_people_id,student_ID,total_days);
                }
            }

    }
    console.log("Total: "+total_days);
}

link_student_id('eng19cs0116.harshithnm@gmail.com',student_find_activities);
