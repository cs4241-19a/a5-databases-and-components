let palletList;

submitPallet = function(e){
    e.preventDefault();

    const palletName = document.getElementById('palletName');
    const designer = document.getElementById('designer');
    const colorNumber = document.getElementById('colorNumber');
    const inUse = document.getElementById('inUse');
    const ownYes = document.getElementById('ownYes');
    const submitBtn = document.getElementById('submit');

    let palletListSelect = document.querySelector('#palletList');

    for (let i=1; i<palletListSelect.length; i++) {
        palletListSelect.remove(i);
    }

    const newPallet = {
        palletName: palletName.value,
        designer: designer.value,
        colorNumber: colorNumber.value,
        inUse: inUse.value
    };

    palletName.value = "";
    designer.value = "";
    colorNumber.value = 0;
    inUse.checked = false;
    let ele = document.getElementsByName("own");
    for(let i=0;i<ele.length;i++)
        ele[i].checked = false;

    newPallet.own = !!ownYes.checked;
    const body = JSON.stringify(newPallet);
    fetch('/submitPallet', {
        method: 'POST',
        body,
        headers: {'Content-Type': 'application/json'}
    }).catch(err => {
        console.log(err)
    }).then(response => {
        response.json().catch(err => {
            console.log(err);
        }).then(data => {
            palletList = data;
            palletList.forEach(entry => {
                palletListSelect.options[palletListSelect.options.length] = new Option(entry, entry);
            });
        })
    });
    submitBtn.value = 'Submit';
};

getPallet = function(e){
    let pallet;
    e.preventDefault();

    const palletName = document.getElementById('palletName');
    const designer = document.getElementById('designer');
    const colorNumber = document.getElementById('colorNumber');
    const inUse = document.getElementById('inUse');
    const submitBtn = document.getElementById('submit');
    const palletListSelect = document.querySelector('#palletList');
    const deleteBtn = document.getElementById('delete');

    if (palletListSelect.value !== 'newPallet') {
        submitBtn.value = "Update";
        deleteBtn.disabled = false;
        let pallet = {
            palletName: palletListSelect.value
        };
        let body = JSON.stringify(pallet);
        fetch('/getPallet', {
            method: 'POST',
            body,
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            response.json().then(data => {
                palletName.value = data.palletName;
                designer.value = data.designer;
                colorNumber.value = data.colorNumber;
                inUse.value = data.inUse;
                let ele = document.getElementsByName("own");
                if(data.own) {
                    ele[0].checked = true;
                    ele[1].checked = false;
                } else {
                    ele[0].checked = false;
                    ele[1].checked = true;
                }
            })
        })
    } else {
        submitBtn.value = "Submit";
        palletName.value = "";
        deleteBtn.disabled = true;
        designer.value = "";
        colorNumber.value = 0;
        inUse.checked = false;
        let ele = document.getElementsByName("own");
        for(let i=0;i<ele.length;i++)
            ele[i].checked = false;
    }

};

deletePallet = function(e) {
    e.preventDefault();

    const palletName = document.getElementById('palletName');
    const designer = document.getElementById('designer');
    const colorNumber = document.getElementById('colorNumber');
    const inUse = document.getElementById('inUse');
    const submitBtn = document.getElementById('submit');
    const palletListSelect = document.querySelector('#palletList');
    const deleteBtn = document.getElementById('delete');

  const palletToDelete = {
    palletName: palletName.value,
  };

  const body = JSON.stringify(palletToDelete);

  fetch('/deletePallet', {
      method: 'POST',
      body,
      headers: {'Content-Type': 'application/json'}
  }).then(response => {
      response.json().then(palletList => {
          console.log(palletList);
          console.log(palletListSelect);
          for (let i=1; i<palletListSelect.length; i++) {
              palletListSelect.remove(i);
          }
          console.log(palletListSelect);
          palletList.forEach(entry => {
              palletListSelect.options[palletListSelect.options.length] = new Option(entry, entry);
          });
          console.log(palletListSelect);
      });
  });
    submitBtn.value = "Submit";
    palletListSelect.value = "newPallet";
    palletName.value = "";
    deleteBtn.disabled = true;
    designer.value = "";
    colorNumber.value = 0;
    inUse.checked = false;
    let ele = document.getElementsByName("own");
    for(let i=0;i<ele.length;i++)
        ele[i].checked = false;
};

window.onload = function() {
  const palletListSelect = document.querySelector('#palletList');
  const submitBtn = document.querySelector('#submit');
  const deleteBtn = document.getElementById('delete');
    for (let i=1; i<palletListSelect.length; i++) {
        palletListSelect.remove(i);
    }
    fetch( '/palletList', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then( function( response ) {
        response.json().catch(err => {
            console.log(err);
        }).then(palletList => {
            palletList.forEach(entry => {
                palletListSelect.options[palletListSelect.options.length] = new Option(entry, entry);
            });
        });
    });
    submitBtn.onclick = submitPallet;
    palletListSelect.onchange = getPallet;
    deleteBtn.onclick = deletePallet;
};