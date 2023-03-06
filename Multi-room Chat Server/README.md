## Multi-room Chat Server with Socket.IO
1.  **User instruction:**
	-   /help: will tell user how to use commands
	-   /ban : can ban user from entering current room if is creator, will not kick.
	-   /pm sometingtosay: send content to user in same room, only the target user can see the message
	-   /kick : kick user from current room if sender is creator.
2.  **Feature Description  (50 Points):**

    -   _**Administration of user created chat rooms (25 Points):**_
        -   Users can create chat rooms with an arbitrary room name(5 points)
        -   Users can join an arbitrary chat room (5 points)
        -   The chat room displays all users currently in the room (5 points)
        -   A private room can be created that is password protected (5 points)
        -   Creators of chat rooms can temporarily kick others out of the room (3 points)
        -   Creators of chat rooms can permanently ban users from joining that particular room (2 points)
    -   _**Messaging (5 Points):**_
        -   A user's message shows their username and is sent to everyone in the room (1 point)
        -   Users can send private messages to another user in the same room (4 points)
    -   _**Best Practices (5 Points):**_
        -   Code is well formatted and easy to read, with proper commenting (2 points)
        -   Code passes HTML validation (2 points)
        -   node_modules folder is ignored by version control (1 points)
    -   _**Usability (5 Points):**_
        -   Communicating with others and joining rooms is easy and intuitive (4 points)
        -   Site is visually appealing (1 point)
    -   **Creative Portion (10 Points)**
		-   In the text area, input :smile or click the face on the right can select emoji which use emojionearea css and js
		-   User can select color palette from three default linear gradient and a fourth will generate random color theme for current website
		-   private message is displayed with color
