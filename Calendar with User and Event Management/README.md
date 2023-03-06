
### Calendar Page:

-   Link:  [http://ec2-3-144-225-174.us-east-2.compute.amazonaws.com/~qiyuan/M5group/calendar.html#](http://ec2-3-144-225-174.us-east-2.compute.amazonaws.com/~qiyuan/M5group/calendar.html#)

-   Database:-   [http://ec2-3-144-225-174.us-east-2.compute.amazonaws.com/phpmyadmin/index.php?route=/database/structure&db=calendar](http://ec2-3-144-225-174.us-east-2.compute.amazonaws.com/phpmyadmin/index.php?route=/database/structure&db=calendar)
-   database username: calendar_inst
-   database password: calendar_pass

####  Calendar example user account:

-   username: mypwis123
-   password: 123
-   event is in 2022-10-25
#### User instruction:

-   Log in, log out: On the very top of page, on the left click popup window
-   Switching month: hit "<", ">" button on top
-   Adding event: click on the "+" button
-   Editing and deleting event: Click on the correspoing date, event will be displayed. Afterwards, edit and delete button will be created in each event record
#### Screenshot:
<img width="959" alt="demo" src="https://user-images.githubusercontent.com/71271157/223008426-9f0c016f-39c4-4c08-b1c6-c66d632b5a46.png">
<img width="956" alt="demo2" src="https://user-images.githubusercontent.com/71271157/223008774-f11d17f7-4d57-45d6-9e95-7e63bd217070.png">

#### Features:
1.  **AJAX Calendar (60 Points):**
    -   _**Calendar View (10 Points):**_
        -   The calendar is displayed as a table grid with days as the columns and weeks as the rows, one month at a time (5 points)
        -   The user can view different months as far in the past or future as desired (5 points)
    -   _**User and Event Management (25 Points):**_
        -   Events can be added, modified, and deleted (5 points)
        -   Events have a title, date, and time (2 points)
        -   Users can log into the site, and they cannot view or manipulate events associated with other users (8 points)
            
            _Don't fall into the Abuse of Functionality trap! Check user credentials on the server side as well as on the client side._
            
        -   All actions are performed over AJAX, without ever needing to reload the page (7 points)
        -   Refreshing the page does not log a user out (3 points)
    -   _**Best Practices (20 Points):**_
        -   Code is well formatted and easy to read, with proper commenting (2 points)
        -   If storing passwords, they are stored salted and hashed (2 points)
        -   All AJAX requests that either contain sensitive information or modify something on the server are performed via POST, not GET (3 points)
        -   Safe from XSS attacks; that is, all content is escaped on output (3 points)
        -   Safe from SQL Injection attacks (2 points)
        -   CSRF tokens are passed when adding/editing/deleting events (3 points)
        -   Session cookie is HTTP-Only (3 points)
        -   Page passes the W3C validator (2 points)
    -   _**Usability (5 Points):**_
        -   Site is intuitive to use and navigate (4 points)
        -   Site is visually appealing (1 point)

	 -   _**Creative (5 Points):**_
			-   Events are displayed within each date, click on date will show events.
			-   Tags: When creating event, there are three tags: red, blue, green to be selected.
			-   Create Group Event: When creating events, on the very buttom, id can be entered to create group event for others. For example :(38,41) spilted by comma if for mutiple user.
			-   Share event: In the edit/share button, in the below section of

TA: 100%
