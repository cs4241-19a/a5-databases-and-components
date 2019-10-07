window.onload = function () {
    fetch('/queue')
        .then((res) => res.json())
        .then((data) => {
            $('.results-table tbody').remove()
            $('.results-table thead').css('visibility', 'visible')
            let tbody = $('<tbody />').appendTo($('.results-table'))
            for (let track of data) {
                let date = new Date(track.startTime);
                let timestamp = `${date.getHours()}:${date.getMinutes()}`
                $('<tr>').appendTo(tbody)
                    .append(`<td>${track.ownedByUser ? '<span class="fas fa-trash-alt"></span>' : ''}</td>`)
                    .append(`<td>${track.title}</td>`)
                    .append(`<td>${track.artist}</td>`)
                    .append(`<td style="text-align:right">${timestamp}</td>`)
                    .append(`<td style="display: none">${track.id}</td>`)
            }
        })
    $(document).on('click', '.fa-trash-alt', (e) => {
        let $this = e.target.parentElement.parentElement
        $.post({
            url: '/delete',
            data: {
                id: $this.children[4].innerHTML
            },
            credentials: 'include'
        }, () => {
            // $($this).find("td").fadeOut('slow', () => $(this).parent().remove())
            $($this).fadeOut('slow', () => $(this).remove())
        }).fail((response) => {
            let message = response.responseJSON.message;
            console.log(message)
            let snackbar = $("#snackbar")
            snackbar.html(`Could not delete song: ${message}`)
            snackbar.addClass("show")
            // After 3 seconds, remove the show class from DIV
            setTimeout(() => snackbar.removeClass("show"), 3000);
        })
    })
}
