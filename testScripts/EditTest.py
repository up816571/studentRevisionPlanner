from helium.api import *
import getpass
import time

email = input("enter an email ")
pswd = getpass.getpass()

start_chrome()
go_to("up818360.myvm.port.ac.uk")
click("Sign in")
write(email)
press(ENTER)
time.sleep(2)
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


#making changes but not saving them, by clicking go back 
click("Editing Test Stage 2")
write("Editing Test Stage 3", into="title")
press(TAB)
write("15")
write("03")
write("2018")
press(TAB)
write("11")
write("30")
press(TAB)
write("changes should not be saved")
press(TAB)
press(TAB)
click("Go Back")
time.sleep(1)

if Text("Editing Test Stage 3").exists():
    print("Test has failed, it should not exist bacause changes were not saved")
else:
    print("Test was success")
kill_browser()

