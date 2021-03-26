// Front end Pusher code got from pusher.com after watching clever programmers 2 videos listed below
// https://youtu.be/BKY0avHeda8
// https://youtu.be/OgOx6Y40-3s 

// ``

class UserManager{
    createUser = async newUser => {
        try {
            const {data: createdUser} = await axios.post(`${local_server_url}users`, newUser)

            // Check for success message
            if(createdUser?.success_msg !== undefined) {
                alert(createdUser?.success_msg)
                setTimeout(() => {
                    window.location = createdUser[0]?.redirectUrl
                }, 2000)
            }

            // Set the Session Key for the user
            GeneralHelperMethodManager.setLoginStatus(createdUser?.user._id)

            // Redirect To Support Page
            window.location = createdUser?.redirectUrl

        } catch (error) {
            
            // Retrieving the errors and assigning first error message and redirectURL
            const {data:errors} = error.response,
            first_error = errors[0],
            first_error_message = first_error.msg;

             // Alert First Error message and redirect to URL specified in first error
            alert(first_error_message)
            setTimeout(() => {
                window.location = first_error.redirectUrl
            }, 2000) 
        }
    }

    // getting all physios and patients
    readAllUsers = async () => {
        try {
            let {data: users} = await axios.get(`${local_server_url}users`)
            return users
        } catch (error) {
            console.log(error)
        }
    }

    // Normal user logging in
    readSingleUser = async userLoggingIn => {
        try {
            const {data: loggedInUser} = await axios.post(`${local_server_url}users/login`, userLoggingIn)

            // Check for and errors
            if(loggedInUser.msg === null) return 

            // Set the Session Key for the user
            GeneralHelperMethodManager.setLoginStatus(loggedInUser.user._id)

            // Redirect To Support Page
            window.location = loggedInUser.redirectUrl

        } catch (error) {
            console.log(error)
        }
    }

    // google strategy OAuth
    // https://www.youtube.com/watch?v=Jgc4SP6fDOs
    // google OAuth user
    readSingleGoogleUser = async () => {
        try {
            const {data: loggedInGoogleUser} = await axios.get(`${local_server_url}auth/google`)

            // Check for and errors
            if(loggedInGoogleUser === null) return

            // Set the Session Key for the user
            GeneralHelperMethodManager.setLoginStatus(loggedInGoogleUser.user._id)

            // Redirect To Support Page
            window.location = loggedInGoogleUser.redirectUrl

        } catch (error) {
            console.log(error)
        }
    }

    readSingleUserById = async userId => {
        try {
            // Error handling
            let errors = [];
            userId = userId  ?? errors.push("Sender is not valid");

            if(errors.length !== 0) return 

            let {data: foundUser} = await axios.get(`${local_server_url}users/${userId}`)

            return foundUser

        } catch (error) {
            console.log(error)
        }
    
    }
    
    updateSingleUser = (userId , updatedData) => {

    }
    deleteSingleUser = userId => {

    }

}

// https://www.youtube.com/watch?v=v2tJ3nzXh8I
// '??' = null or undefined
// '?' = so the code wont crash here if there is no value

class ConversationManager{
    // creating a new conversation and posting it to the server and into the database
    createConversation = async (sender_id, receiver_id, messages = []) => {
        try {
            // Error handling
            let errors = [];
            sender_id = sender_id  ?? errors.push("Sender is not valid");
            receiver_id = receiver_id ?? errors.push("Receiver is not valid");

            if(errors.length !== 0) return 

            // make the conversation object 
            let conversationObject = {
                Sender: sender_id,
                Receiver: receiver_id,
                Messages: messages
            }

            // pass the object to the new conversation route on our backend
            let {data: {_id: conversation_id}} = await axios.post(`${local_server_url}conversations/new_conversation`, conversationObject)
            
            // checking the conversation id is not null
            ValidationHelperMethodManager.checkConversationIdIsValid(conversation_id)

            // returning the id to deal with new conversation
            return conversation_id

        } catch (error) {
            console.log(error)
        }
    }

