//import { spring } from 'svelte/motion';
let amountBet = 100;
// initializes card deck and selects cards at random to guess
suits = ["spades", "diams", "clubs", "hearts"];
values = ["A","2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
deck = CreateCleanDeck();
myCards = new Array();


for (ind = 0; ind < 4; ind++)
{
	do {
		pos =  Math.floor((Math.random() * deck.length));
	
	} while (deck[pos].Used == true)
		
	deck[pos].Used = true;
	myCards.push(pos);
}

//presents the same bet as last time if applicable, else bet is default 100
/*
fetch('/allPosts', {
	method: 'post',
	headers: {
			'Content-Type': 'application/json',
			}
}).then(res => res.json())
	.then(data => amountBet = data) 

	
UpdateLog(); */

//ChangeBet(amountBet);



/*	var p = 0
	for (p = 0; p < data.count; p++)
	{
		
		str += " <li> Level: " + data.post[p].level + ", Win: " + data.post[p].win +
			", Bet: " + data.post[p].bet+ " </li> ";
	
	}
	
	str += "</ol> ";
	*/

const e = React.createElement;

class log extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
	 var str = "Here is how you have performed in the past:  ";
    if (this.state.liked) {
      return str;
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Click to view performance'
    );
  }
}

const domContainer = document.querySelector('#actionLog');
ReactDOM.render(e(log), domContainer);



function UpdateLog()
{
	fetch('/allPosts', {
	method: 'post',
	headers: {
			'Content-Type': 'application/json',
			}
}).then(res => res.json())
	.then(function (data) {
	//	serverData = data;
		console.log(data.count);
		document.getElementById('log').innerHTML = "Here is how you have performed in the past: <br> <ol> ";
	for (p = 0; p < data.count; p++)
	{
		
		document.getElementById('log').innerHTML += " <li> Level: " + data.post[p].level + ", Win: " + data.post[p].win +
			", Bet: " + data.post[p].bet+ " </li> ";
	
	}
	
	document.getElementById('log').innerHTML += "</ol> ";
	
	document.getElementById('currentBalance').innerHTML = "Your current balance is: " + data.balance + " <br>";
	
	});
	
	
	
}

/*function ChangeBet(newAmount){
	document.forms['betInput'].elements['amountBet'].value = amountBet;
}	*/
/*
function OnBet()
{
	amountBet = document.forms['betInput'].elements['amountBet'].value;
	
	if (amountBet <= 0)
	{
		window.alert("Please input a bet greater than $0.00");
		amountBet = 100;
		document.forms['betInput'].elements['amountBet'].value = 100;
	}
	return false;
}
*/

/*
function OnAvatar()
{
	path = document.forms['aviForm'].elements['aviFilePath'].files[0].name;
	if (path != "")
	{
		
			  
		console.log("sending")
		fetch( '/avi', {
		  method:'POST',
		  headers: {
				'Content-Type': 'multipart/form-data',
			}, 
		  body: path 
		}) .then( function( response ) {
			console.log("sucessful");
		})
		
		return false;
		
		
	}
	
}
*/

function OnLogin()
{
//	console.log("Clicked");
	username = document.forms['formId'].elements['username'].value;
	password = document.forms['formId'].elements['password'].value;
	
	json = {Username: username, Password: password}
	body = JSON.stringify(json)
		  
	
	fetch( '/login', {
	  method:'POST',
	  headers: {
            'Content-Type': 'application/json',
        },
	  body 
	}) .then( function( response ) {
		console.log("sucessful");
		window.location = "/mainPage.html";
	})
	
	return false;
		

	
	
}


function CheckCard(levelNum)
{
	radioName = 'r'+levelNum;
	cardName = 'c'+levelNum;
	requestName = "card" + parseInt(levelNum+1);
	console.log(requestName);
	var radios = document.getElementsByName(radioName);
	guess = -1;
	for (var i = 0, length = radios.length; i < length; i++)
	{
	 if (radios[i].checked)
	 {
		guess = radios[i].value;
	  // only one radio can be logically checked, don't check the rest
	  break;
	 }
	}
	if (guess == -1)
	{
		console.log("no radio pressed");
		//maybe add some sort of popup
		window.alert("Please make a guess by selecting one of the options below the card");
	}
	
	else
	{
		FlipCard(cardName, levelNum-1);
		win = CalculateWin(levelNum, guess);
		json = {win: win, bet: parseInt(amountBet), level: levelNum}
		SendRequest(json, requestName);
		
	}
	
	UpdateLog();
}


