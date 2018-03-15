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
write("Test")
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
press(TAB)
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(1)
if Text("Test").exists():
    print("Test 1 Passed")
else:
    print("Test 1 failed, the item was not created")
time.sleep(1)

click("New session")
time.sleep(1)
write("", into="title")
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
press(TAB)
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(1)
write("A Really Long Test String Over 20", into="title")
time.sleep(1)
click("Submit")
time.sleep(1)
if Text("A Really Long Test S").exists():
    print("Test 2 Passed")
else:
    print("Test 2 failed, the item was not created")

click("New session")
write("Test3", into="title")
press(TAB)
press(TAB)
write("032018")
press(TAB)
write("1230")
press(TAB)
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(1)
click("Go Back")
time.sleep(1)
if Text("Test3").exists():
    print("Test 3 failed, the item should not have been added")
else:
    print("Test 3 passed")

click("New session")
write("Test4", into="title")
press(TAB)
write(day + month + year)
press(TAB)
press(TAB)
write("30")
press(TAB)
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(1)
click("Go Back")
time.sleep(1)
if Text("Test4").exists():
    print("Test 4 failed, the item should not have been added")
else:
    print("Test 4 passed")

click("New session")
write("Test5", into="title")
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
press(TAB)
write("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.")
press(TAB)
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(1)
if Text("Test5").exists():
    print("Test 5 passed")
else:
    print("Test 5 failed, the session should have been created")


click("New session")
time.sleep(3)
write("Test6", into="title")
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
press(TAB)
click(RadioButton("Deadline"))
press(TAB)
time.sleep(1)
press(ENTER)
time.sleep(1)
if Text("Test6").exists():
    print("Test 6 passed")
else:
    print("Test 6 failed, The item session should have been created")
kill_browser()