    // getting all conversations from the database
    readAllConversations = async () => {
        try {
            let {data: conversations} = await axios.get(`${local_server_url}conversations`)
            return conversations
        } catch (error) {
            console.log(error)
        }
    }
    readSingleConversationsMessages = async conversationId => {
        try {

            // Error handling
            let errors = [];
            conversationId = conversationId  ?? errors.push("Sender is not valid");

            if(errors.length !== 0) return 

            // Getting the messages related to the conversation selected by related id
            const {data:conversation_messages_found} = await axios.get(`${local_server_url}conversations/${conversationId}`);

            // Returning the messages related to the conversation
            return conversation_messages_found

        } catch (error) {
            // Retrieving the errors and assigning first error message and redirectURL
            const {data:errors} = error.response,
            first_error = errors[0],
            first_error_message = first_error.msg;

             // Alert First Error message and redirect to URL specified in first error
            alert(first_error_message)
            setTimeout(() => {
                window.location = first_error.redirectUrl
            }, 2000)
        }
    }
    deleteSingleConversation = userId => {

    }
}

class MessageManager{
    // creating a new message and posting it to the server and into the database
    createMessage = async (sender_id, conversation_id, messageContent) => {
        try {
            // Error handling
            let errors = [];
            sender_id = sender_id ?? errors.push("Please have a valid sender id")
            conversation_id = conversation_id ?? errors.push("Please send a valid message");

            if(errors.length !== 0) return

            let userFound = await user_manager.readSingleUserById(sender_id)

            // make the sender object for the message
            let senderObject = {
                "senderName": userFound.name,
                "senderId": sender_id
            }

            // make the Message object 
            let messageObject = {
                "sender": senderObject,
                "Content": messageContent
            }

            // pass the object to the new message route on our backend
            await axios.post(`${local_server_url}conversations/${conversation_id}/new_message`, messageObject)
            

        } catch (error) {
            console.log(error)
        }
    }

    // getting all the messages
    readAllMessages = async () =>  {
        try {
            let {data: conversations} = await axios.get(`${local_server_url}conversations`)
            const messages = conversations.map(conversation => conversation.Messages)
            return messages
        } catch (error) {
            console.log(error)
        }
    }
    readSingleMessage = userId => {

    }
}


class UIHelperMethodManager{
    fillConversationContainerWithConversations = conversations => {
        // Getting conversation container
        const conversation_container = document.querySelector(".chat_sidebar")

        // Creating the html template for conversation
        const conversationHTMLTemplates = 
        conversations
        .filter(conversation => ValidationHelperMethodManager.checkUserLoggedInIDAgainstPeopleInvolvedInConversation(conversation?.Sender?._id , conversation?.Receiver?._id))
        .map(conversation => this.createHTMLTemplateForConversation(conversation))
        .join("")
        
        //Filling the container with the conversation template
        conversation_container.innerHTML = conversationHTMLTemplates
    }

    fillMessageContainerWithConversationRelatedMsgs = conversation => {

        // Getting the messages from selected conversation
        let messages = conversation?.Messages ?? [];

        // Getting messages container
        const messages_container = document.querySelector(".chat_messagecontainer")

        // Creating the html template for a message
        const messageHTMLTemplates = 
        messages
        .map(message => this.createHTMLTemplateForMessage(message))
        .join("")

        // Getting the receiver name 
        let receiver_name = conversation?.Receiver?.name ?? ""
        let conversation_id = conversation?._id ?? ""

        // Filling the container with the messages template
        messages_container.innerHTML = `
        <div class="receiver_name_banner">
            <h1>${receiver_name}</h1>
        </div>
        <div class="message_content_container">
        ${messageHTMLTemplates}
        </div>
        <div class="new_messagecontainer">
            <input type="textbox" name="" id="">
            <button class="submit-btn newmessage_btn" data-id="${conversation_id}">Send Message</button>
        </div>
        `
    }

    dealWithGoogleLoginButtonClick = () => {
        // getting the google login button
        const googleBtn = document.querySelector(".google_container");

        // listen for a click on the button
        $(googleBtn).click(() => {
            // sending google OAuth request with axios
            user_manager.readSingleGoogleUser()
        })
    }

    dealWithConversationContainerClick = () => {
        // getting the conversation containers
        const conversationContainers = [...document.querySelectorAll(".conversation_templatecontainer")];
        
        // Mapping through all conversation containers and listening for a click
        conversationContainers.map( conversationContainer => {
            $(conversationContainer).click(async event => {

                // Remove newMessage color if applied
                event?.currentTarget?.classList?.remove("newMessageFlash")

                // getting the conversation_id and getting all the messages from that conversation
                const conversation_related_messages = await conversation_manager.readSingleConversationsMessages(event?.currentTarget?.dataset?.id)

                // Fill The message Container
                ui_helper_manager.fillMessageContainerWithConversationRelatedMsgs(conversation_related_messages)

                // Deal with New Message Button Click
                $('.newmessage_btn').click(e => {

                    // get textbox content for our new message
                    const textboxContent = ValidationHelperMethodManager.checkMessageContentIsNotNull(e.target.previousElementSibling.value)

                    // Deal with send new message click
                    message_manager.createMessage(sessionStorage.getItem("userId"),e.target.dataset.id, textboxContent)
                })
            })
        })
    }


