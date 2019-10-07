const addToCart = function(e){
    const addButton = document.querySelector('.addToCart');

    fetch('/addCart', {
        method: 'POST',
        body: JSON.stringify({itemName: input1.value,
            itemQuantity: input2.value,
            itemID: input3.value,
            itemDescription: input4.value}),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {window.location.href = 'main.html'})
};

const editCart = function(e){
    const editButton = document.querySelector('.editCart');

    fetch('/editCart', {
        method: 'POST',
        body: JSON.stringify({itemName: input1.value,
            itemQuantity: input2.value,
            itemID: input3.value,
            itemDescription: input4.value}),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {window.location.href = 'main.html'})
};