function SendRequest(json, nextLevel)
{
	body = JSON.stringify(json)
			  
		fetch( '/submit', {
		  method:'POST',
		  headers: {
			 'Content-Type': 'application/json',
		  },
		  body 
		})
		.then( function( response ) {
			if (win == true)
			{
				if(nextLevel != "card5")
				{
				document.getElementById(nextLevel).style.visibility = "visible";
			//	console.log("false go back")
				}
			}
			else
			{
				console.log("false");
				// reset window
				setTimeout(function(){ window.location.reload(true)}, 5000);
				
			}		

		})
		return false 

}


function FlipCard(cardID, levelIndex)
{

	c1 = "rank-" + deck[myCards[levelIndex]].Value;
	c2 = "&" + deck[myCards[levelIndex]].Suit;

	s1 = "span" + parseInt(levelIndex+1) + "1";
	s2 = "span" + parseInt(levelIndex+1) + "2";
	
	
	document.getElementById(cardID).classList.add(c1);
	document.getElementById(cardID).classList.add(deck[myCards[levelIndex]].Suit);

	document.getElementById(cardID).classList.remove('back');
	
	document.getElementById(s1).classList.add('rank');
	document.getElementById(s1).innerHTML = deck[myCards[levelIndex]].Value;
	
	document.getElementById(s2).classList.add('suit');
	
}


// CreateCleanDeck: returns a fresh deck of 52 cards.
function CreateCleanDeck() 
{
	deck = new Array();
	suits.forEach(function(suit) {
		
		values.forEach(function(value) {
			card = {Value: value, Suit: suit, Used: false};
			deck.push(card);
			
		});
		
	});
	
	return deck;
}

function MakeCardNumerical(value)
{
	if (value == "J")
	{
		return 11;
	}
	else if (value == "Q")
	{
		return 12;
	}
	else if (value == "K")
	{
		return 13;
	}
	else if (value == "A")
	{
		return 14;
	}
	else
	{ 
		return value;
	}
	
}

function CalculateWin(levelNum, guess)
{
	win = false;
	switch(levelNum)
	{
		case 1:
			console.log(guess);
			console.log(deck[myCards[0]].Suit)
			if ((deck[myCards[0]].Suit == "diams" || deck[myCards[0]].Suit == "hearts") && guess =="1")
			{
				win = true;
			}
			else if ((deck[myCards[0]].Suit == "spades" || deck[myCards[0]].Suit == "clubs") && guess =="0")
			{
				win = true;
			} 
			break;
		case 2:
			current = MakeCardNumerical(deck[myCards[1]].Value);
			previous= MakeCardNumerical(deck[myCards[0]].Value);
			
			
			if((current >= previous) && guess == 0 ) //higher
			{
				win = true;
			}
			else if((previous >= current) && guess == 1) //lower
			{
				win = true;
			}
			break;
		case 3:
			val1 = MakeCardNumerical(deck[myCards[0]].value);
			val2 = MakeCardNumerical(deck[myCards[1]].value);
			actual = MakeCardNumerical(deck[myCards[3]].value);
			
			// in between = 0, outside = 1;
			if( (actual >= val1 && actual <= val2) || (actual >= val2 && actual <= val1) ) // actual is inbetween
			{
				if (guess == 0)
				{
					win = true;
				
				}
				
			}
			else // actual is outside
			{
				if (guess == 1)
				{
					win = true;
				}
			}
			break;
		case 4:
			if (deck[myCards[3]].Suit === guess)
			{
				win = true;
			}
			break;
			
		
		
	}
	
	return win;
	
}

function ClearLog()
{
	fetch('/clearLog', {
	method: 'post',
	headers: {
			'Content-Type': 'application/json',
			}
	}).then(res => res.json())
		.then(function (data) {
			document.getElementById('log').innerHTML = "Here is how you have performed in the past: <br> ";
			document.getElementById('currentBalance').innerHTML = "Your current balance is: " + parseInt(data.balance);
	
	});
}










