const roomsSelected = () => {
    let btnUpdateRoom = document.querySelector('#btnUpdateRoom')
    let btnAddRoom = document.querySelector('#btnAddRoom')
    let btnDeleteRoom = document.querySelector('#btnDeleteRoom')
    let addNewRoomForm = document.querySelector('#addNewRoomForm')
    let inputRoomName = document.querySelector('#inputRoomName')
    let inputRoomId = document.querySelector('#inputRoomId')
    let inputRoomWidth = document.querySelector('#inputRoomWidth')
    let inputRoomLength = document.querySelector('#inputRoomLength')
    let roomFormSuccessAlert = document.querySelector('#roomFormSuccessAlert')

    btnAddRoom.addEventListener('click', () => {
        let room = getRoom()
         addRoom(room)
    })

    btnUpdateRoom.addEventListener('click', () => {
        let room = getRoom()
        updateRoom(room)
    })

    btnDeleteRoom.addEventListener('click', () => {
        let room = getRoom()
        deleteRoom(room)
    })

    document.querySelector('#divRoomForm').style.display = 'none'
}

const loadAddRoomForm = async () => {
    document.querySelector('#divRoomForm').style.display = 'block'
    btnAddRoom.style.display = ''
    btnUpdateRoom.style.display = 'none'
    btnDeleteRoom.style.display = 'none'
    inputRoomId.value = ''
    inputRoomName.value = ''
    inputRoomWidth.value = ''
    inputRoomLength.value = ''
}

const loadUpdateRoomForm = async (id) => {
    document.querySelector('#divRoomForm').style.display = 'block'
    btnAddRoom.style.display = 'none'
    btnUpdateRoom.style.display = ''
    btnDeleteRoom.style.display = ''

    let requestOptions = getRequestOptions('GET')
    let response = await fetch("/room/find/"+id, requestOptions)
    let result = await response.json()

    inputRoomId.value = result._id
    inputRoomName.value = result.name || ''
    inputRoomWidth.value = result.width || '' 
    inputRoomLength.value = result.length || ''
}

const addRoom = async (room) => {
    room.owner = organizationId
    let raw = JSON.stringify(room);
    let requestOptions = getRequestOptions('POST')
    requestOptions.body = raw
    let response = await fetch("/room", requestOptions)

    if(response.status === 201){
        roomFormSuccessAlert.style.display = 'block'
        setTimeout(() => roomFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
     createRoomNode(result)
     document.querySelector('.lastNode').click()
     clearRoomInputs()
}

const updateRoom = async (room) => {
    let id = inputRoomId.value
    let raw = JSON.stringify(room);
    let requestOptions = getRequestOptions('PATCH')
    requestOptions.body = raw
    let response = await fetch("/room/"+id, requestOptions)
    if(response.status === 200){
        roomFormSuccessAlert.style.display = 'block'
        setTimeout(() => roomFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
    document.getElementById(result._id).innerHTML = result.name
}

const deleteRoom = async (room) => {
    let id = inputRoomId.value
    let requestOptions = getRequestOptions('DELETE')

    let response = await fetch("/room/"+id, requestOptions)
    if(response.status === 200){
        roomFormSuccessAlert.style.display = 'block'
        setTimeout(() => roomFormSuccessAlert.style.display = 'none', 4000)
    }
    let result = await response.json()
    let length = document.querySelectorAll('.active').length
    document.querySelectorAll('.active')[length -1].remove()
    clearRoomInputs()
}

const getRoom = () => {
    return {
        name: inputRoomName.value,
        width: inputRoomWidth.value,
        length: inputRoomLength.value
    }
}

const createRoomNode = (room) => {
    let a = $('<a></a>').text(room.name)
    .attr('class', 'list-group-item list-group-item-action')
    .attr('data-toggle', 'list')
    .attr('href', '#list-room')
    .attr('aria-controls', 'room')
    .attr('id', room._id)
    $('.lastNode').before(a)

    document.getElementById(room._id).onclick = function(){
        loadUpdateRoomForm(room._id)
    }
}

const clearRoomInputs = () => {
    inputGatewayId.value = ''
    inputGatewayName.value = ''
    inputRoomWidth.value = ''
    inputRoomLength.value = ''
}