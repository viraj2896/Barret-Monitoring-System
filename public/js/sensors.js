const sensorsSelected = () => {
    let inputHiddenRoomId = document.querySelector('#inputHiddenRoomId')
    let inputHiddenGatewayId = document.querySelector('#inputHiddenGatewayId')
    let btnUpdateSensor = document.querySelector('#btnUpdateSensor')
    let btnAddSensor = document.querySelector('#btnAddSensor')
    let btnDeleteSensor = document.querySelector('#btnDeleteSensor')
    let inputSensorName = document.querySelector('#inputSensorName')
    let inputSensorPosition = document.querySelector('#inputSensorPosition')
    let inputSensorId = document.querySelector('#inputSensorId')
    let inputSelectRoom = document.querySelector('#inputSelectRoom')
    let inputSelectGateway = document.querySelector('#inputSelectGateway')
    let sensorFormSuccessAlert = document.querySelector('#sensorFormSuccessAlert')

    if(inputHiddenRoomId.value){
        inputSelectRoom.value = inputHiddenRoomId.value
    }
    if(inputHiddenGatewayId.value){
        inputSelectGateway.value = inputHiddenGatewayId.value
    }
    if(!inputSensorId.value){
        btnUpdateSensor.style.display = 'none'
        btnDeleteSensor.style.display = 'none'
    }else{
        btnAddSensor.style.display = 'none'
    }

    btnAddSensor.addEventListener('click', () => {
        let sensor = getSensor()
         addSensor(sensor)
    })

    btnUpdateSensor.addEventListener('click', () => {
        let sensor = getSensor()
        updateSensor(sensor)
    })

    btnDeleteSensor.addEventListener('click', () => {
        let sensor = getSensor()
        deleteSensor(sensor)
    })
}

const addSensor = async (sensor) => {
    sensor.owner = organizationId
    let raw = JSON.stringify(sensor);
    let requestOptions = getRequestOptions('POST')
    requestOptions.body = raw
    let response = await fetch("/sensor", requestOptions)

    if(response.status === 201){
        document.querySelector('#sensors-tab').click()
    }
}

const updateSensor = async (sensor) => {
    let id = inputSensorId.value
    let raw = JSON.stringify(sensor);
    let requestOptions = getRequestOptions('PATCH')
    requestOptions.body = raw
    let response = await fetch("/sensor/"+id, requestOptions)
    if(response.status === 200){
        document.querySelector('#sensors-tab').click()
    }
}

const deleteSensor = async (sensor) => {
    let id = inputSensorId.value
    let requestOptions = getRequestOptions('DELETE')

    let response = await fetch("/sensor/"+id, requestOptions)
    if(response.status === 200){
        document.querySelector('#sensors-tab').click()
    }
}

const getSensor = () => {
    return {
        name: inputSensorName.value,
        position: inputSensorPosition.value,
        room: inputSelectRoom.value,
        gateway: inputSelectGateway.value
    }
}

const clearSensorInputs = () => {
    inputSensorId.value = ''
    inputSensorName.value = ''
    inputSensorPosition.value = ''
    inputSelectRoom.value = ''
    inputSelectGateway.value = ''
}