    dealWithConversationUserButtonClick = () => {
        // Retrieving all conversation user buttons
        const conversationUserButtons = [...document.querySelectorAll(".potential_conversationUser")];
        
        // Utilzing jQuery for the click event
        //https://www.w3schools.com/jquery/jquery_events.asp

        // Mapping through all conversation user buttons and listening for a click
        conversationUserButtons.map(
            conversationUserBtn => $(conversationUserBtn).click(e => {
                // passing the values of receiver and sender to create our new conversation
                const conversation_id = conversation_manager.createConversation(sessionStorage?.getItem("userId"), e.currentTarget?.dataset?.id)

                // checking the conversation id is not null
                ValidationHelperMethodManager.checkConversationIdIsValid(conversation_id)

                // removing possible conversation users pop up
                document.querySelector('.potentialUserConversationListContainerOuter')?.classList.remove('displayGrid');


            }) 
        )
    }

    dealWithNewMessageSentButtonClick = () => {
        // Adding new message to the conversation
        const newMessageButton = [...document.querySelectorAll(".new_messagecontainer")];

        // Waiting for a new message to be selected
        newMessageButton.map( newMessageBtn => 
            $(newMessageBtn).click(e => {
                // passing the values of receiver and sender to create our new message
                const message_id = conversation_manager.createMessage(sessionStorage?.getItem("userId"), e.currentTarget?.dataset?.id)

                // checking the conversation id is not null
                ValidationHelperMethodManager.checkMessageBoxIsNotNull(message_id)
            })
        )
    }

    createHTMLTemplateForConversation = conversation => {
        let last_message = conversation?.Messages[conversation.Messages.length - 1] ?? "",
        last_message_content = last_message?.Content ?? "",
        last_message_date =  last_message?.createdAt?.split("T")[0] ?? "",
        last_message_time =  last_message?.createdAt?.split("T")[1]?.split(".")[0] ?? "",
        last_message_time_data = [last_message_date , last_message_time];

        return `
        <div class="conversation_templatecontainer" data-id="${conversation?._id}">
                    <div class="conversation_templatersmall">
                        <h3>${conversation?.Receiver?.name}</h3>
                        <h3 class="last_message_content">${last_message_content}</h3>
                    </div>
                    <div class="conversation_templatersmall">
                        <sup>${last_message_time_data[1]}</sup>
                        <sup>${last_message_time_data[0]}</sup>
                    </div>
                </div>`
    }

    createHTMLTemplateForMessage = message => {
        // Get message sender
        let message_sender = message?.sender?.senderId ?? "";
    
        // Checking message sender against logged in user and displaying message location and style accordingly
        return `
            <div class="message_templatecontainer ${sessionStorage.getItem("userId") === message_sender ? "messageRight" : "messageLeft"}">
                <h3>${message?.Content}</h3>
            </div>
        `
    }

