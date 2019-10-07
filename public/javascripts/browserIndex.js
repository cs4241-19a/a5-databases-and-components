function showSaveDialog(dimmer) {
    dimmer.style.display = "block";
}

function hideSaveDialog(dimmer) {
    dimmer.style.display = "none";
}

function saveDialog() {
    let dimmer = document.getElementById("dimmer");
    showSaveDialog(dimmer);
    setTimeout(function() { hideSaveDialog(dimmer); }, 3000);
}

window.onload = setTimeout(function() { document.getElementById('alert').style.display = 'none'; }, 3000);