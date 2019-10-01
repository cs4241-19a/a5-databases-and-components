
//Use and ID of -1 to say this needs to be added, not updated
const INIT_ID = -1;
class GroceryItem{
    _id;
    creator;
    itemName;
    purchased;
    quantity;

    /**
     * Create a new grocery item
     * @param {String} itemName
     * @param {String} creator the username of the creator
     * @param {Boolean} purchased
     * @param {Number} quantity
     */
    constructor(itemName, creator, purchased, quantity){
        this.itemName=itemName;
        this.purchased=purchased;
        this.quantity=quantity;
        this.creator=creator;
    }

    /**
     * Get the ID
     * @returns {Number}
     */
    getId(){
        return this._id;
    }

    /**
     * This creates a groceryItem from a row in the database
     * @return {GroceryItem}
     */
    static groceryItemFromDB(row){
        //because the bool is stored as 1 or 0, we need to update that here
        let purchased = !!row.purchased;
        let groceryItem = new GroceryItem(row.itemName, row.creator, purchased, row.quantity);
        //set the id from the database ID.
        groceryItem._id=row.id;
        return groceryItem;
    }

    /**
     * This creates a groceryItem from a user request
     * @return {GroceryItem}
     */
    static groceryItemFromRequest(request){
        //because the bool is stored as 1 or 0, we need to update that here
        let body = request.body;
        let groceryItem = new GroceryItem(body.itemName, request.user, body.purchased, body.quantity);
        //set the id from the database ID.
        groceryItem._id=parseInt(body.id); //convert to int for comparison
        console.log('item from request ');
        console.log(groceryItem);
        return groceryItem;
    }

    /**
     * see if two grocery items are equal by ids
     * @param {GroceryItem}g1
     * @param {GroceryItem}g2
     * @returns {*}
     */
    static idEqual(g1, g2){
        return g1._id === g2._id;
    }
}
exports.GroceryItem=GroceryItem;