    dealWithToggleButtons = () => {
        const switcher = document.querySelector(".registertoggle")
        const forms = [...document.querySelectorAll("form")]
        const toggleButtons = [...document.querySelectorAll(".toggleregister_btn")];
        toggleButtons.map(toggleButton => 
            $(toggleButton).click(e => {

                /**
                 * Checks Which toggle button is clicked, which is not and adds their respectives styles
                 */

                // Decides whether toggle needs to go left or not
                if(e.target.dataset.job === "Physio") {
                    switcher.classList.toggle("left10")
                } else {
                    switcher.classList.remove("left10")
                }

                // Decides what the toggle colouring is 
                toggleButtons.filter(toggleButton => toggleButton.dataset.job != e.target.dataset.job).map(toggleButton => toggleButton.classList.remove("switched"))
                e.target.classList.add("switched");



                /**
                 *  Checks which form to show and hide based on the toggle button pressed
                 */
                forms?.filter(form => form?.dataset?.job != e.target?.dataset?.job).map(form => form?.classList?.remove("displayBlock"))
                document.querySelector(`form[data-job="${e.target?.dataset?.job}"]`)?.classList?.add("displayBlock")
            })
        )
    }
    dealWithLogoutBtnClick = () =>  {
        const logout_btn = document.querySelector(".logoutbtn")
        $(logout_btn).click(() => {
            GeneralHelperMethodManager.removeLoginStatus();
            window.location = "index.html"
        })
    }
    displayPossiblePeopleForConversation = (users, conversations) => {

        // filter out the logged in user as they are not involved in conversations
        users = users.filter(user => user._id !== sessionStorage.getItem("userId"))

        // Filtering Conversations By Conversations User Logged In is Involved in
        let involvements = 
        conversations
        .filter(conversation => ValidationHelperMethodManager.checkUserLoggedInIDAgainstPeopleInvolvedInConversation(conversation?.Sender?._id , conversation?.Receiver?._id))
        
        let involvementIds = [];
        involvements.map(conversation  => involvementIds?.push(conversation.Sender?._id, conversation.Receiver?._id))
        involvementIds = involvementIds.filter(id => id !== undefined)

        //Filtering users by ids involved in conversations
        for(const id of involvementIds){
            users = users.filter(user => user._id !== id)
        }

        // Make the possible users HTML templates
        let possible_users_html_templates = users.map(user => this.createPossibleConversationUserTemplateHTML(user)).join("")

        // Fill In Potential People Conversation List With User Templates
        document.querySelector('.potentialUserConversationListContainerInner') ? 
        document.querySelector('.potentialUserConversationListContainerInner').innerHTML = `
        <h1>Select From the Following Users</h1>
        ${possible_users_html_templates}
        ` : 
        null
        
        // Display the Possible List Container
        document.querySelector('.potentialUserConversationListContainerOuter')?.classList.add('displayGrid');

        // Detecting and closing popup when click outside
        $(document).click(e => {
            if(e.target?.classList?.contains('potentialUserConversationListContainerOuter')) {
                e.target?.classList.remove('displayGrid');
            }
        })

    }

    createPossibleConversationUserTemplateHTML = potential_user => {
        return `
            <div class="potential_conversationUser" data-id="${potential_user._id}">
                <h3>${potential_user.name}</h3>
                <h4>(${potential_user.userType})</h4>
            </div>
        `
    }
}

// 
class GeneralHelperMethodManager {
    static getQueryParamsFromURL = () => {
        return new URLSearchParams(window.location.search)
    }
    static getFormDataFromForm = form => {
        let formData = new FormData(form)
        return formData
    }
    static setLoginStatus = userId => {
        sessionStorage.setItem("userId", userId)
    }
    static removeLoginStatus = () => sessionStorage.removeItem("userId")
}


class ValidationHelperMethodManager {
    static checkLoginRedirect = () => sessionStorage.getItem('userId') === null ? window.location=`${netlify_url}login.html` : null
    static checkLoginButtonChange = () => {
        let login_buttons_container_html = "";
        if(sessionStorage.getItem('userId') === null ) {
            login_buttons_container_html =  `
            <div class="patients">
                <a class="loginbtn live" href="login.html">Login</a>
                <a class="registerbtn" href="register.html">Register</a>
            </div>
            `
        } else {
            login_buttons_container_html = `
            <div class="patients">
                <a class="logoutbtn">Logout</a>
            </div>
            `
        }
        document.querySelector(".patients") ? document.querySelector(".patients").innerHTML = login_buttons_container_html : null
    }
    static checkUserLoggedInIDAgainstPeopleInvolvedInConversation = (senderId , receiverId) =>{
    return senderId === sessionStorage.getItem("userId") || receiverId === sessionStorage.getItem("userId") ? true : false
    }

    static checkConversationIdIsValid = conversation_id => {
        return conversation_id !== null ? conversation_id : alert("Please try again, we couldn't create a conversation")
    }

    static checkMessageContentIsNotNull = message_content => {
        return message_content && message_content.length > 0 ? message_content : alert("Please try again, there was no content in the message")
    }
}

// https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw
// https://www.youtube.com/watch?v=5AWRivBk0Gw

// https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg - net ninja
// https://www.youtube.com/watch?v=Ug4ChzopcE4

// https://www.youtube.com/watch?v=T-HGdc8L-7w

// Traversy Media - https://www.youtube.com/watch?v=RBLIm5LMrmc

