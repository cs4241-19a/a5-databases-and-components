// client-side js
// run by the browser each time your view template referencing it is loaded


let dreams = [];
let userData = '';

// define variables that reference elements on our page
const myPostsList = document.getElementById('entry-section');


// a helper function to call when our request for data is done
const getGetListener = function() {
  // parse our response to convert to JSON
  let postData = JSON.parse(this.responseText);
  userData = postData.userData;
  showCorBtn();
  // iterate through every entry and add it to the page
  console.log(postData.rows);
  postData.rows.forEach( function(row) {
    listMyPosts(row);
  });
  if($('#entry-section').children().length<1){
    let loginToSeePosts = document.createElement('li');
    loginToSeePosts.innerHTML = "Be sure to sign in to see or make posts!";
    myPostsList.appendChild(loginToSeePosts);
  }
  $('body').addClass('wingdinger');
  
}

// request the dreams from our app's sqlite database
const databaseRequest = new XMLHttpRequest();
databaseRequest.onload = getGetListener;
databaseRequest.open('get', '/getPosts');
databaseRequest.withCredentials = true;
databaseRequest.send();

// a helper function that creates a list item for a given dream
const listMyPosts = function(postInfo) {
  if(postInfo.userID == userData.id){
    let newListItem = document.createElement('li');
    newListItem.classList.add('post-li');
    
    let textP = document.createElement('p');
    textP.innerHTML = postInfo.title;

    let idDiv = document.createElement('div');
    idDiv.innerHTML = postInfo.id;
    idDiv.setAttribute("style", "display: none");
    idDiv.classList.add("post-id");

    let delBtn = document.createElement('button');
    delBtn.setAttribute("type", "button");
    delBtn.classList.add('del-btn');
    delBtn.onclick = function(event){
      event.stopPropagation();
      deletePost(postInfo.id);
      location.reload();
    };

    newListItem.append(textP, idDiv, delBtn);
    newListItem.classList.add('my-post');

    myPostsList.insertBefore(newListItem, myPostsList.childNodes[0]);
  }
  addPost(postInfo.title, postInfo.date, postInfo.body, postInfo.user, postInfo.id);
}


// listen for the form to be submitted and add a new dream when it is
function postPost(event) {

  let em = document.getElementById('editModal');
  let title = em.getElementsByTagName('input')[0].value || userData.name + "'s Newest Post";
  let body = em.getElementsByTagName('textarea')[0].value;
  addToDb(title, body);
  location.reload();
}

function getPostListener(){
  let respVal = JSON.parse(this.responseText).respVal;
}

function addToDb(title, body){
  let today = new Date();
  let date = (today.getMonth()+1)+'-'+today.getDate() + '-'+today.getFullYear();
  date += " @ "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const xmlRequest = new XMLHttpRequest();
  xmlRequest.onload = getPostListener;
  xmlRequest.open('post', '/addToDb');
  xmlRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlRequest.send(JSON.stringify({"title": title, "date": date, "body": body, "user": userData.name, "id": getId(), "userId": userData.id}));
  
  //xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//xmlhttp.send(JSON.stringify({ "email": "hello@user.com", "response": { "name": "Tester" } }));
}

function addPost(postTitle, postDate, postBodyText, postUser, postId){
  
  let outerCont = document.createElement('div');
  outerCont.classList.add('w3-card', 'w3-margin', 'w3-white', 'clickable-post');

  let innerCont = document.createElement('div');
  innerCont.classList.add('w3-container', 'post-title');

  let title = document.createElement('h3');
  title.classList.add('wingdinger', 'searchable-text');
  title.setAttribute("style", "font-weight: bold;");
  title.innerHTML = postTitle;

  let usr = document.createElement('h5');
  usr.classList.add('wingdinger', 'searchable-text');
  usr.setAttribute("style", "color: grey");
  usr.innerHTML = postUser;
  innerCont.append(title, usr);

  let bodyCont = document.createElement('div');
  bodyCont.classList.add('w3-container');

  let postBody = document.createElement('p');
  postBody.classList.add('post-body');
  postBody.innerHTML += postBodyText;

  let divRow = document.createElement('div');
  divRow.classList.add('w3-row');

  let commentNum = document.createElement('div');
  commentNum.classList.add('comment-num', 'm4', 'w3-hide-small');
  
  let commentP = document.createElement('p');
  let spanP = document.createElement('span');
  spanP.classList.add('w3-padding-large', 'w3-right');
  spanP.setAttribute("style", "font-weight: bold;");
  spanP.innerHTML = postDate;
  spanP.classList.add('wingdinger');
  commentP.appendChild(spanP);

  let idDiv = document.createElement('div');
  idDiv.setAttribute("style", "display: none");
  idDiv.innerHTML = postId;
  idDiv.classList.add('post-id');
  
  commentNum.appendChild(commentP);
  divRow.appendChild(commentNum);
  bodyCont.append(postBody, divRow);
  outerCont.append(innerCont, bodyCont, idDiv);

  let pl = document.getElementById('post-list');
  pl.insertBefore(outerCont, pl.childNodes[0]);
}


