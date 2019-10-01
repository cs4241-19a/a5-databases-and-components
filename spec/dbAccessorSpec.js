const DbAccessor = require('../dbScripts/dbAccessor').DbAccessor;
const GroceryItem = require('../dbScripts/GroceryItem').GroceryItem;
const ListCredentials = require('../dbScripts/ListCredentials').ListCredentials;
const Sqlite3 = require('sqlite3').verbose();

const DB_FILE = './.data/test.db';
const GROCERY_TABLE_NAME = 'GroceryTest';
const LIST_TABLE_NAME = 'ListTest';

//these are copied from the dbAccessor file
const QUANTITY = 'quantity',
    ITEM_NAME = 'itemName',
    PURCHASED = 'purchased',
    CREATOR = 'creator';

const LIST_NAME = 'listName',
    LIST_PASSWORD = 'listPassword';

//
let testDb = new Sqlite3.Database(DB_FILE);

describe("The accessor constructor should", () => {
    afterEach(async function () {
        let deleteTables = new Promise(resolve => {
            testDb.run(`DROP TABLE IF EXISTS ${LIST_TABLE_NAME}`, [], (err => {
                if (err) {
                    throw new Error('Table drop error');
                }
                testDb.run(`DROP TABLE IF EXISTS ${GROCERY_TABLE_NAME}`, [], (err => {
                    if (err) {
                        throw new Error('Table Drop Grocery error')
                    }
                    resolve()
                }))
            }))
        });
        await deleteTables;
    });

    it("should create two DBs when the constructor is run", async function () {
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await testDao.initLists();

        let accessPromise = new Promise(resolve => {
            testDb.all(`SELECT * FROM sqlite_master WHERE type='table'`, [], (err, rows) => {
                if (err) {
                    throw new Error('accessor promise failed');
                }
                expect(rows.length).toBeGreaterThanOrEqual(2);
                resolve();
            })
        });
        await accessPromise;
    });

    it("should initialize the lists with database elements", async function () {
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await DbAccessor.createTables(testDb, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        let add = new Promise(resolve => {
            let done = false;
            testDb.serialize(() => {
                testDb.run(`INSERT INTO ${GROCERY_TABLE_NAME} (${QUANTITY}, ${ITEM_NAME}, ${CREATOR}, ${PURCHASED}) ` +
                    'VALUES (?,?,?,?)', [1, 'testItem', 'KentName', 0], err => {
                    done = true;
                });
                testDb.run(`INSERT INTO ${LIST_TABLE_NAME} (${LIST_NAME}, ${LIST_PASSWORD}) ` +
                    'VALUES (?,?)', ['KentName', 'KentPassword'], err => {
                    if (done) {
                        resolve();
                    }
                });
            })
        });

        await add;
        await testDao.initLists();

        expect(testDao._groceryList.length).toBe(1);
        expect(testDao._listList.length).toBe(1);
    });

    it("should add items to the item db, and should return only items from the creator", async function () {
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await testDao.initLists();
        let testItem = new GroceryItem('test', 'KentName', false, 1);
        await testDao.addGroceryItem(testItem);
        testDb.all(`SELECT * FROM ${GROCERY_TABLE_NAME}`, [], (err, rows) => {
            if (err) {
                throw new Error(err.toString());
            }
            //check that get all items will only return items with a given creator
            expect(rows.length).toBe(1);
            expect(testDao.getAllItems('FakeGuy').length).toBe(0);
            expect(testDao.getAllItems('KentName').length).toBe(1);
        })
    });

    it("should add a credential if unused, and return false if it is used", async function addCredential() {
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await testDao.initLists();
        let firstCred = new ListCredentials('test1', 'test1');
        let sndCred = new ListCredentials(firstCred.listName, firstCred.listPassword);
        expect(testDao.addListCredential(firstCred)).toBe(true);
        expect(testDao.addListCredential(sndCred)).toBe(false);
        //we are assuming this gets added to the db properly
    });
    it("should add an item and toggle the purchase value when the fn is called", async function () {
        let insertId = 1;
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await testDao.initLists();
        //add the item to the id in the db
        testDao.addGroceryItem(new GroceryItem("name", 'KentName', false, 0))
            .then((item) => {
                insertId = item._id;
            });
        //wait for toggle purchase to run
        await testDao.togglePurchase(insertId, true);

        //confirm the output here
        let getPromise = new Promise(resolve => {
            testDb.get(`SELECT * FROM ${GROCERY_TABLE_NAME} WHERE id=${insertId}`, [], function (err, row) {
                if (err) {
                    throw new Error("purchase toggle error");
                }
                let item = GroceryItem.groceryItemFromDB(row);
                expect(item.purchased).toBe(true);
                resolve();
            })
        });
        await getPromise;
    });

    it("should remove an item with a given id when remove is called", async function () {
        let testItem = new GroceryItem("test", 'KentName', false, 0);
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await testDao.initLists();
        let addPromise = new Promise(resolve => {
            testDao.addGroceryItem(testItem)
                .then((item) => {
                    testItem = item;
                    resolve();
                });
        });
        await addPromise;
        let initItemListLen = testDao.getAllItems('KentName').length;
        await testDao.removeGroceryById(testItem.getId());
        let curItemListLen = testDao.getAllItems('KentName').length;
        expect(curItemListLen).toBeLessThan(initItemListLen);
    });
    it("should update the item when updateGroceryItem is called", async function () {
        let testItem = new GroceryItem("test", 'KentName', false, 0);
        let testDao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);
        await testDao.initLists();
        let addPromise = new Promise(resolve => {
            testDao.addGroceryItem(testItem)
                .then((item) => {
                    testItem = item;
                    resolve();
                });
        });
        await addPromise;
        testItem.purchased = true;
        testItem.quantity = 100;
        await testDao.updateGroceryItem(testItem);
        let dbPromise = new Promise(resolve => {
            testDb.get(`SELECT * FROM ${GROCERY_TABLE_NAME} WHERE id=${testItem.getId()}`, [],
                function (err, row) {
                    expect(row.purchased).toBe(1);
                    resolve();
                });
        });
        await dbPromise;
        expect(testDao.getAllItems('KentName').peek().purchased).toBe(true)
    })
});
