window.onload = function () {
  fetch('/loadCart')
    .then((res) => console.log(res.json()))
    .then((data) => {
        $('.tbody').remove()
        let tbody = $('<tbody />').appendTo($('.cartFill'))
        let totP=0
        // if(ch1 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 1</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch1}</td>`)
          totP = `${ch1}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch2 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 2</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch2}</td>`)
          totP = `${ch2}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch3 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 3</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch3}</td>`)
          totP = `${ch3}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch4 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 4</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch4}</td>`)
          totP = `${ch4}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch5 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 5</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch5}</td>`)
          totP = `${ch5}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch6 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 6</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch6}</td>`)
          totP = `${ch6}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch7 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 7</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch7}</td>`)
          totP = `${ch7}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch8 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 8</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch8}</td>`)
          totP = `${ch8}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
    })
}

module.exports = { }
