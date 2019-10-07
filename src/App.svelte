<script>
	let boatName
	let meters
	let time
	let rows =[]

	function addRow(){
	{
			console.log("hi")
	    var rows= document.getElementById("rows")
	    var newRow = rows.insertRow()
	    var boat = newRow.insertCell(0)
	    var distance = newRow.insertCell(1)
	    var sec = newRow.insertCell(2)
	    var split = newRow.insertCell(3)
	    var edit = newRow.insertCell(4)
	    var del = newRow.insertCell(5)
			console.log(boatName)
	    boat.innerHTML = boatName
	    distance.innerHTML = meters
	    sec.innerHTML = time
	    split.innerHTML= time*(meters/500)
	  }
	}

</script>

<style>
body{
  background-color: #B3DAF9
}

h1{
  text-align: center
}

h2{
  text-align: center
}

a{
  margin-left:28px
}
table {
  border: 2px solid black
}

th, td {
  border: 1px solid black
}

#mode{
  text-align:center
}

#boatForm {
  text-align:center
}

#sumbitMode{
  display:"block"
}

#results{
  display:"none"
}

#error{
  text-align: center
}

#success{
  text-align: center
}

</style>

<h2>Enter Boatname:</h2>
<input type="string" bind:value={boatName}>
<h2>Enter Meters Traveled:</h2>
<input type="number" bind:value={meters}>
<h2>Enter Time in Seconds:</h2>
<input type="number" bind:value={time}>

<button on:click={addRow}>Add Row</button>

<div id="results">
      <table id="rows">
        <tr style="font-weight:bold;">
          <th>Boat Name</th>
          <th>Meters Travelled (m)</th>
          <th>Time Elapsed (sec)</th>
          <th>Split Per 500m (sec/m)</th>
        </tr>
      </table>
    </div>