class FrontEndUI {
    constructor(messages, conversations, users, page_location) {

        //Leaving front-end ui = to this
        FrontEndUI.front_end_ui = this

        // Get all Data Needed and leave equal to global variables
        this.messages = messages;
        this.conversations = conversations;
        this.users = users;

        // If Statement to identify which page we're on and what methods we need to kick off

        if(page_location === "home"){
            this.homePageInit();
        }else if(page_location === "login"){
            this.loginPageInit()
        } else if(page_location === "register"){
            this.registerPageInit()
        } else if(page_location === "education"){
            this.educationPageInit()
        } else if(page_location === "exercise"){
            this.exercisePageInit()
        } else if(page_location === "statistic"){
            this.statisticPageInit()
        } else if(page_location === "support"){
            this.supportPageInit()
        } else if(page_location === "chatPortal"){
            this.chatPortalPageInit()
        } else if(page_location === "privacyPolicy"){
            this.privacyPolicyPageInit()
        } else if(page_location === "termsOfService"){
            this.termsOfServicePageInit()
        } 

    }

    // ______________ Home Page Functions Start ________________
    homePageInit = () => {
        
        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();
    }
    // ______________ Home Page Functions End ________________

    // ______________ Login Page Functions Start ________________
    loginPageInit = () => {

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();

        // Deal With Toggle between Patient and Physio
        ui_helper_manager.dealWithToggleButtons()

        // Automatically click Patient Button 
        document.querySelector(`.toggleregister_btn[data-job="Patient"]`).click()

        // Deal With Form Login 
        FrontEndUI.front_end_ui.dealWithFormLogin()

        // Deal with google OAuth login
        ui_helper_manager.dealWithGoogleLoginButtonClick()

    }
    dealWithFormLogin = () => {
        
        // Get the form Register and deal With Submit 
        const loginForms = [...document.querySelectorAll(".formLogin")];
        loginForms.map(loginForm =>
        $(loginForm).submit(e => {

            // Prevent Default Behavoiur of form
            e.preventDefault();
            e.stopPropagation();

            // Get the form's values 
            const formData = GeneralHelperMethodManager.getFormDataFromForm(loginForm);

            // Make new User Object 
            const userLoggingIn = {
                "email": formData.get('email'),
                "password": formData.get('password'),
            }

            // Login User form DB
            user_manager.readSingleUser(userLoggingIn)


        })
        )
    }
    // ______________ Login Page Functions End ________________

    // ______________ Register Page Functions Start ________________
    registerPageInit = () => {
        
        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();

        // Deal With Toggle between Patient and Physio
        ui_helper_manager.dealWithToggleButtons()

        // Automatically click Patient Button 
        document.querySelector(`.toggleregister_btn[data-job="Patient"]`).click()

        // Deal With Form Register 
        FrontEndUI.front_end_ui.dealWithFormRegister()
    }

    dealWithFormRegister = () => {
        
        // Get the form Register and deal With Submit 
        const registerForms = [...document.querySelectorAll(".formRegister")];
        registerForms.map(registerForm => 
            $(registerForm).submit(e => {

                // Prevent Default Behavoiur of form
                e.preventDefault();
                e.stopPropagation();

                // Get the form's values 
                const formData = GeneralHelperMethodManager.getFormDataFromForm(registerForm);

                // Make new User Object 
                const newUser = {
                    "name": formData.get('name'),
                    "email": formData.get('email'),
                    "password": formData.get('password'),
                    "password2": formData.get('password2'),
                    "userType": e.target.dataset.job,
                    "conversations": []
                }

                // Check if age or location is filled out 
                formData.get("location") !== null ? newUser["location"] = formData.get("location") : null
                formData.get("age") !== null ? newUser["age"] = formData.get("age") : null


                // Create new User in DB
                user_manager.createUser(newUser)

            })
        )
        
    }
    // ______________ Register Page Functions End ________________
    

    // ______________ Education Page Functions Start ________________
    educationPageInit = () => {

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();

    }

    // ______________ Education Page Functions End ________________



    // ______________ Exercise Page Functions Start ________________
    exercisePageInit = () => {

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();
    }

    // ______________ Exercise Page Functions End ________________


    // ______________ Statistic Page Functions Start ________________
    statisticPageInit = () => {

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();
    }

    // ______________ Statistic Page Functions End ________________



    // ______________ Support Page Functions Start ________________
    supportPageInit = () => {
        // Check if user is logged in 
        ValidationHelperMethodManager.checkLoginRedirect()

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();
    }

