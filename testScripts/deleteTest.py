from helium.api import *
import getpass
import time

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
write("15032018")#Important this must be todays date dd/mm/yyyy
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
kill_browser()
