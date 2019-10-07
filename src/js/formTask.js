import React from "react";

export default function task(props) {

  const editList = function (e) {
    e.preventDefault()

    let n = localStorage.getItem('myName')
    let b = localStorage.getItem('myBoard')

    const listName = document.querySelector('#listNameEdit')
    const json = { name: n, Board: b, listNameEdit: listName.value }
    const body = JSON.stringify(json)

    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(function (response) {
        console.log('post response: ', response)
        showToast({
          str: 'List Name Edited',
          time: 2000,
          position: 'bottom'
        })
        return false
      }).then(function () {
      fetch('/receive')
        .then(function (response) {
          return response.json()
        }).then(function (response) {
        let n = localStorage.getItem('myName')
        let b = localStorage.getItem('myBoard')
        console.log(n)
        console.log(Object.keys(response.users).length)
        document.getElementById('nav').style.backgroundColor = response.users[n][b].color
        document.getElementById('bName').innerText = JSON.stringify(response.users[n][b].boardName).replace(/^"(.*)"$/, '$1')
        document.getElementById('usrTxt').innerText = JSON.stringify(response.users[n][b].username).replace(/^"(.*)"$/, '$1')
        document.getElementById('listTextH').innerText = JSON.stringify(response.users[n][b].lists[1].listname).replace(/^"(.*)"$/, '$1')
        console.log('get response: ', response)
      })
    })

    return true
  }

  const add = function (e) {
    e.preventDefault()

    let n = localStorage.getItem('myName')
    let b = localStorage.getItem('myBoard')
    let tn = localStorage.getItem('taskNumber')

    console.log(tn)

    let taskno = parseInt(tn) + 1
    localStorage.setItem('taskNumber', taskno.toString())

    const task = document.querySelector('#listEleAdd')
    const taskDesc = document.querySelector('#listEleDesc')
    const due = document.querySelector('#listEleDue')
    const json = {
      name: n,
      Board: b,
      taskName: task.value,
      taskDes: taskDesc.value,
      dueDate: due.value,
      taskNum: taskno.toString()
    }
    const body = JSON.stringify(json)

    console.log(localStorage.getItem('taskNumber'))

    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(function (response) {
        console.log('post response: ', response)
        showToast({
          str: 'Task Added',
          time: 2000,
          position: 'bottom'
        })
        return false
      }).then(function () {
      fetch('/receive')
        .then(function (response) {
          return response.json()
        }).then(function (response) {
        let n = localStorage.getItem('myName')
        let b = localStorage.getItem('myBoard')
        console.log(n)
        console.log(Object.keys(response.users).length)
        document.getElementById('nav').style.backgroundColor = response.users[n][b].color
        document.getElementById('bName').innerText = JSON.stringify(response.users[n][b].boardName).replace(/^"(.*)"$/, '$1')
        document.getElementById('usrTxt').innerText = JSON.stringify(response.users[n][b].username).replace(/^"(.*)"$/, '$1')
        document.getElementById('listTextH').innerText = JSON.stringify(response.users[n][b].lists[1].listname).replace(/^"(.*)"$/, '$1')
        console.log('get response: ', response)

        let t = parseInt(localStorage.getItem('taskNumber'))

        for (let f = 0; f < 10000; f++) {}

        let str = '<ul style="list-style: none" >'
        for (let i = 1; i <= t; i++) {
          let ref = response.users[n][b].lists[1].tasks[i]
          if (ref !== null && ref !== undefined) {
            let col1 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskName).replace(/^"(.*)"$/, '$1')
            let col2 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDesc).replace(/^"(.*)"$/, '$1')
            let col3 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDue).replace(/^"(.*)"$/, '$1')
            str += '<li>' + '<a class="task1">' + '<br>' + i + '. ' + col1 + ':' + '</br>' + '</a>' + '<a class="task2">' + '<b> Task Desc: </b>' + col2 + '<br>' + '</a>' + '<a class="task3">' + '<b> Due By: </b>' + col3 + '</a>' + '</li>'
          }
        }
        str += '</ul>'
        document.getElementById('tasks').innerHTML = str
      })
    })
    return true
  }

  const editTask = function (e) {
    e.preventDefault()

    let n = localStorage.getItem('myName')
    let b = localStorage.getItem('myBoard')

    const taskN = document.querySelector('#listEleEditM')
    const taskNam = document.querySelector('#listEleEditN')
    const taskDe = document.querySelector('#listEleEditD')
    const taskDu = document.querySelector('#listEleEditT')
    const json = {
      name: n,
      Board: b,
      taskNum: taskN.value,
      taskName: taskNam.value,
      taskDes: taskDe.value,
      dueDate: taskDu.value,
      diff: 'yes'
    }
    const body = JSON.stringify(json)

    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(function (response) {
        console.log('post response: ', response)
        showToast({
          str: 'Task Edited',
          time: 2000,
          position: 'bottom'
        })
        return false
      }).then(function () {
      fetch('/receive')
        .then(function (response) {
          return response.json()
        }).then(function (response) {
        let n = localStorage.getItem('myName')
        let b = localStorage.getItem('myBoard')
        console.log(n)
        console.log(Object.keys(response.users).length)
        document.getElementById('nav').style.backgroundColor = response.users[n][b].color
        document.getElementById('bName').innerText = JSON.stringify(response.users[n][b].boardName).replace(/^"(.*)"$/, '$1')
        document.getElementById('usrTxt').innerText = JSON.stringify(response.users[n][b].username).replace(/^"(.*)"$/, '$1')
        document.getElementById('listTextH').innerText = JSON.stringify(response.users[n][b].lists[1].listname).replace(/^"(.*)"$/, '$1')
        console.log('get response: ', response)

        let t = parseInt(localStorage.getItem('taskNumber'))

        for (let f = 0; f < 10000; f++) {}

        let str = '<ul style="list-style: none" >'
        for (let i = 1; i <= t; i++) {
          let ref = response.users[n][b].lists[1].tasks[i]
          if (ref !== null && ref !== undefined) {
            let col1 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskName).replace(/^"(.*)"$/, '$1')
            let col2 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDesc).replace(/^"(.*)"$/, '$1')
            let col3 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDue).replace(/^"(.*)"$/, '$1')
            str += '<li>' + '<a class="task1">' + '<br>' + i + '. ' + col1 + ':' + '</br>' + '</a>' + '<a class="task2">' + '<b> Task Desc: </b>' + col2 + '<br>' + '</a>' + '<a class="task3">' + '<b> Due By: </b>' + col3 + '</a>' + '</li>'
          }
        }
        str += '</ul>'
        document.getElementById('tasks').innerHTML = str
      })
    })
    return true
  }

  const delTask = function (e) {
    e.preventDefault()

    let n = localStorage.getItem('myName')
    let b = localStorage.getItem('myBoard')

    const delTaskN = document.querySelector('#listEleDel')
    const json = { name: n, Board: b, taskNum: delTaskN.value, diff: 'yes', defDiff: 'yes' }
    const body = JSON.stringify(json)

    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(function (response) {
        console.log('post response: ', response)
        showToast({
          str: 'Task Deleted',
          time: 2000,
          position: 'bottom'
        })
        return false
      }).then(function () {
      fetch('/receive')
        .then(function (response) {
          return response.json()
        }).then(function (response) {
        let n = localStorage.getItem('myName')
        let b = localStorage.getItem('myBoard')
        console.log(n)
        console.log(Object.keys(response.users).length)
        document.getElementById('nav').style.backgroundColor = response.users[n][b].color
        document.getElementById('bName').innerText = JSON.stringify(response.users[n][b].boardName).replace(/^"(.*)"$/, '$1')
        document.getElementById('usrTxt').innerText = JSON.stringify(response.users[n][b].username).replace(/^"(.*)"$/, '$1')
        document.getElementById('listTextH').innerText = JSON.stringify(response.users[n][b].lists[1].listname).replace(/^"(.*)"$/, '$1')
        console.log('get response: ', response)

        let t = parseInt(localStorage.getItem('taskNumber'))

        for (let f = 0; f < 10000; f++) {}

        let str = '<ul style="list-style: none" >'
        for (let i = 1; i <= t; i++) {
          let ref = response.users[n][b].lists[1].tasks[i]
          if (ref !== null && ref !== undefined) {
            let col1 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskName).replace(/^"(.*)"$/, '$1')
            let col2 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDesc).replace(/^"(.*)"$/, '$1')
            let col3 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDue).replace(/^"(.*)"$/, '$1')
            str += '<li>' + '<a class="task1">' + '<br>' + i + '. ' + col1 + ':' + '</br>' + '</a>' + '<a class="task2">' + '<b> Task Desc: </b>' + col2 + '<br>' + '</a>' + '<a class="task3">' + '<b> Due By: </b>' + col3 + '</a>' + '</li>'
          }
        }
        str += '</ul>'
        document.getElementById('tasks').innerHTML = str
      })
    })
    return true
  }

  const back = function (e) {
    e.preventDefault()
    window.location = '/'
    return false
  }

  window.onload = function () {
    fetch('/receive')
      .then(function (response) {
        return response.json()
      }).then(function (response) {
      let n = localStorage.getItem('myName')
      let b = localStorage.getItem('myBoard')
      console.log(n)
      console.log(response)
      if (response !== null) {
        localStorage.setItem('taskNumber', JSON.stringify(response.users[n][b].lists[1].taskNums).replace(/^"(.*)"$/, '$1'))
        document.getElementById('nav').style.backgroundColor = response.users[n][b].color
        document.getElementById('bName').innerText = JSON.stringify(response.users[n][b].boardName).replace(/^"(.*)"$/, '$1')
        document.getElementById('usrTxt').innerText = JSON.stringify(response.users[n][b].username).replace(/^"(.*)"$/, '$1')
        document.getElementById('name2').innerText = JSON.stringify(response.users[n][b].fullname).replace(/^"(.*)"$/, '$1')
        document.getElementById('emailId2').innerText = JSON.stringify(response.users[n][b].email).replace(/^"(.*)"$/, '$1')
        document.getElementById('listTextH').innerText = JSON.stringify(response.users[n][b].lists[1].listname).replace(/^"(.*)"$/, '$1')
        let t = parseInt(localStorage.getItem('taskNumber'))

        let str = '<ul style="list-style: none" >'
        for (let i = 1; i <= t; i++) {
          let ref = response.users[n][b].lists[1].tasks[i]
          if (ref !== null && ref !== undefined) {
            let col1 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskName).replace(/^"(.*)"$/, '$1')
            let col2 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDesc).replace(/^"(.*)"$/, '$1')
            let col3 = JSON.stringify(response.users[n][b].lists[1].tasks[i].taskDue).replace(/^"(.*)"$/, '$1')
            str += '<li>' + '<a class="task1">' + '<br>' + i + '. ' + col1 + ':' + '</br>' + '</a>' + '<a class="task2">' + '<b> Task Desc: </b>' + col2 + '<br>' + '</a>' + '<a class="task3">' + '<b> Due By: </b>' + col3 + '</a>' + '</li>'
          }
        }
        str += '</ul>'
        document.getElementById('tasks').innerHTML = str
        console.log('get response: ', response)
      }
    })

    const button1 = document.getElementById('doneBtn')
    button1.onclick = editList

    const button2 = document.getElementById('addBtn')
    button2.onclick = add

    const button3 = document.getElementById('editBtn')
    button3.onclick = editTask

    const button4 = document.getElementById('delBtn')
    button4.onclick = delTask

    const button = document.getElementById('logoutBtn')
    button.onclick = back
  }

  return (
    <React.Fragment>
      <div id="nav" className="Heading">
        <div className="textHead">
          <a className="textH"> TaskTracker : </a>
          <a id="bName"></a>
        </div>
        <div className="logOut">
          <ul className="logList">
            <li className="logItem">
              <div className="logBtn">
                <button id="logoutBtn" className="button btn waves-effect waves-light btn-large">Logout</button>
              </div>
            </li>
            <li className="logItem">
              <div className="logText">
                <a id="usrTxt" className="usrTxt"></a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="lists">
        <table id="listTab" className="listTab">
          <tr id="listRow" className="listRow">
            <td className="listEle">
              <div className="listContent">
                <div className="listHead">
                  <div className="listHeadText1">
                    <p id="listTextH" className="listTextH"></p>
                  </div>
                  <div className="listHeadText2 ">
                    <div className="input-field col s6">
                      <input className="txtBox" type="text" id="listNameEdit">
                        <label htmlFor="listNameEdit">Edit List Name</label>
                      </input>
                    </div>
                    <button id="doneBtn" className="button btn waves-effect waves-light">Done</button>
                  </div>
                </div>
                <div className="listHeadText3">
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleAdd">
                      <label htmlFor="listEleAdd">New Task Name</label>
                    </input>
                  </div>
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleDesc">
                      <label htmlFor="listEleDesc">New Task Description</label>
                    </input>
                  </div>
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleDue">
                      <label htmlFor="listEleDue">New Task Due Date</label>
                    </input>
                  </div>
                  <button id="addBtn" className="button btn waves-effect waves-light">Add</button>
                </div>
                <div className="listHeadText4">
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleDel">
                      <label htmlFor="listEleDel">Delete Task Number</label>
                    </input>
                  </div>
                  <button id="delBtn" className="button btn waves-effect waves-light">Delete</button>
                </div>
                <div className="listHeadText5">
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleEditM">
                      <label htmlFor="listEleEditM">Edit Task Number</label>
                    </input>
                  </div>
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleEditN">
                      <label htmlFor="listEleEditN">Edit Task Name</label>
                    </input>
                  </div>
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleEditD">
                      <label htmlFor="listEleEditD">Edit Task Description</label>
                    </input>
                  </div>
                  <div className="input-field col s6">
                    <input className="txtBox" type="text" id="listEleEditT">
                      <label htmlFor="listEleEditT">Edit Task Due Date</label>
                    </input>
                  </div>
                  <button id="editBtn" className="button btn waves-effect waves-light">Edit</button>
                </div>
                <div id="tasks" className="tasks"></div>
              </div>
            </td>
          </tr>
        </table>
        <div id="addColumn" className="add btn-floating btn-large waves-effect waves-light red">
          <div id="addColumnChild"><b>+</b></div>
        </div>
      </div>
      <div id="bottomInfo" className="bottomInfo">
        <a id="name" className="bt">This is the Workspace of </a>
        <a id="name2" className="bt"></a>
        <a id="emailId" className="bt"> Track your Tasks at </a>
        <a id="emailId2" className="bt"></a>
      </div>
    </React.Fragment>
  )
}
