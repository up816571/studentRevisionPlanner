from helium.api import *
from selenium import webdriver
import getpass
import time

pswd = getpass.getpass()
email = input("enter an email: ")

start_chrome()
go_to("up818360.myvm.port.ac.uk")
click("Sign in")
write(email)
press(ENTER)
time.sleep(1)
write(pswd)
press(ENTER)
time.sleep(3)

#Creating a session 
click("New session")
write("Editing Test")
press(TAB)
write("16")
write("03")
write("2018")
press(TAB)
write("12")
write("30")
press(TAB)
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)

#Editing title, date, time and description
click("Editing Test")
write("Editing Test Stage 2", into="title")
press(TAB)
write("15")
write("03")
write("2018")
press(TAB)
write("11")
write("30")
press(TAB)
write("Edited session")
press(TAB)
press(TAB)
press(ENTER)
time.sleep(1)

#Session called 'Editing Test' should not exist, but 'Editing Test Stage 2' should
if Text("Editing Test Stage 2").exists():
    print("Test passed")
else:
    print("Editing test has failed")
kill_browser()