(function addClicks(){
  $( '#post-list' ).on( 'click', '.clickable-post', function () {
    
    let postTitle = $(this).find('.post-title').html();
    let postBody = $(this).find('.post-body').html();
    let modal  = document.getElementById("myModal");
    modal.style.display = "block";
    
    let titleElt = modal.getElementsByClassName("post-title-holder")[0];
    titleElt.innerHTML = postTitle;
    
    let bodyElt = modal.getElementsByClassName("post-body-holder")[0];
    bodyElt.innerHTML = postBody;
    bodyElt.style.display = "inline-block";
  });
  
  $('#entry-section').on( 'click', '.my-post', function(){
    let clickedId = $(this).find('.post-id').html();
    $('.clickable-post').find('.post-id').each(function(index, value){
      if(value.innerHTML == clickedId){
        $(this).parent().click();
      }
    });
  });
})();

function startNewPost(){
  let modal  = document.getElementById("editModal");
    modal.style.display = "block";
  
  let titleElt = modal.getElementsByClassName("post-title-holder")[0];
  let titleBox = document.createElement('input');
  titleBox.setAttribute("type", "text");
  titleBox.setAttribute("placeholder", "Enter Post Title (in English)");
  titleBox.setAttribute("style", "font-size: 30px");
  titleElt.appendChild(titleBox);
  
  let bodyElt = modal.getElementsByClassName("post-body-holder")[0];
  let bodyBox = document.createElement('textarea');
  bodyBox.setAttribute("style", "height: 90%; width: 100%; white-space: pre-wrap");
  bodyBox.setAttribute("placeholder", "Enter post body. Whadda ya wanna say?");
  bodyElt.setAttribute("style", "height: 400px; padding: 15px");
  bodyElt.appendChild(bodyBox);
  
  
  
  modal.getElementsByClassName("edit-close")[0].onclick = function() {
    modal.style.display = "none";
    titleElt.innerHTML = "";
    bodyElt.innerHTML = "";
  }
  
}

(function initModal(){
  // Get the modals
  var modal = document.getElementById("myModal");
  var editModal = document.getElementById("editModal");

  // Get the <span> element that closes the modal
  var span1 = modal.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span1.onclick = function() {
    modal.style.display = "none";
  }


  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
})();


//sends an alert if the user is browsing on firefox
(function checkBrowser(){
   if ((navigator.userAgent.indexOf("Firefox") != -1)){
     alert('HEY YOU! WELCOME TO ODD BLOG!\n\nUnfortunately Firefox does not support wingdings, so we reccomend you visit us on Google Chrome or Microsoft Edge\n\n(https://a3-dandaman2.glitch.me/)');
   }
 })();


function showCorBtn(){
  if(userData.id < 0){
    $('#googleBtn').show();
    $('.logged-in').hide();
  }else{
    $('#googleBtn').hide();
    $('.logged-in').show();
    $('#profilePic').attr("src", userData.image);
    $('#profileName').html(userData.name);
  }
}

function deletePost(postId){
  const xmlRequest = new XMLHttpRequest();
  xmlRequest.onload = getPostListener;
  xmlRequest.open('post', '/removeFromDb');
  xmlRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlRequest.send(JSON.stringify({"id": postId}));
}

function getId(){
  return '_' + Math.random().toString(36).substr(2, 9);
}

function googleLogin(){
  let a = document.createElement('a');
  a.href = "/auth/google";
  a.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window}));
  //a.click();
}

function logout(){
  const xmlRequest = new XMLHttpRequest();
  xmlRequest.onload = getPostListener;
  xmlRequest.open('post', '/logout');
  xmlRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlRequest.send();
  location.reload();
}

//filters results based on whats typed into the search bar
function searchPosts(searchBar){
  let allPosts = $('.clickable-post');
  let searchVal = searchBar.value;
  allPosts.each(function(index){
    let selPost = $(this);
    let combHTML = '';
    $(this).find('.searchable-text').each(function(index){
      combHTML += $(this).html().toLowerCase();
    });
    if(combHTML.includes(searchVal)){
      selPost.show();
    }else{
      selPost.hide();
    }
  });
}

function switchLangs(){  
  if($('.englisher').length > 0){
    let words = $('.englisher');
    words.addClass('wingdinger');
    words.removeClass('englisher');
  }else{
    let words = $('.wingdinger');
    words.addClass('englisher');
    words.removeClass('wingdinger');
  }
}
