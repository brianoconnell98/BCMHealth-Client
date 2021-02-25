// https://stackoverflow.com/questions/26620312/git-installing-git-in-path-with-github-client-for-windows
// how to change the path for using Git commands for windows pc

// Variable Declarations and Function Definitions
const URL = "https://bcmhealthserver.herokuapp.com/"

// ``

// async means skip and then come back to it 
// js usually executes in chronoligical order
// Patients displaying 
const getPatientsData = async() => {
    let patientsData = await axios.get(`${URL}patients`),
       {patientsdata} = patientsData
     displayUsers(patientsdata)
}

const displayUsers = patientsdata => {
    const mainContainer = document.querySelector(".main_container")
    patientsdata = patientsdata.map(user => 
    `
        <h1>${user.name}<h1>
        <h1>${user.age}<h1>
    `);
    mainContainer.insertAdjacentHTML("afterbegin", patientsdata)
}

getPatientsData()