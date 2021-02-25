// https://stackoverflow.com/questions/26620312/git-installing-git-in-path-with-github-client-for-windows
// how to change the path for using Git commands for windows pc

// Variable Declarations and Function Definitions
const URL = "https://bcmhealthserver.herokuapp.com/"

// ``

// async means skip and then come back to it 
// js usually executes in chronoligical order
// Patients displaying 
const getData = async() => {
    let patientsData = await axios.get(`${URL}patients`),
       {data} = patientsData
     displayUsers(data)
}

const displayUsers = data => {
    const mainContainer = document.querySelector(".main_container")
    data = data.map(user => 
    `
        <h1>${user.name}<h1>
        <h1>${user.email}<h1>
    `);
    mainContainer.insertAdjacentHTML("afterbegin", data)
}

getData()