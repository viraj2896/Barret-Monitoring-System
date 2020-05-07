const gatewaysSelected = () => {
    let btnUpdateGateway = document.querySelector('#btnUpdateGateway')
    let btnAddGateway = document.querySelector('#btnAddGateway')
    let btnDeleteGateway = document.querySelector('#btnDeleteGateway')
    let addNewGatewayForm = document.querySelector('#addNewGatewayForm')
    let inputGatewayName = document.querySelector('#inputGatewayName')
    let inputGatewayId = document.querySelector('#inputGatewayId')
    let inputGatewayIp = document.querySelector('#inputGatewayIp')
    let gatewayFormSuccessAlert = document.querySelector('#gatewayFormSuccessAlert')

    btnAddGateway.addEventListener('click', () => {
        let gateway = getGateway()
         addGateway(gateway)
    })

    btnUpdateGateway.addEventListener('click', () => {
        let gateway = getGateway()
        updateGateway(gateway)
    })

    btnDeleteGateway.addEventListener('click', () => {
        let gateway = getGateway()
        deleteGateway(gateway)
    })

    document.querySelector('#divGatewayForm').style.display = 'none'
}

const loadAddGatewayForm = async () => {
    document.querySelector('#divGatewayForm').style.display = 'block'
    btnAddGateway.style.display = ''
    btnUpdateGateway.style.display = 'none'
    btnDeleteGateway.style.display = 'none'
    inputGatewayId.value = ''
    inputGatewayName.value = ''
    inputGatewayIp.value = ''
}

const loadUpdateGatewayForm = async (id) => {
    document.querySelector('#divGatewayForm').style.display = 'block'
    btnAddGateway.style.display = 'none'
    btnUpdateGateway.style.display = ''
    btnDeleteGateway.style.display = ''

    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/gateway/find/"+id, requestOptions)
    let result = await response.json()

    inputGatewayId.value = result._id
    inputGatewayName.value = result.name || ''
    inputGatewayIp.value = result.ip || '' 
}

const addGateway = async (gateway) => {
    gateway.owner = organizationId
    let raw = JSON.stringify(gateway);
    let requestOptions = getRequestOptions('POST')
    requestOptions.body = raw
    let response = await fetch("/gateway", requestOptions)

    if(response.status === 201){
        gatewayFormSuccessAlert.style.display = 'block'
        setTimeout(() => gatewayFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
     createGatewayNode(result)
     clearGatewayInputs()
}

const updateGateway = async (gateway) => {
    let id = inputGatewayId.value
    let raw = JSON.stringify(gateway);
    let requestOptions = getRequestOptions('PATCH')
    requestOptions.body = raw
    let response = await fetch("/gateway/"+id, requestOptions)
    if(response.status === 200){
        gatewayFormSuccessAlert.style.display = 'block'
        setTimeout(() => gatewayFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
    document.getElementById(result._id).innerHTML = result.name
}

const deleteGateway = async (gateway) => {
    let id = inputGatewayId.value
    let requestOptions = getRequestOptions('DELETE')

    let response = await fetch("/gateway/"+id, requestOptions)
    if(response.status === 200){
        gatewayFormSuccessAlert.style.display = 'block'
        setTimeout(() => gatewayFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
    let length = document.querySelectorAll('.active').length
    document.querySelectorAll('.active')[length -1].remove()
    document.querySelector('.lastNode').click()
    clearGatewayInputs()
}

const getGateway = () => {
    return {
        name: inputGatewayName.value,
        ip: inputGatewayIp.value
    }
}

const createGatewayNode = (gateway) => {
    let a = $('<a></a>').text(gateway.name)
    .attr('class', 'list-group-item list-group-item-action')
    .attr('data-toggle', 'list')
    .attr('href', '#list-gateway')
    .attr('aria-controls', 'gateway')
    .attr('id', gateway._id)
    $('.lastNode').before(a)

    document.getElementById(gateway._id).onclick = function(){
        loadUpdateGatewayForm(gateway._id)
    }
}

const clearGatewayInputs = () => {
    inputGatewayId.value = ''
    inputGatewayName.value = ''
    inputGatewayIp.value = ''
}