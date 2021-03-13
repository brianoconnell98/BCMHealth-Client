// var pusher = new Pusher('b992bcb8d175d75ddf36', {
//     cluster: 'eu'
//   });

//   var channel = pusher.subscribe('my-channel');
//   channel.bind('my-event', function(data) {
//     alert(JSON.stringify(data));
//   });
// // ``

class UserManager{
    createUser = async newUser => {
        try {
            const {data: createdUser} = await axios.post(`${local_server_url}users`, newUser)

            // Check for and errors
            if(createdUser[0].msg === null) return
            else {
                alert(createdUser[0].msg)
                setTimeout(() => {
                    window.location = createdUser[0].redirectUrl
                }, 2000)
            } 

            // Set the Session Key for the user
            GeneralHelperMethodManager.setLoginStatus(createdUser.user._id)

            // Redirect To Support Page
            window.location = createdUser.redirectUrl

        } catch (error) {
            
            // Retrieveing the errors and assigning first error message and redirectURL
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
    readAllUsers = async () => {
        try {
            let {data: users} = await axios.get(`${local_server_url}users`)
            return users
        } catch (error) {
            console.log(error)
        }
    }
    readSingleUser = async userLogggingIn => {
        try {
            const {data: loggedInUser} = await axios.post(`${local_server_url}users/login`, userLogggingIn)

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
    updateSingleUser = (userId , updatedData) => {

    }
    deleteSingleUser = userId => {

    }
}


class ConversationManager{
    createConversation = newData => {
        try {
            
        } catch (error) {
            
        }
    }
    readAllConversations = async () => {
        try {
            let {data: conversations} = await axios.get(`${local_server_url}conversations`)
            return conversations
        } catch (error) {
            console.log(error)
        }
    }
    readSingleConversation = userId => {

    }
    deleteSingleConversation = userId => {

    }
}

class MessageManager{
    createMessage = (newData, conversationId) => {
        try {
            
        } catch (error) {
            
        }
    }
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
        
        //Filling the container with the conversation template
        conversation_container.innerHTML = conversationHTMLTemplates
    }
    createHTMLTemplateForConversation = conversation => {
        return `
        <div class="conversation_templatecontainer">
                    <div class="conversation_templatersmall">
                        <h3>${conversation?.Receiver?.name}</h3>
                        <h3>${conversation?.Messages[conversation.Messages.length - 1]?.Content}</h3>
                    </div>
                    <div class="conversation_templatersmall">
                        <h3>${conversation?.Messages[conversation.Messages.length - 1]?.createdAt}</h3>
                    </div>
                </div>`
        
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



    }

    createPossibleConversationUserTemplateHTML = potential_user => {
        return `
            <div>
                <h3>${potential_user.name}</h3>
            </div>
        `
    }
}

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
    static checkLoginRedirect = () => sessionStorage.getItem('userId') === null ? window.location=`${local_client_url}login.html` : null
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
}



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

    }
    dealWithFormLogin = () => {
        
        // Get the form Register and deal With Submit 
        const formRegister = document.querySelector(".formLogin");
        $(formRegister).submit(e => {

            // Prevent Default Behavoiur of form
            e.preventDefault();
            e.stopPropagation();

            // Get the form's values 
            const formData = GeneralHelperMethodManager.getFormDataFromForm(formRegister);

            // Make new User Object 
            const userLoggingIn = {
                "email": formData.get('email'),
                "password": formData.get('password'),
            }

            // Login User form DB
            user_manager.readSingleUser(userLoggingIn)

        })
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
        const formRegister = document.querySelector(".formRegister");
        $(formRegister).submit(e => {

            // Prevent Default Behavoiur of form
            e.preventDefault();
            e.stopPropagation();

            // Get the form's values 
            const formData = GeneralHelperMethodManager.getFormDataFromForm(formRegister);

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
        // Check if user is logged in 
        ValidationHelperMethodManager.checkLoginRedirect()

        // Check LoginStatus and deal With Login Buttons
        ValidationHelperMethodManager.checkLoginButtonChange();
        ui_helper_manager.dealWithLogoutBtnClick();

        // Populate conversation container with the conversations
        ui_helper_manager.fillConversationContainerWithConversations(FrontEndUI.front_end_ui.conversations)

        // Deal With Add Conversation Button Click
        $('.plus_container').click(() => {

            // Displaying of possible people for a conversation
            ui_helper_manager.displayPossiblePeopleForConversation(FrontEndUI.front_end_ui.users, FrontEndUI.front_end_ui.conversations,)

        })
    }

    // ______________ Chat Portal Page Functions End ________________



}

// Overall Initialization Method
const bcmHealthWebAppInit = async page_location => {
    const messages = await message_manager.readAllMessages(),
        conversations = await conversation_manager.readAllConversations(),
        users = await user_manager.readAllUsers();

    // This statement line gets it all kicking off
    new FrontEndUI(messages, conversations, users, page_location);

}

// Global Variable Declarations, Class and Function Definitions
let errorMessages = [];
const local_server_url = "http://localhost:8000/",
local_client_url = "http://localhost:5500/",
netlify_url = "https://bcmhealth.netlify.app/",
heroku_url = "https://bcmhealthserver.herokuapp.com/", 
message_manager = new MessageManager(),
conversation_manager = new ConversationManager(),
user_manager = new UserManager(),
ui_helper_manager = new UIHelperMethodManager();

// Initialization Methods
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
    }
})