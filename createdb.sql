drop database if exists plannerdb;
create database if not exists plannerdb;

use plannerdb;

create table if not exists plannerdb.sessions (
  id int primary key auto_increment,
  sessionName varchar(20),
  sessionDate date,
  sessionTime time,
  description text,
  typeof text,
  userid varchar(50)
);

INSERT INTO sessions VALUES (1 ,"Math", "2018-03-03", "10:30:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (2 ,"Math1", "2018-03-03", "10:20:00", "test", "deadline", "110900211868756842381");
INSERT INTO sessions VALUES (3 ,"Math2", "2018-03-03", "10:10:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (4 ,"Math3", "2018-03-02", "11:30:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (5 ,"Math4", "2018-03-01", "13:30:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (6 ,"Math5", "2018-03-04", "14:30:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (7 ,"Math6", "2018-03-05", "15:30:00", "test", "deadline", "110900211868756842381");
INSERT INTO sessions VALUES (8 ,"Math7", "2018-03-06", "16:30:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (9 ,"Math8", "2018-03-04", "23:30:00", "test", "session", "110900211868756842381");
INSERT INTO sessions VALUES (10 ,"Math9", "2018-03-10", "23:00:00", "test", "session", "110900211868756842381");
