import React, { Component } from 'react';
import './App.css';
import User from './users/User';

class App extends Component {

  state = {
    contacts: [],
    title: "Users List",
    btnActive: false,
    sortedemail: 0,
    sortedname: 0,
    isDoubled: false,
    url: 'https://jsonplaceholder.typicode.com/users'
  }
  componentDidMount() {
    this.fetchData();
  }
  resetInp = () => {
    this.firstNameInp.value = '';
    this.emailInp.value = '';
    document.getElementById('btnR').style.display = 'none';
  }
  fetchData() {
    fetch(this.state.url)
      .then(resp => resp.json())
      .then(data => data.map(user => (
        {
          id: `${user.id}`,
          name: `${user.name}`,
          email: `${user.email}`,
        }
      )))
      .then(contacts => this.setState({
        contacts,
        isLoading: false
      }))
      .catch(error => console.log('parsing failed', error))
  }
  doubled = (e) => {
    // validate email already in array

  }
  addSingleUser = (e) => {
    e.preventDefault();
    let name = this.firstNameInp.value;
    let email = this.emailInp.value;
    let errorCont = document.getElementById("errorSm");
    let errorSmall = document.getElementById("errorContentSm");
    let submitBtn = document.getElementById("submitBtn");

    let i = this.state.contacts.length - 1;
    let emailUp = this.emailInp.value.toUpperCase();

    for (i; i >= 0; i--) {
      console.log(this.state.contacts[i].email.indexOf("Shanna@melissa.tv"));
      let arrUp = this.state.contacts[i].email.toUpperCase();

      if (arrUp.includes(emailUp)) {
        document.getElementById("error").style.display = "flex";
        document.querySelector(".alertICont").style.border = "2px solid #f00";
        document.querySelector(".errorCont .alertICont span").style.color = "#f00";
        document.getElementById("errorContent").innerText = "E-mail already on list";

        this.setState({
          isDoubled: 1
        });
        this.inputToggle();
        break;
      } else {

      }
    }

    if (this.state.contacts.length < 10) {

      if (this.emailInp.value == '') {
        document.getElementById("add").style.animation = "btnAdd .3s";
        //show error

        document.getElementById("error").style.display = "flex";
        document.querySelector(".alertICont").style.border = "2px solid #f00";
        document.querySelector(".errorCont .alertICont span").style.color = "#f00";
        document.getElementById("errorContent").innerText = "Please provide correct E-mail";
      } else {
        document.getElementById("add").style.animation = "btnAdd .3s";
        //show error

        document.getElementById("error").style.display = "flex";
        document.querySelector(".alertICont").style.border = "2px solid #04ab6b";
        document.querySelector(".errorCont .alertICont span").style.color = "#04ab6b";
        document.getElementById("errorContent").innerText = "User added";

        this.firstNameInp.value = '';
        this.emailInp.value = '';
        document.getElementById('btnR').style.display = 'none';
        document.getElementById("emptyInfo").style.display = "none";

        const users = Object.assign([], this.state.contacts);
        users.push({
          name: name,
          email: email
        });
        this.setState({
          contacts: users
        });

        fetch(this.state.url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ name: name, email: email })
        })
          .then(resp => resp.json())
          .then(data => console.log(data))
          .catch(error => console.log("error: ", error))

