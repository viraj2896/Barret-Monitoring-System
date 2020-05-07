const organizationsFormSelected = () => {
    let btnUpdateOrganization = document.querySelector('#btnUpdateOrganization')
    let btnAddOrganization = document.querySelector('#btnAddOrganization')
    let btnDeleteOrganization = document.querySelector('#btnDeleteOrganization')
    let inputOrganizationId = document.querySelector('#inputOrganizationId')
    let inputOrganizationName = document.querySelector('#inputOrganizationName')
    
    btnAddOrganization.addEventListener('click', () => {
        let organization = getOrganization()
         addOrganization(organization)
    })

    btnUpdateOrganization.addEventListener('click', () => {
        let organization = getOrganization()
        updateOrganization(organization)
    })

    btnDeleteOrganization.addEventListener('click', () => {
        let organization = getOrganization()
        deleteOrganization(organization)
    })

    if(!inputOrganizationId.value){
        organizationId = undefined
        document.querySelector('#main-title').innerHTML = 'Add Organization'
        btnUpdateOrganization.style.display = 'none'
        btnDeleteOrganization.style.display = 'none'
    }else{
        btnAddOrganization.style.display = 'none'
    }
}

const addOrganization = async (organization) => {
    let raw = JSON.stringify(organization);
    let requestOptions = getRequestOptions('POST')
    requestOptions.body = raw
    let response = await fetch("/organizations", requestOptions)

    if(response.status === 201){
        organizationFormSuccessAlert.style.display = 'block'
        setTimeout(() => organizationFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
     createOrganizationNode(result)
     clearOrganizationInputs()
}

const updateOrganization = async (organization) => {
    let raw = JSON.stringify(organization);
    let requestOptions = getRequestOptions('PATCH')
    requestOptions.body = raw
    let response = await fetch("/organizations/"+organizationId, requestOptions)

    if(response.status === 200){
        organizationFormSuccessAlert.style.display = 'block'
        setTimeout(() => organizationFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
    document.querySelector('#main-title').innerHTML = result.name
    document.querySelector('#organization-'+result._id).innerHTML = result.name
}

const deleteOrganization = async (organization) => {
    let requestOptions = getRequestOptions('DELETE')
    let response = await fetch("/organizations/"+organizationId, requestOptions)

    if(response.status === 200){
        location = '/welcome'
    }
}

const getOrganization = () => {
    return {
        name: inputOrganizationName.value
    }
}

const clearOrganizationInputs = () => {
    inputOrganizationName.value = ''
}

const createOrganizationNode = (organization) => {
    let a = $('<a></a>').text(organization.name)
    .attr('class', 'dropdown-item org-menu-item')
    .attr('data-toggle', 'tab')
    .attr('href', '#organizationsDiv')
    .attr('aria-controls', 'organization')
    .attr('id', organization._id)
    $('#addNewOrganization').prev().before(a)

    document.getElementById(organization._id).onclick = function(){
        organizationSelected(organization._id)
    }
}