 var startingClass =[
    { "Department" : "CS1101",
      "Professor"  : "bob",
      "Room" : "AK116"
    },
    { "Department"  : "ME1800",
      "Professor"  : "Jill",
      "Room" : "SL115"
    },
    { "Department"  : "CS2303",
      "Professor"  : "Andres",
      "Room" : "OH107"
    },
    { "Department"  : "PSY1401",
      "Professor"  : "Brian",
      "Room" : "SL315"
    },
    { "Department"  : "RBE1001",
      "Professor"  : "Megan",
      "Room" : "Flupper"
    },
    { "Department"  : "ECE2049",
      "Professor"  : "Sam",
      "Room" : "Flower"
    },
    { "Department"  : "CS4801",
      "Professor"  : "Emily",
      "Room" : "AK232"
    }
  ]
  var list = [".", "Dept code of Class", "Professor Teaching Class", "Room of Class"];
  var bodyTag = document.getElementsByClassName("body");
  bodyTag.addEventListener("load", myFunction());
  var deptArr = ["Test"];
  var profArr = [];
  var roomArr = [];
  var classesByCat = {
    Add: deptArr,
    Modify: profArr,
    Delete: roomArr
  }
  var testing;

  function myFunction() {   
    var table = document.getElementById("results");
    var header = table.createTHead();
    var row = header.insertRow(0);
    for(var i in list){
      var cell = row.insertCell(0);
      cell.innerHTML = "<strong>"+list[3-i]+"</strong>";
    }
    for(var i in startingClass){
      row = header.insertRow()
      cell = row.insertCell()
      cell.innerHTML = i;
      for(var j = 1; j < 4; j++){
        cell = row.insertCell(j);
        if(j == 1){
          cell.innerHTML = startingClass[i].Department;
        }
        else if(j == 2){
          cell.innerHTML = startingClass[i].Professor;
        }
        else{
          cell.innerHTML = startingClass[i].Room;
        }
      }
    } 
  }