        this.inputToggle();

      }

    } else {
      submitBtn.setAttribute("disabled", "disabled");

      errorCont.style.display = "block";
      errorSmall.innerText = "List has reached maximum";
      setTimeout(function () {
        submitBtn.removeAttribute("disabled");
        errorCont.style.display = "none";
        errorSmall.innerText = "";
      }, 3000)
      this.setState({
        emailDoubled: false
      });
    }
  }

  deleteSingleUser = (index, e) => {

    const users = Object.assign([], this.state.contacts);
    users.splice(index, 1);
    this.setState({ contacts: users });

    let idOfItem = index + 1;
    let idOfItems = this.state.url + '/' + idOfItem;

    fetch(idOfItems, {
      method: 'DELETE',
    })
      .then(resp => resp.json())
      .then(data => console.log(data))

    if (this.state.contacts.length === 1) {
      let empty = document.getElementById("emptyInfo");
      empty.style.display = "block";
      return false;
    } else {
      return true;
    }
  }

  inputToggle = () => {

    let btnAdd = document.getElementById("add");
    let firstInp = document.getElementById("inpName");
    let error = document.getElementById("error");

    if (this.state.btnActive === false) {

      btnAdd.classList.add("btnAddHid");
      btnAdd.classList.remove("btnAdd");
      error.style.display = "none";

      const that = this;

      setTimeout(function () {
        btnAdd.style.display = "none";
        firstInp.style.marginLeft = "25px";

        that.firstNameInp.focus();
      }, 300);

      this.setState({
        btnActive: true
      });
    } else {
      btnAdd.classList.remove("btnAddHid");
      btnAdd.classList.add("btnAdd");

      btnAdd.style.display = "block";
      firstInp.style.marginLeft = "0px";

      this.setState({
        btnActive: false
      });
    }
  }
  letterCheck = (e) => {
    let errorCont = document.getElementById("errorSm");
    let errorSmall = document.getElementById("errorContentSm");
    let submitBtn = document.getElementById("submitBtn");

    var letters = /^[A-Za-z ]+$/;

    if (this.firstNameInp.value.length > 0 || this.emailInp.value.length > 0) {
      document.getElementById('btnR').style.display = 'inline-block';
    } else {
      document.getElementById('btnR').style.display = 'none';
    }

    if (this.emailInp.value.includes("@") === false && this.emailInp.value.length > 1) {
      submitBtn.setAttribute("disabled", "disabled");

      errorCont.style.display = "block";
      errorSmall.innerText = "Please provide correct E-mail";

      return true;
    } else {
      submitBtn.removeAttribute("disabled");
      errorCont.style.display = "none";
      errorSmall.innerText = "";
    }

    if (this.firstNameInp.value.match(letters) || this.firstNameInp.value === "") {
      submitBtn.removeAttribute("disabled");
      errorCont.style.display = "none";
      errorSmall.innerText = "";

      return true;
    } else {
      //this.firstNameInp.value = strng.substring(0,strng.length-1);
      submitBtn.setAttribute("disabled", "disabled");
      errorCont.style.display = "block";
      errorSmall.innerText = "Name should contain only letters";

      return false;
    }
  }

  sort = (prop, reset) => {
    const users = Object.assign([], this.state.contacts);

    if (this.state[`sorted${prop}`] === 0) {
      let usersSorted = users.sort(function (a, b) { return a[`${prop}`] > b[`${prop}`]; });
      console.log('if');
      this.setState({
        contacts: usersSorted,
        [`sorted${prop}`]: 1,
        [`sorted${reset}`]: 0
      })
    } else {
      console.log('else');
      let usersSortedRev = users.sort(function (a, b) { return a[`${prop}`] < b[`${prop}`]; });
      this.setState({
        contacts: usersSortedRev,
        [`sorted${prop}`]: 0,
        [`sorted${reset}`]: 0
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="allCont">
          <div className="inpCont">
            <div id="add" className="btnAdd" onClick={this.inputToggle}>
              <i className="fas fa-plus-circle iAdd"></i>
              <span>Add user</span>
            </div>
            <form id="addForm" className={this.state.btnActive ? 'addUserForm addUserFormActive' : 'addUserForm'}>
              <input ref={(input) => { this.firstNameInp = input }} title="only letters" maxLength="20" onKeyUp={this.letterCheck} id="inpName" type="text" placeholder="Name..." />
              <input ref={(input) => { this.emailInp = input }} id="inpEmail" type="text" onKeyUp={this.letterCheck} title="Invalid email address" placeholder="Email..." />
              <input type="submit" value="Submit" id="submitBtn" onClick={this.addSingleUser} />
              <span className="resetBtn" id="btnR" onClick={this.resetInp}>Reset fields</span>
            </form>
            <div id="error" className="errorCont">
              <div className="alertICont">
                <span>!</span>
              </div>
              <span id="errorContent">Just an simple error</span>
            </div>
            <div id="errorSm" className="errorContSm">
              <div className="alertICont">
                <span>!</span>
              </div>
              <span id="errorContentSm"></span>
            </div>
          </div>
          <div className="titleCont">
            <div className="listCol">
              <h4 onClick={this.sortId}>LP</h4>
            </div>
            <div className="listCol">
              <h4 onClick={this.sort.bind(this, 'name', 'email')}>User</h4>
            </div>
            <div className="listCol">
              <h4 onClick={this.sort.bind(this, 'email', 'name')}>E-Mail</h4>
            </div>
            <div className="listCol">
            </div>
          </div>
          <div id="emptyInfo" className="emptyInfoCont">
            <h3>No users added</h3>
            <h3>Click on "Add user" button to fill the list</h3>
          </div>
          <ul className="accList">
            {
              this.state.contacts.map((user, index) => {
                return <User key={user.id} position={index} deleteUser={this.deleteSingleUser.bind(this, index)} email={user.email}>{user.name}</User>
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
