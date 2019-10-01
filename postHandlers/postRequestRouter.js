/**
 * This gets the data sent in the request
 * @param request
 * @returns {Promise<String>}
 */
const DbAccessor = require('../dbScripts/dbAccessor').DbAccessor;
const GroceryItem = require('../dbScripts/GroceryItem').GroceryItem;

//intialize the dao so it can be set by the server
let dao = new DbAccessor('', '', '');
//this is for injection of a mock DbAccessor
exports.setDao = function (daoToSet) {
    dao = daoToSet;
};


/**
 *
 * @param request
 * @returns {Promise<List<GroceryItem>>}
 */
exports.getAllGroceryItems = function (request) {
    return new Promise(async function (resolve) {
        //make sure we get all changes to the item list when we send it out
        resolve(dao.getAllItems(request.user));
    });
};
/**
 *
 * @param request
 * @returns {Promise<List<GroceryItem>>}
 */
exports.deleteItem = function (request) {
    return new Promise(resolve => {
        let id = request.body.id.toString();
        id = parseInt(id);
        dao.removeGroceryById(id)
            .then(allItems => {
                console.log(dao.getAllItems(request.user).length);
                resolve(dao.getAllItems(request.user));
            });
    })
};
/**
 *
 * @param request
 * @returns {Promise<GroceryItem>}
 */
exports.addItem = function (request) {
    return new Promise(resolve => {
        let name = request.body.item.toString();
        let qty = parseInt(request.body.qty);
        //what do we do if there's no user
        if(!request.user){
            console.log('no user defined');
            resolve({err: true})
        }else {
            let newItem = new GroceryItem(name, request.user, false, qty);
            dao.addGroceryItem(newItem)
            //we only want single item we added so we have an id
                .then(item => {
                    console.log('adding item ' + item);
                    resolve(item);
                });
        }
    });
};

exports.updateItem = function(request){
    let updatedItem = GroceryItem.groceryItemFromRequest(request);
    //now we have an item from the request
    return new Promise(resolve => {
        //now we've updated the item (which has been tested)
        dao.updateGroceryItem(updatedItem).then(()=>{
            resolve();
        })
    })
};

/**
 *
 * @param request w/JSON of id <number>, purchased<boolean>
 * @returns {Promise<number>}
 */
exports.togglePurchase = function (request) {
    //this will take the id and purchase value as a bool and update it
    console.log('purchased val is '+request.body.purchased);
    return new Promise(resolve => {
            dao.togglePurchase(request.body.id, request.body.purchased).then(() => {
                resolve();
            })
    })
};