const GroceryItem = require('./GroceryItem').GroceryItem;
const ListCredentials = require('./ListCredentials').ListCredentials;
const List = require("collections/list");
const Sqlite3 = require('sqlite3').verbose();

const QUANTITY = 'quantity',
    ITEM_NAME = 'itemName',
    PURCHASED = 'purchased',
    CREATOR = 'creator';

const LIST_NAME = 'listName',
    LIST_PASSWORD = 'listPassword';

const LAST_ID = 'last_insert_rowid()';

//TODO remove requriement to wait for db output before returning an answer
class DbAccessor {
    _db;
    _listTableName;
    _groceryTableName;
    _groceryList;
    _listList; //this is a list of the credentials for each grocery list
    _listRowId;
    _groceryListRowId;

    /**
     * Creates the DbAccessor for a give database table.
     * @param {String} dbFilePath
     * @param {String} groceryTableName
     * @param {String} listTableName
     */
    constructor(dbFilePath, groceryTableName, listTableName) {
        this._db = new Sqlite3.Database(dbFilePath);
        this._groceryTableName = groceryTableName;
        this._listTableName = listTableName;
        this._groceryList = new List();
        this._listList = new List();

    }

    static createTables(db, groceryTableName, listTableName) {
        return new Promise((resolve) => {
            let done = false;
            db.run(`CREATE TABLE IF NOT EXISTS ${groceryTableName} (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          ${QUANTITY} INTEGER,
                          ${ITEM_NAME} TEXT,
                          ${CREATOR} TEXT,
                          ${PURCHASED} BOOLEAN)`, [],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                    done = true
                });
            db.run(`CREATE TABLE IF NOT EXISTS ${listTableName} (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          ${LIST_NAME} TEXT,
                          ${LIST_PASSWORD} TEXT)`, [],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                    if (done) {
                        resolve();
                    }
                }
            );
        });
    }

    /**
     * populates the item list of this object
     * @returns {Promise<undefined>}
     */
    async initLists() {
        //TODO have this store the highest ID so we don't have to block on submit requests
        let that = this;
        //create the grocery table and update the list

        await DbAccessor.createTables(that._db, that._groceryTableName, that._listTableName);

        let groceryListPopulate = new Promise(resolve => {
            that._db.all(`SELECT * FROM ${that._groceryTableName}`, [], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                if (rows) {
                    rows.forEach((row) => {
                        that._groceryList.add(GroceryItem.groceryItemFromDB(row));
                    });
                    resolve();
                }
            });
        });
        let listsPopulate = new Promise(resolve => {
            that._db.all(`SELECT * FROM ${that._listTableName}`, [], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                if (rows) {
                    rows.forEach((row) => {
                        that._listList.add(ListCredentials.listFromDB(row));
                        // console.log(that._listList.length);
                    });
                    that._db.get(`SELECT last_insert_rowid()`, [], function (err, row) {
                        that._listRowId = row[LAST_ID];
                        resolve();
                    })
                }
            });
        });
        return new Promise(async function (resolve) {
            await groceryListPopulate;
            await listsPopulate;
            resolve();
        });
    }

    /**
     * This adds an item to the list
     * @param {GroceryItem}item
     * @return {Promise} the id of the added item
     */
    addGroceryItem(item) {
        let that = this;
        this._groceryList.add(item);
        return new Promise(resolve => {
            that._db.run(`INSERT INTO ${that._groceryTableName} (${QUANTITY}, ${ITEM_NAME}, ${CREATOR}, ${PURCHASED}) `
                + 'VALUES (?,?,?,?)',
                [item.quantity, item.itemName, item.creator, item.purchased], function (err) {
                    if (err) {
                        console.log('add error was '+err.toString());
                        resolve(item);
                    }
                    item._id = this.lastID;
                    resolve(item);
                })
        });
    }

    /**
     * This will get the item from the db, then delete it from the list and db
     * @param {number} id the id of the object to delete
     * @returns {List} the updated list (without the object)
     */
    removeGroceryById(id) {
        let that = this;
        let toDelete = null;
        return new Promise(resolve => {
            this._db.serialize(function () {
                console.log(id + " is id to remove");
                console.log(typeof id);
                that._db.get(`SELECT * FROM ${that._groceryTableName} ` + 'WHERE id=?', [id], function (err, row) {
                    if (err) {
                        throw new Error("couldn't get item");
                    }
                    toDelete = GroceryItem.groceryItemFromDB(row);
                });
                that._db.run(`DELETE FROM ${that._groceryTableName} ` + 'WHERE id=?', [id], function (err) {
                    if (err) {
                        throw new Error("couldn't get item");
                    }
                    that._groceryList.delete(toDelete, GroceryItem.idEqual);
                    resolve(that._groceryList)
                });
            });
        });
    }

    /**
     * This will take an item and toggle the purchased field and store it in the db
     * @param {number} id
     * @param {boolean} newPurchaseVal: the value of purchased for this item
     * @return {Promise<number>} the value of purchased
     */
    togglePurchase(id, newPurchaseVal) {
        let that = this;
        let newPurchaseInt = newPurchaseVal ? 1 : 0;
        console.log("given id is " + id +' purchased val is '+newPurchaseInt);
        return new Promise(resolve => {
            that._db.run(`UPDATE ${that._groceryTableName} SET  ${PURCHASED}=${newPurchaseInt} ` +
                'WHERE id=?', [id],
                function (err) {
                    if (err) {
                        throw new Error('SQL command failed');
                    }
                    resolve();
                })
        })
    }
    //update tablename Set purchased=input .. where id =id
    /**
     * updates the fields of an item in the db (except for creator)
     * @param{GroceryItem} item
     * @return {Promise} when the item has been inserted
     */
    updateGroceryItem(item){
        let that = this;

        this._groceryList.delete(item, GroceryItem.idEqual);
        this._groceryList.add(item);
        console.log('grocery list len after is '+this._groceryList.length);
        let purchased = item.purchased ? 1 : 0;
        return new Promise(resolve => {
            that._db.run(`UPDATE ${that._groceryTableName} SET `+QUANTITY+'=?, '+PURCHASED+'=?, '
                +ITEM_NAME+'=? WHERE id=?',[item.quantity, purchased, item.itemName, item.getId()],
                function(err){
                    if(err){
                        throw new Error('update item failed '+err.toString());
                    }
                    resolve();
                })
        })
    }

    /**
     * This gets all grocery items in the table
     * Because of the way the insertions and removals work, this is all of the items
     * in the DB memory
     * @param{string} user
     * @return {List}
     */
    getAllItems(user) {
        return this._groceryList.filter(item => {
            return item.creator === user
        });
    }

    /**LIST CREDENTIAL FUNCTIONS **/

    /**
     * Make sure a credentials doesn't already exist, then add it to the db
     * @param{ListCredentials} credentials
     * @returns {boolean} true if addition was successful
     */
    addListCredential(credentials) {
        console.log('trying to add with '+credentials.listName + ' ' + credentials.listPassword);
        if (this._listList.filter(e => credentials.listName === e.listName).length > 0) {
            console.log('couldnt add credential');
            return false;
        } else {
            this._db.run(`INSERT INTO ${this._listTableName} (${LIST_NAME}, ${LIST_PASSWORD}) ` +
                'VALUES (?,?)', [credentials.listName, credentials.listPassword], err => {
                if(err){
                    throw new Error(err.toString() + 'Credential addition failed');
                }
                credentials.setId(this.lastID);
                console.log('added item to db');
            })
        }
        this._listList.add(credentials);
        return true;
    }
    /**
     * Return all users that we know at the moment
     * @returns {List<ListCredentials>}
     */
    getAllLists() {
        return this._listList;
    }


}

exports.DbAccessor = DbAccessor;