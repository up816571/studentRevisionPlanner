from helium.api import *
import getpass
import time

today = time.strftime('%Y%m%d')
day = today[-2:]
month = today[4:6]
year = today[:4]

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

#test 1 add a valid session
wait_until(Text("New session").exists)
click("New session")
write("Test", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
click("Submit")
wait_until(Text("New session").exists)
if Text("Test").exists():
    print("Test 1 Passed")
else:
    print("Test 1 failed, the item was not created")

#test 2, no charecters and more than 20
click("New session")
write("", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
click("Submit")
write("A Really Long Test String Over 20", S("#title-input"))
click("Submit")
wait_until(Text("New session").exists)
if Text("A Really Long Test S").exists():
    print("Test 2 Passed")
else:
    print("Test 2 failed, the item was not created")

#test 3, invalid date
click("New session")
write("Test3", S("#title-input"))
press(TAB)
press(TAB)
write("032018")
press(TAB)
write("1230")
click("Submit")
click("Go Back")
wait_until(Text("New session").exists)
if Text("Test3").exists():
    print("Test 3 failed, the item should not have been added")
else:
    print("Test 3 passed")

#test 4, invalid time
click("New session")
write("Test4", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
press(TAB)
write("30")
click("Submit")
click("Go Back")
wait_until(Text("New session").exists)
if Text("Test4").exists():
    print("Test 4 failed, the item should not have been added")
else:
    print("Test 4 passed")

#test 4, over 400 charecters for description
click("New session")
write("Test5", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
write("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.", S("#description-input"))
click("Submit")
wait_until(Text("New session").exists)
if Text("Test5").exists():
    print("Test 5 passed")
else:
    print("Test 5 failed, the session should have been created")

#test 6, test deadline
click("New session")
write("Test6", S("#title-input"))
press(TAB)
write(day + month + year)
press(TAB)
write("1230")
click(RadioButton("Deadline"))
click("Submit")
time.sleep(1)
if Text("Test6").exists():
    print("Test 6 passed")
else:
    print("Test 6 failed, The item session should have been created")
kill_browser()