drop database if exists plannerdb;
create database if not exists plannerdb;

use plannerdb;

create table if not exists plannerdb.sessions (
  id int primary key auto_increment,
  sessionName varchar(20),
  sessionDate date,
  sessionTime int,
  description text,
  userid varchar(50)
);

INSERT INTO sessions VALUES (1 ,"Math", 2018-03-01, 10, "test", "110900211868756842381");
