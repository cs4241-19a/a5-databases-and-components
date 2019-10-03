import CONSTANTS from './constants.mjs';
const PURCHASED = "card col s8 offset-s2 grey valign-wrapper";
const UNPURCHASED = "card col s8 offset-s2 grey lighten-5 valign-wrapper";

const ADD = 'addition';
const REDUCE = 'reduce';

const ITEM = 'item';
const QTY = 'qty';

const e = React.createElement;

let react_items = [];

const getContainer = function () {
    return document.getElementById('data');
};
export const populateList = function () {
    console.log('refreshing items');
    ReactDOM.unmountComponentAtNode(document.getElementById('data'));
    react_items = [];
    const body = JSON.stringify('{}');
    fetch(CONSTANTS.GETALL, {
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            //create a list of react elements
            //then call render on that
            items.forEach((item) => {
                //this will tell react to render everything
                insertItem(item);
                console.log('id '+item._id + ' purchased '+item.purchased);
            });
            console.log(react_items.length);
            ReactDOM.render(react_items, document.getElementById("data"));
            attachListeners();
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
    // let checked = item.purchased? 'checked' : '';
    react_items.push(React.createElement("div", {
        className: `${divClass}`,
        id: `${item._id}`,
        key: item._id
    }, React.createElement("i", {
        className: `small material-icons col m1 red-text text-darken-2 clickable ${CONSTANTS.REMOVE_BUTTON}`
    }, "delete"), React.createElement("label", {
        className: "col m1 valign-wrapper center purchase_button"
    }, React.createElement("input", {
        type: "checkbox",
        name: "purchased",
        defaultChecked: item.purchased
    }), React.createElement("span", {
        className: "black-text input center"
    })), React.createElement("input", {
        type: "text",
        name: "itemName",
        className: "input col m7 tester",
        defaultValue: `${item.itemName}`,
        id: `${ITEM}${item._id}`
    }), React.createElement("label", {
        htmlFor: `${ITEM}${item._id}`
    }), React.createElement("i", {
        className: `small center material-icons col m1 ${REDUCE} clickable red-text text-lighten-1`
    }, "remove_circle"), React.createElement("input", {
        type: "text",
        name: "qty",
        className: "input col m1 center-align",
        id: `${QTY}${item._id}`,
        defaultValue: `${item.quantity}`
    }), React.createElement("label", {
        htmlFor: `${QTY}${item._id}`
    }), React.createElement("i", {
        className: `small center material-icons col m1 ${ADD} clickable green-text text-lighten-1`
    }, "add_circle")));
    console.log("id is " + item._id);
    // Assigning the handlers individually breaks the other listeners so I
    // need to assign them all here.
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
        let purchased = thisParent.querySelector('input[name=purchased]').checked;

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

//  let test_elt = React.createElement("div", {
//             className: `${UNPURCHASED}`,
//             id: "1"
//         }, React.createElement("i", {
//             className: "small material-icons col m1 red-text text-darken-2 clickable remove_button"
//         }, "delete"), React.createElement("label", {
//             className: "col m1 valign-wrapper center purchase_button"
//         }, React.createElement("input", {
//             type: "checkbox",
//             name: "purchased",
//         }), React.createElement("span", {
//             className: "black-text input center"
//         })), React.createElement("input", {
//             type: "text",
//             name: "itemName",
//             className: "input col m7 tester",
//             value: "name",
//             id: "item56"
//         }), React.createElement("label", {
//             htmlFor : "item56"
//         }), React.createElement("i", {
//             className: "small center material-icons col m1 ${REDUCE} clickable red-text text-lighten-1"
//         }, "remove_circle"), React.createElement("input", {
//             type: "text",
//             name: "qty",
//             className: "input col m1 center-align",
//             id: "qty56",
//             value: "56"
//         }), React.createElement("label", {
//             htmlFor: "qty56"
//         }), React.createElement("i", {
//             className: "small center material-icons col m1 add clickable green-text text-lighten-1"
//         }, "add_circle"));
//
//
// ReactDOM.render(test_elt, document.getElementById("data"));