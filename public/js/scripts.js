window.onload = function () {
    const addBtn = document.querySelector('#add-row-btn')
    addBtn.onclick = handleSubmitPerson
    const modifyBtn = document.querySelector('#modify-row-btn')
    modifyBtn.onclick = handleModifyPerson
    const cancelBtn = document.querySelector('#cancel-modify-btn')
    cancelBtn.onclick = cancelModify
    updateTableContent()
    addDropdownMajors()
    console.log('this javascript file was successfully loaded.')
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/**
 * add a row to the table of people
 */
const handleSubmitPerson = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const form = $('#add-form')
    const name = form.find('#input-name').val()
    const birthday = form.find('#input-birthday').val()
    const major = form.find('#select-major').val()

    json = {
        name: name,
        birthday: birthday,
        major: major
    }
    body = JSON.stringify(json)

    fetch('person', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: body
    }).then(function (response) {
        console.log(response)
    })

    updateTableContent();
}

/**
 * Delete a person on server
 */
const handleDeletePerson = function (idx) {
    let path = 'person/' + idx;

    fetch(path, {
        method: 'DELETE'
    }).then(function (response) {
        console.log(response)
    })

    updateTableContent();
}

const sendModifyInfo = function (idx) {
    const tr = $('#people-table').find('tbody').find('tr').eq(idx)
    const name = tr.find('td').eq(0).text()
    const birthday = tr.find('td').eq(1).text()
    const major = tr.find('td').eq(2).text()

    const form = $('#add-form')
    form.find('#input-name').val(name)
    form.find('#input-birthday').val(birthday)
    form.find('#select-major').val(major)

    $('#form-title').text('Modify a person in the table')
    $('#modify-id').text(idx+1)
    $('#add-row-btn').css('display', 'none')
    $('#modify-group').css('display', 'block')
}

const cancelModify = function (e){
    e.preventDefault()

    const form = $('#add-form')
    form.find('#input-name').val('')
    form.find('#input-birthday').val('')
    form.find('#select-major').val('')

    $('#form-title').text('Add a peron to the table')
    $('#add-row-btn').css('display', 'block')
    $('#modify-group').css('display', 'none')
}

/**
 * send POST request to modify person info
 */
const handleModifyPerson = function(e) {
    e.preventDefault()

    let path = 'person/' + ($('#modify-id').text()-1);
    
    const form = $('#add-form')
    const name = form.find('#input-name').val()
    const birthday = form.find('#input-birthday').val()
    const major = form.find('#select-major').val()

    json = {
        name: name,
        birthday: birthday,
        major: major
    }

    body = JSON.stringify(json)

    fetch(path, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: body
    }).then(function (response) {
        console.log(response)
    })

    updateTableContent();
}


/**
 * Add the json/major.json to the dropdown box
 */
const addDropdownMajors = function () {
    $.getJSON("json/major.json", function (data) {
        majors = data.majors
        $.each(majors, function (key, val) {
            $('#select-major').append("<option value='" + val + "'>" + val + "</option>");
        });
    });
}

/**
 * Clear table, fetch data from server, then place people on table
 */
const updateTableContent = function () {
    // clear the table
    $('#people-table').find('tbody').empty()

    // fetch data from the server
    fetch('people', {
        method: 'GET'
    }).then(function (response) {
        console.log(response)
        return response.json()
    }).then(function (data) {
        console.log(data)
        $.each(data, function (idx, person) {
            const tbody = $('#people-table').find('tbody')
            tbody.append(
                $('<tr>')
                    .append($('<th>')
                        .attr('scope', 'row')
                        .text(idx + 1))
                    .append($('<td>')
                        .text(person.name))
                    .append($('<td>')
                        .text(person.birthday))
                    .append($('<td>')
                        .text(person.major))
                    .append($('<td>')
                        .text(person.age))
                    .append($('<td>')
                        .append($('<button>')
                            .attr('type', 'button')
                            .attr('class', 'btn btn-info ml-2')
                            .attr('onclick', 'sendModifyInfo(' + idx + ')')
                            .text('Modify'))
                        .append($('<button>')
                            .attr('type', 'button')
                            .attr('class', 'btn btn-danger ml-2')
                            .attr('onclick', 'handleDeletePerson(' + idx + ')')
                            .text('Delete')))
            );
        })
        return data
    }).catch(function (err){
        console.log(err)
    })
}
