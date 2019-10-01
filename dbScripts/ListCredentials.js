class ListCredentials {
    _id;
    listName;
    listPassword;

    /**
     * Create a new list (this is the user object for the grocery list)
     * @param{string} listName
     * @param{string} listPassword
     */
    constructor(listName, listPassword) {
        this.listName = listName;
        this.listPassword = listPassword;
    }

    /**
     *
     * @returns {number}
     */
    getId() {
        return this._id;
    }

    /**
     *
     * @param{number} id
     */
    setId(id) {
        this._id = id;
    }

    /**
     * Convert a sqlite list row entry to a list
     * @param row
     * @returns {ListCredentials}
     */
    static listFromDB(row) {
        let list = new ListCredentials(row.listName, row.listPassword);
        list.setId(row.id);
        return list;
    }
}
exports.ListCredentials=ListCredentials;