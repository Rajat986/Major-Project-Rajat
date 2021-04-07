const lineReader = require('line-reader');

async function link_student_id(email_ID,callback){
    lineReader.eachLine('student_id_email_section.csv', function(line) {
        email_ID_file=line.split(',')[1];
        student_id=line.split(',')[0];
        if(email_ID == email_ID_file)
            callback(student_id); 
    })
}


async function student_find_activities(student_ID) {
    //student_ID=await callback(email_ID);
    console.log(student_ID);
    lineReader.eachLine('drive_activity_files.txt', function(line) {
        stu_doc_id=line.split('***')[0];
        stu_email_id=line.split('***')[1];
        stu_doc_name=line.split('***')[2];
        stu_timestamps_people_id=line.split('***')[3];
        if(line.includes(student_ID)) {
            console.log(stu_doc_name);
        } 
    });
}

link_student_id('eng19cs0030.amoolya@gmail.com',student_find_activities);
