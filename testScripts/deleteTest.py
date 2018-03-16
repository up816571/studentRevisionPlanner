from helium.api import *
import getpass
import time


today = time.strftime('%Y%m%d')
day = today[-2:]
month = today[4:6]
year = today[:4]

email = input("enter a google account email ")
pswd = getpass.getpass()

#intialise
start_chrome()
go_to("up816571.myvm.port.ac.uk")
click("Sign in")
write(email)
press(ENTER)
time.sleep(0.5)
wait_until(S("#profileIdentifier").exists)
write(pswd)
press(ENTER)

#Make a new session
wait_until(Text("New session").exists)
click("New session")
write("Delete", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
click("Submit")
wait_until(Text("New session").exists)

#Delete the created session
click("Delete")
wait_until(S("#delete-button").exists)
click("delete")
time.sleep(1)
if Text("Delete").exists():
    print("Test 1 Failed, the item should have been deleted")
else:
    print("Test 1 passed")
kill_browser()
