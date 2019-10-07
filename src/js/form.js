import React from "react";

class formLogin extends React.Component {
  constructor( props ) {
    super( props )
    this.load()
  }

  load() {
    const button = document.getElementById('continueBtn')
    button.onclick = this.submit

    const button1 = document.getElementById('resBtn')
    button1.onclick = this.res
  }
  submit (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    let body

    const inputName = document.querySelector('#userName')
    const inputFName = document.querySelector('#FName')
    const selectColor = document.querySelector('#color')
    const boardName = document.querySelector('#board')
    const json = {name: inputName.value, fullname: inputFName.value, Color: selectColor.value, Board: boardName.value}

    const signName = document.querySelector('#userN')
    const signBoard = document.querySelector('#boardName')
    const jsonSign = {name: signName.value, Board: signBoard.value}

    window.localStorage

    if (inputName.value === '' && signName.value !== '') {
      body = JSON.stringify(jsonSign)
      localStorage.setItem('myName', signName.value)
      localStorage.setItem('myBoard', signBoard.value)

      showToast({
        str: 'Authenticating User',
        time: 2000,
        position: 'bottom'
      })

      fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
      })
          .then(function (response) {
            console.log(response.status)
            if (response.status === 200) {
              showToast({
                str: 'Successfully Authenticated',
                time: 2000,
                position: 'bottom'
              })
              console.log('post response: ', response)
              window.location = '/task.html'
            } else if (response.status === 401) {
              showToast({
                str: 'Authentication Failed',
                time: 2000,
                position: 'bottom'
              })
              console.log('post response: ', response)
            } else {
              showToast({
                str: 'Unknown Error',
                time: 2000,
                position: 'bottom'
              })
              console.log('post response: ', response)
            }
          })
    } else if (inputName.value !== '' && signName.value === '') {
      body = JSON.stringify(json)
      localStorage.setItem('myName', inputName.value)
      localStorage.setItem('myBoard', boardName.value)

      fetch('/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
      })
          .then(function (response) {
            showToast({
              str: 'Creating Board',
              time: 2000,
              position: 'bottom'
            })
            console.log('post response: ', response)
            window.location = '/task.html'
          })
    } else {
      console.log('error')
    }

    return true
  }

  res (e) {
    e.preventDefault()
    window.location = '/results.html'
    return true
  }

  render () {
    return (
      <React.Fragment>
        <script src="js/materialize.js"></script>
        <script src="js/form.js"></script>
        <script src="js/NavBar.js"></script>
        <script>M.AutoInit();</script>
        <div className="parallax">
          <div className="name">
            <div align="center">
              <div className="typewriter">
                <h1>TaskTracker</h1>
              </div>
            </div>
          </div>
        </div>
        <div id="navB" className="Heading">
          <div className="textHead">
            <a className="textH"> TaskTracker </a>
          </div>
        </div>
        <script> AOS.init();</script>
        <div className="bodyIndex">
          <ul className="bodyList">
            <li className="listItem1">
              <div className="icon">
                <ul className="iconList">
                  <li className="iconItem">
                    <div className="iconImage"></div>
                  </li>
                  <li className="iconItem">
                    <ul className="mottoList">
                      <li className="mottoItem">
                        <div data-aos="fade-right" className="mottoItemCov card green">
                          <p className="iText"> Create Tasks. </p>
                        </div>
                      </li>
                      <li className="mottoItem">
                        <div data-aos="fade-right" className="mottoItemCov card orange">
                          <p className="iText"> Manage Tasks. </p>
                        </div>
                      </li>
                      <li className="mottoItem">
                        <div data-aos="fade-right" className="mottoItemCov card blue">
                          <p className="iText"> Track Tasks. </p>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </li>
            <li className="listItem2">
              <div data-aos="fade-left" className="about card">
                <div className="aboutHead">
                  <h2 className="aboutText"> What is TaskTracker? </h2>
                </div>
                <div className="intro">
                  <p className="introText">
                    TaskTracker is an online tool developed specifically for you to keep a list of things. Organize,
                    track and check of items from lists, whether it's a shopping list
                    or a task list for your chores, and manage all of these lists in a personalized dashboard.
                  </p>
                </div>
                <div className="aboutT">
                  <table className="aboutTab">
                    <tr className="aboutRow">
                      <td className="aboutEle">
                        <div className="imgBrd"></div>
                      </td>
                      <td className="aboutEle">
                        <div className="imgList"></div>
                      </td>
                      <td className="aboutEle">
                        <div className="imgMan"></div>
                      </td>
                    </tr>
                    <tr className="aboutRow">
                      <td className="aboutEle">
                        <div className="textEle"> Personalized Board</div>
                      </td>
                      <td className="aboutEle">
                        <div className="textEle"> Multiple Lists</div>
                      </td>
                      <td className="aboutEle">
                        <div className="textEle"> Task Manager</div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div id="toast" className="getStarted">
          <div data-aos="fade-up" className="getHead">
            <h1 className="headText">Get Started.</h1>
          </div>
          <div className="formDiv">
            <form className="submitForm" action="">
              <div data-aos="zoom-in" className="startForm hoverable">
                <div className="startContent">
                  <table className="expTab">
                    <tr className="row">
                      <td className="headEle1">
                        <div className="ele"> Sign in</div>
                      </td>
                      <td className="headEle">
                        <div className="ele"> Register</div>
                      </td>
                    </tr>
                    <tr className="row">
                      <td className="expEle1">
                        <div className="ele input-field col s6">
                          <input className="txtBox validate" type="text" id="userN">
                            <label htmlFor="userN">Username</label>
                          </input>
                        </div>
                      </td>
                      <td className="expEle">
                        <div className="ele input-field col s6">
                          <input className="txtBox validate" type="text" id="userName">
                            <label htmlFor="userName">Username</label>
                          </input>
                        </div>
                      </td>
                      <td className="expEle">
                        <div className="ele input-field col s6">
                          <input className="txtBox validate" type="text" id="FName">
                            <label htmlFor="FName">Full Name</label>
                          </input>
                        </div>
                      </td>
                    </tr>
                    <tr className="row">
                      <td className="expEle1">
                        <div className="ele input-field col s6">
                          <input className="txtBox validate" type="text" id="boardName">
                            <label htmlFor="boardName">Name of your Board</label>
                          </input>
                        </div>
                      </td>
                      <td className="expEle">
                        <div className="ele">
                          <select id="color" className="selectBox">
                            <option value="" disabled selected>Select a Color Theme</option>
                            <option value="salmon">Salmon</option>
                            <option value="blueviolet">Blue Violet</option>
                            <option value="darkblue">Dark Blue</option>
                            <option value="hotpink">Hot Pink</option>
                            <option value="darkslategray">Dark Slate Gray</option>
                            <option value="orangered">Orange Red</option>
                          </select>
                        </div>
                      </td>
                      <td className="expEle">
                        <div className="ele input-field col s6">
                          <input className="txtBox validate" type="text" id="board">
                            <label htmlFor="board">Name for your Board</label>
                          </input>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div data-aos="zoom-in" className="bten">
                <button id="continueBtn" className="button btn waves-effect waves-light btn-large"><i
                  className="material-icons right">send</i>Continue
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className=" designed">
          <h2 className="designText"> Designed and developed in Worcester, Massachuetts</h2>
          <button id="resBtn" className="button btn waves-effect waves-light">Database</button>
        </div>
      </React.Fragment>
    )
  }
}

export default formLogin