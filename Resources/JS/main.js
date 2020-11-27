// Variable Declarations and Function Definitions
const URL = "https://bcmhealthserver.herokuapp.com/"

// ``

// async means skip and then come back to it 
// js usually executes in chronoligical order

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
    `);
    mainContainer.insertAdjacentHTML("afterbegin", data)
}

getData()