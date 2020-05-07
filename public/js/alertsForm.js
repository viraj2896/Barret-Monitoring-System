const alertssFormSelected = () => {
  
    let btnAddAlerts= document.querySelector('#btnAddAlerts')
    
    
    btnAddAlerts.addEventListener('click', () => {
        let alert = getAlert()
         addAlert(alert)
    })

    if(!inputAlertId.value){
        alertId = undefined
        document.querySelector('#main-title').innerHTML = 'Add Alert'
        
    }else{
        btnAddAlerts.style.display = 'none'
    }
}

const addAlert = async (alert) => {
    let raw = JSON.stringify(alert);
    let requestOptions = getRequestOptions('POST')
    requestOptions.body = raw
    let response = await fetch("/alerts", requestOptions)

    if(response.status === 201){
        alertFormSuccessAlert.style.display = 'block'
        setTimeout(() => alertFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
     createAlertNode(result)
     clearAlertInputs()
}

const createAlertnNode = (alert) => {
    let a = $('<a></a>').text(alert.name)
    .attr('class', 'dropdown-item org-menu-item')
    .attr('data-toggle', 'tab')
    .attr('href', '#alertsDiv')
    .attr('aria-controls', 'alert')
    .attr('id', alert._id)
    $('#addNewAlert').prev().before(a)

    document.getElementById(alert._id).onclick = function(){
        alertSelected(alert._id)
    }
}