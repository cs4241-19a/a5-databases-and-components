const checkEntries = function(entries) { // If a box is blank, create a pop up
  for (let entry of entries){
    if (entry === ''){
      window.alert("Please fill in all fields")
      return false
    }
  }
  return true
}

const addData = function( e ) {
    e.preventDefault()
    const addU = document.querySelector( '#addU' ).value,
          addP = document.querySelector( '#addP' ).value,
          addD = document.querySelector( '#addD').value,
          addT = document.querySelector( '#addT' ).value,
          addV = document.querySelector( '#addV' ).value,
          addI = document.querySelector( '#addI' ).value,
          
          json = { username: addU, password: addP, date: addD, time: addT, voltage: addV, current: addI},
          body = JSON.stringify( json )
          console.log(body)
    if (checkEntries([addU, addP, addD, addT, addV, addI])){
      fetch( '/addData', {
      method:'POST',
      body,
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
      }).then( function( response ) {
        console.log(response.headers)
        response.text()
          .then(function (message){
          console.log('Server said back: ', message)
          document.getElementById("serverResponse").innerHTML = message
        })
      }) 
    }    
  }
  
const getData = function( e ){
  e.preventDefault()
     const getU = document.querySelector( '#getU' ).value,
          getP = document.querySelector( '#getP' ).value,
           body = JSON.stringify({username: getU, password: getP})
     if (checkEntries([getU, getP])){
       fetch( '/getData', {
         method:'POST',
         body,
         headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
       })
      .then( function( response ) {
        console.log(response.headers)
        response.text()
          .then(function (message){
          console.log('Server said back: ', message)
          const data = JSON.parse(message)

          const table = document.getElementById("dataTable"),
                rows = table.rows,
                length = rows.length
          for (let i=0; i < length; i++) {table.deleteRow(-1)}

          if (table.rows.length === 0){ //Make sure at least headings are there
            const headerRow = table.insertRow();

            for (let valueName in data[0]){
                const headingName = valueName.charAt(0).toUpperCase() + valueName.slice(1),
                      headingCell = document.createElement("TH")
                headingCell.innerHTML = headingName
                headerRow.appendChild(headingCell)
            }
          }

          // Insert the data
          for (let json of data){
            console.log(json)
            const row = table.insertRow()
            let index = 0
            for ( let key of Object.keys(json)){
              row.insertCell(index).innerHTML = json[key]
              index++
            }
          }
        })
      })
   }
  }

const delData = function( e ){
  e.preventDefault()
  const id = document.querySelector("#delId").value,
        json= {"id": id },
        body = JSON.stringify(json)
  if (checkEntries([id])){
    fetch( '/delData', {
      method:'POST',
      body,
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    })
    .then( function( response ) {
      console.log(response.headers)
      response.text()
      .then(function (message){
      console.log('Server said back: ', message)
      document.getElementById("serverResponse").innerHTML = message
      })
    })
  }
}
  
const modData = function( e ){
  e.preventDefault()
  const modId = document.querySelector( '#modId').value,
        newD = document.querySelector( '#newD').value,
        newT = document.querySelector( '#newT' ).value,
        newV = document.querySelector( '#newV' ).value,
        newI = document.querySelector( '#newI' ).value,
        json = { date: newD, time: newT, voltage: newV, current: newI , id: modId},
        body = JSON.stringify( json )
  if (checkEntries([modId, newD, newT, newV, newI])){
    fetch( '/modData', {
      method:'POST',
      body,
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    }).then( function( response ) {
      response.text()
        .then(function (message){
        console.log('Server said back: ', message)
        document.getElementById("serverResponse").innerHTML = message;
      })
    })
  }
}
  
window.onload = function() {
  document.querySelector( '#addButton' ).onclick = addData
  document.querySelector( '#delButton' ).onclick = delData
  document.querySelector( "#getButton").onclick = getData
  document.querySelector( "#modButton").onclick = modData
  const button = document.getElementByID

}