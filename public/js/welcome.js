const roomsTabs = document.querySelector('#rooms-tab')
const gatewaysTabs = document.querySelector('#gateways-tab')
const sensorsTabs = document.querySelector('#sensors-tab')
const mainContent = document.querySelector('#main-content')
const mainTitle = document.querySelector('#main-title')
const addNewOrganization = document.querySelector('#addNewOrganization')
const addNewSensor = document.querySelector('#addNewSensor')
const signOutAll = document.querySelector('#btn-sign-out-all-sessions')
const signOut = document.querySelector('#btn-sign-out')

let organizationId = ''

let getRequestOptions = (method) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + document.cookie.split('=')[1]);

    let requestOptions = {
        method: method,
        headers: myHeaders,
        redirect: 'follow'
    }
    return requestOptions
}

const organizationSelected = async (organizatonId) => {
    let requestOptions = getRequestOptions('GET')
    let organizationResponse = await fetch("/organizations/"+organizatonId,requestOptions)
    let organization = await organizationResponse.json()
    organizationId = organization._id
    mainTitle.innerHTML = organization.name

    let pageResponse = await fetch("/pages/organizations/"+organizatonId, requestOptions)
    let pageResult = await pageResponse.text()
    mainContent.innerHTML = pageResult
}

roomsTabs.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/rooms/"+organizationId, requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    roomsSelected()
})

gatewaysTabs.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/gateways/"+organizationId, requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    gatewaysSelected()
})

sensorsTabs.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/sensors/"+organizationId, requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
})

addNewOrganization.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/organizationsForm", requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    organizationsFormSelected()
})

const loadUpdateOrganization = async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/organizationsForm/"+organizationId, requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    organizationsFormSelected()
}

const loadUpdateSensor = async (id) => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/sensorsForm/"+organizationId+"/"+id, requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    sensorsSelected()
}

addNewSensor.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/sensorsForm/"+organizationId, requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    sensorsSelected()
})

addNewOrganization.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/organizationsForm", requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    organizationsFormSelected()
})

addNewAlert.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/pages/alertsForm", requestOptions)
    let result = await response.text()
    mainContent.innerHTML = result
    alertsFormSelected()
})


signOutAll.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('POST')
    let response = await fetch("/users/logoutAll", requestOptions)
    location = "/"
})

signOut.addEventListener('click', async () => {
    let requestOptions = getRequestOptions('POST')
    let response = await fetch("/users/logout", requestOptions)
    location = "/"
})

document.querySelector('.org-menu-item').click()