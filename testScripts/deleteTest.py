from helium.api import *
import getpass
import time


today = time.strftime('%Y%m%d')
day = today[-2:]
month = today[4:6]
year = today[:4]

email = input("enter an email ")
pswd = getpass.getpass()

start_chrome()
go_to("up816571.myvm.port.ac.uk")
click("Sign in")
write(email)
press(ENTER)
time.sleep(2)
write(pswd)
press(ENTER)
time.sleep(3)

click("New session")
write("Delete")
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
press(TAB)
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(2)

click("Delete")
time.sleep(1)
click("delete")
time.sleep(1)
if Text("Delete").exists():
    print("Test 1 Failed, the item should have been deleted")
else:
    print("Test 1 passed")
kill_browser()
