from helium.api import *
import getpass
import time
import calendar


today = time.strftime('%Y%m%d')
day = today[-2:]
month = today[4:6]
year = today[:4]
tomorrow = str(int(day) + 1)
newMonth = today[4:6]
newYear = today[:4]

#for date test if on the last day of the month
last = calendar.monthrange(int(year),int(month))
if(tomorrow == str(last[1])):
    tomorrow = "01"
    newMonth = str(int(month) + 1)
    if (newMonth == "13"):
        newMonth = "01"
        newYear = str(int(year) + 1)
        
email = input("enter a google account email ")
pswd = getpass.getpass()

#initialise
start_chrome()
go_to("up816571.myvm.port.ac.uk")
click("Sign in")
write(email)
press(ENTER)
time.sleep(0.5)
wait_until(S("#profileIdentifier").exists)
write(pswd)
press(ENTER)

#Creating a session 
wait_until(Text("New session").exists)
click("New session")
write("Editing Test", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1400")
click("Submit")
wait_until(Text("New session").exists)


#Editing title, date, time and description
click("Editing Test")
click(S("#title-input"))
press(DELETE)
write("Editing Test Stage 2", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1130")
press(TAB)
write("Edited session", S("#description-input"))
click("Save")
wait_until(Text("New session").exists)
#Session called 'Editing Test' should not exist, but 'Editing Test Stage 2' should
if Text("Editing Test Stage 2").exists():
    print("Test 1 passed")
else:
    print("Editing test has failed, the title should have changed")


#making changes but not saving them, by clicking go back 
click("Editing Test Stage 2")
write("Editing Test Stage 3", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1130")
write("changes should not be saved", S("#description-input"))
click("Go Back")
wait_until(Text("New session").exists)
if Text("Editing Test Stage 3").exists():
    print("Test has failed, it should not exist bacause changes were not saved")
else:
    print("Test 2 was success")
    
#Changing the date    
click("Editing Test Stage 2")
click(S("#title-input"))
press(DELETE)
write("Editing Test Stage 4", S("#title-input"))
press(TAB)
write(tomorrow + newMonth + newYear)
click("Save")
wait_until(Text("New session").exists)
if Text("Editing Test Stage 4").exists():
    print("Test has failed, the session should no longer be here.")
else:
    print("Test 3 was success")
wait_until(S("#next-button").exists)
click(S("#next-button"))
time.sleep(0.5)
if Text("Editing Test Stage 4").exists():
    print("Test 3 part 2 was a success")
else:
    print("Test has failed, the session should be here.")
kill_browser()