    // ______________ Support Page Functions End ________________



    // ______________ Chat Portal Page Functions Start ________________
    chatPortalPageInit = () => {

        // Import pusher and set up our channels 
        let pusher = new Pusher('b992bcb8d175d75ddf36', {
            cluster: 'eu'
        });
        
        let conversationChannel = pusher.subscribe('conversations');
        conversationChannel.bind('newConversation', async() => {
            
            // Call function to get all the conversations again to pick up new one
            FrontEndUI.front_end_ui.conversations = await conversation_manager.readAllConversations();

            // Fill the container again which will contain new conversation
            ui_helper_manager.fillConversationContainerWithConversations(FrontEndUI.front_end_ui.conversations);


        });

        let messageChannel = pusher.subscribe('messages');
        messageChannel.bind('newMessage', async conversation_data => {

            // Get the conversation id updated 
            let conversation_id_updated = conversation_data?.change?.documentKey?._id

            // Get the conversation associated with the id gathered from pusher
            let conversation_found = await conversation_manager.readSingleConversationsMessages(conversation_id_updated)

            // Click the container with the associated id
            document.querySelector(`.conversation_templatecontainer[data-id="${conversation_id_updated}"]`).classList.add("newMessageFlash")

            // Fill message container 
            ui_helper_manager.fillMessageContainerWithConversationRelatedMsgs(conversation_found);

        });

        // Check if user is logged in 
        ValidationHelperMethodManager.checkLoginRedirect()

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();

        // Populate conversation container with the conversations
        ui_helper_manager.fillConversationContainerWithConversations(FrontEndUI.front_end_ui.conversations)

        // Deal With Add Conversation Button Click
        $('.plus_container_i').click(() => {

            // Displaying of possible people for a conversation
            ui_helper_manager.displayPossiblePeopleForConversation(FrontEndUI.front_end_ui.users, FrontEndUI.front_end_ui.conversations,)

            // Deal with Possible conversation user button click
            ui_helper_manager.dealWithConversationUserButtonClick();
        })

        // Deal with conversation click
        ui_helper_manager.dealWithConversationContainerClick()

    }

    // ______________ Chat Portal Page Functions End ________________

    // ______________ Privacy Policy Page Functions Start ________________
    privacyPolicyPageInit = () => {

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();
    }

    // ______________ Privacy Policy Page Functions End ________________


    // ______________ Terms of Service Page Functions Start ________________
    termsOfServicePageInit = () => {

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();
    }

    // ______________ Terms of Service Page Functions End ________________

}

// Overall Initialization Method
// Loading the overall project and then the specified page
// Gets all the messages conversations and users and reads them from the database
const bcmHealthWebAppInit = async page_location => {
    const messages = await message_manager.readAllMessages(),
        conversations = await conversation_manager.readAllConversations(),
        users = await user_manager.readAllUsers();

    // This statement line gets it all kicking off
    new FrontEndUI(messages, conversations, users, page_location);

}

// Global Variable Declarations, Class and Function Definitions
// local url aswell as live url so that it can vary 
let errorMessages = [];
const local_server_url = "http://localhost:8000/",
local_client_url = "http://localhost:5500/",
netlify_url = "https://bcmhealth.netlify.app/",
heroku_url = "https://cors-anywhere.herokuapp.com/https://bcmhealthserver.herokuapp.com/", 
message_manager = new MessageManager(),
conversation_manager = new ConversationManager(),
user_manager = new UserManager(),
ui_helper_manager = new UIHelperMethodManager();

// Initialization Methods
// This reads the window and if it includes the text it redirects you to that window location
$(document).ready(() => {
    switch (true) {
        case (/(?:^|\W)index(?:$|\W)/).test(window.location.pathname.toLowerCase()) || (/(?:^|\W)\/(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("home")
            break
        case (/(?:^|\W)login(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("login")
            break
        case (/(?:^|\W)register(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("register")
            break
        case (/(?:^|\W)education(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("education")
            break
        case (/(?:^|\W)exercises(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("exercise")
            break
        case (/(?:^|\W)statistics(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("statistic")
            break
        case (/(?:^|\W)support(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("support")
            break
        case (/(?:^|\W)chatportal(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("chatPortal")
            break
        case (/(?:^|\W)privacypolicy(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("privacyPolicy")
            break
        case (/(?:^|\W)termsofservice(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            bcmHealthWebAppInit("termsOfService")
            break
    }
})