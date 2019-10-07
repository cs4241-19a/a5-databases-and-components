const submit = function( e ) {
  var json = {  cat:        document.querySelector( '#catLv' ).value,
                wallcat:    document.querySelector( '#wallCatLv').value,
                axecat:     document.querySelector( '#axeCatLv' ).value,
                grosscat:   document.querySelector( '#grossCatLv').value,
                cowcat:     document.querySelector( '#cowCatLv' ).value,
                birdcat:    document.querySelector( '#birdCatLv').value,
                fishcat:    document.querySelector( '#fishCatLv' ).value,
                lizardcat:  document.querySelector( '#lizardCatLv').value,
                titancat:   document.querySelector( '#titanCatLv' ).value
             } 
  
  fetch( '/updateUnits', {
      method:'POST',
      body:JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    })
  .then( function( response) {
    if ( response.status == 200 ) {
      window.alert("Changes saved!")
    }
  })
}

const deleteAccount = function( e ) {
  if (window.confirm("Are you sure about this?")) {
    fetch( '/deleteAccount', {
        method:'POST'
      })
    .then( function( response) {
      if ( response.status == 200 ) {
        window.location.replace("https://a5-javiermarcos.glitch.me/");
      }
    })
  }
}

window.onload = function() {
  fetch( '/unitData', {
      method:'POST'
    })
    .then(response => response.json())
    .then(response => {
        document.querySelector( '#catLv' ).value = response.cat,
        document.querySelector( '#wallCatLv').value = response.wallcat,
        document.querySelector( '#axeCatLv' ).value = response.axecat,
          
        document.querySelector( '#grossCatLv').value = response.grosscat,
        document.querySelector( '#cowCatLv' ).value = response.cowcat,
        document.querySelector( '#birdCatLv').value = response.birdcat,
          
        document.querySelector( '#fishCatLv' ).value = response.fishcat,
        document.querySelector( '#lizardCatLv').value = response.lizardcat,
        document.querySelector( '#titanCatLv' ).value = response.titancat,
        
        document.querySelector( '#randomText' ).innerHTML=response.splashtext;
        
    })
  const submitButton = document.querySelector( '#submit' )
  submitButton.onclick = submit
  const deleteButton = document.querySelector( '#delete' )
  deleteButton.onclick = deleteAccount
}