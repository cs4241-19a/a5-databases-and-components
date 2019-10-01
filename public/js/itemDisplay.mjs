import CONSTANTS from './constants.mjs';
const PURCHASED = "card col s8 offset-s2 grey valign-wrapper";
const UNPURCHASED = "card col s8 offset-s2 grey lighten-5 valign-wrapper";

const ADD = 'addition';
const REDUCE = 'reduce';

const ITEM = 'item';
const QTY = 'qty';


const getContainer = function () {
    return document.getElementById('data');
};
export const populateList = function () {
    console.log('refreshing items');
    getContainer().innerHTML = "";
    const body = JSON.stringify('{}');
    fetch(CONSTANTS.GETALL, {
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            items.forEach((item) => {
                insertItem(item);
                console.log('id '+item._id + ' purchased '+item.purchased)
            });
        });
};

/**
 * This takes a json stringif-ied item and adds it to
 * the data
 * @param item - json string
 */
export const insertItem = function (item) {
    let divClass= item.purchased ? PURCHASED : UNPURCHASED;
    //make the checkbox checked if the item is purchased
    let checked = item.purchased? 'checked' : '';
    getContainer().innerHTML +=
        `<div class="${divClass}" id="${item._id}">
    <i class="small material-icons col m1 red-text text-darken-2 clickable ${CONSTANTS.REMOVE_BUTTON}">delete</i>
    <label class="col m1 valign-wrapper center purchase_button">
      <input type="checkbox" name="purchased" ${checked}/>
      <span class="black-text input center"></span>
    </label>
    <input type='text' name='itemName' class='input col m7 tester' value="${item.itemName}" id='${ITEM}${item._id}'>
    <label for="${ITEM}${item._id}"></label>
    <i class="small center material-icons col m1 ${REDUCE} clickable red-text text-lighten-1">remove_circle</i>
    <input type='text' name="qty" class='input col m1 center-align' id='${QTY}${item._id}' value="${item.quantity}"> 
    <label for="${QTY}${item._id}"></label>
    <i class="small center material-icons col m1 ${ADD} clickable green-text text-lighten-1">add_circle</i>
  </div>`;

    console.log("id is " + item._id);
    // Assigning the handlers individually breaks the other listeners so I
    // need to assign them all here.
    attachListeners();
};

const attachListeners = function () {
    let removeButtons = document.getElementsByClassName(CONSTANTS.REMOVE_BUTTON);
    for (const buttons of removeButtons) {
        buttons.onclick = removeItem.bind(buttons);
    }
    let itemNames = document.querySelectorAll("input[name=itemName]");
    itemNames.forEach(itemName=>{
        itemName.addEventListener('keypress', updateName, false);
    });

    let quantities = document.querySelectorAll("input[name=qty]");
    quantities.forEach(quantity=>{
        quantity.addEventListener('keypress', updateName, false);
    });

    let checkboxes = document.querySelectorAll("input[name=purchased]");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', purchaseItem, false);
    });

    let adders = document.querySelectorAll('.'+ADD);
    adders.forEach(adder => {
        adder.addEventListener('click', changeQty(1), false);
    });

    let reducers = document.querySelectorAll('.'+REDUCE);
    reducers.forEach(reducer => {
        reducer.addEventListener('click', changeQty(-1), false);
    });
};
const updateName = function(e){
    //on enter press
    if(e.which===13) {
        e.preventDefault();
        let thisParent = e.target.parentNode;
        let id = thisParent.id;
        let itemName = document.getElementById('' + ITEM + id).value;
        let quantity = document.getElementById('' + QTY + id).value;
        if(!parseInt(quantity)){
            M.toast({html: 'Please enter numeric value for quantity'});
            return false;
        }
        let purchased = thisParent.querySelector('input[name=purchased').checked;
        let body = {
            id: id,
            itemName: itemName,
            purchased: purchased,
            quantity: parseInt(quantity)
        };
        body = JSON.stringify(body);

        fetch(CONSTANTS.UPDATE, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body
        })
            .then((response) => response.json())
            .then(function () {
                console.log("updated name");
            });
        return false;
    }
};

const changeQty = function(modifier){
    return function(e) {
        let thisParent = e.target.parentNode;
        let id = thisParent.id;
        let itemName = document.getElementById('' + ITEM + id).value;
        let quantity = document.getElementById('' + QTY + id).value;
        let purchased = thisParent.querySelector('input[name=purchased').checked;

        let body = {
            id: id,
            itemName: itemName,
            purchased: purchased,
            quantity: parseInt(quantity) + modifier
        };
        console.log(body);
        body = JSON.stringify(body);

        fetch(CONSTANTS.UPDATE, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body
        })
            .then((response) => response.json())
            .then(function () {
                console.log("purchased is " + purchased);
                document.getElementById('' + QTY + id).value = parseInt(quantity) + modifier;
            });
        return false;
    }
};



const removeItem = function () {
    console.log(this);
    let thisParent = this.parentNode;
    let id = thisParent.id;
    const body = JSON.stringify({id: id});
    console.log("the id of removal is " + id);
    fetch(CONSTANTS.REMOVE, {
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            //get rid of the object by calling the parent of the parent
            thisParent.parentNode.removeChild(thisParent);
        });
    return false;
};

const purchaseItem = function (e) {
    let thisParent = e.target.parentNode.parentNode;
    let id = thisParent.id;
    let itemName = document.getElementById(''+ITEM+id).value;
    let quantity = document.getElementById(''+QTY+id).value;
    console.log('quantity selected is '+quantity);
    let purchased=false;

    if (this.checked) {
        thisParent.className=PURCHASED;
        purchased=true;
    } else {
        thisParent.className=UNPURCHASED;
        purchased=false;
    }

    let body = JSON.stringify({
        id: id,
        itemName: itemName,
        purchased: purchased,
        quantity: quantity
    });

    fetch(CONSTANTS.UPDATE, {
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function () {
            console.log("purchased is "+purchased);
        });
    return false;
};

populateList();
attachListeners();