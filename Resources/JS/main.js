// https://stackoverflow.com/questions/26620312/git-installing-git-in-path-with-github-client-for-windows
// how to change the path for using Git commands for windows pc

// Variable Declarations and Function Definitions
const URL = "https://bcmhealthserver.herokuapp.com/"
const localURL = "http://localhost:8000/"

// ``

// async means skip and then come back to it 
// js usually executes in chronoligical order
// Patients displaying 
const getData = async() => {
    let physiosData = await axios.get(`${localURL}physios`)
    let patientsData = await axios.get(`${localURL}patients`),
       {data} = patientsData,
        {data: dataPhysio} = physiosData
     displayUsers(data, dataPhysio)
}

const displayUsers = (data, dataPhysio) => {
    const mainContainer = document.querySelector(".main_container")
    const mainContainer1 = document.querySelector(".main_container1")
    data = data.map(user => 
    `
        <h1>${user.name}<h1>
        <h1>${user.email}<h1>
        <h1>${user.password}<h1>
    `);

    dataPhysio = dataPhysio.map(user => 
        `
            <h1>${user.name}<h1>
            <h1>${user.email}<h1>
            <h1>${user.password}<h1>
        `);

    mainContainer?.insertAdjacentHTML("afterbegin", data)
    mainContainer1?.insertAdjacentHTML("afterbegin", dataPhysio)
}

getData()

// Functionality

// helper functions
const getURLData = () => {
    const params = new URLSearchParams(window.location.search)
    return params
}

function checkUser() {
    getURLData().get("loggedIn") === "true" || sessionStorage.getItem('userId') != null ? sessionStorage.setItem('userId','1234'): window.location='https://bcmhealth.netlify.app/login.html'
  };


//   sessionStorage.setItem('userId','1234')
//   sessionStorage.getItem('userId')
//   sessionStorage.removeItem('userId')}}

// Change button from login to logout if somebody is logged in
// function loginButton() {
//     if(typeof(Storage) !== "undefined") {
//         if (sessionStorage.getItem('userId') !== null ) {
//             <button class="logoutbtn" href="index.html">Logout</button>
//         } else {
//             <button class="loginbtn" href="login.html">Login</button>
//         }}
//       else {
//           document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
//     }};

// loginButton();

// function logoutButton() {
//     if (document.getElementById('.logoutbtn').click === true) {
//         sessionStorage.removeItem('userId')
//     }
// };

// logoutButton();

// Initialization Methods
$(document).ready(async ()=> {
    checkUser()
})