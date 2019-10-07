import React, {useEffect} from 'react';
import logo from '../img/oclogo.svg';

export default function MainApp(props) {

	//after component mounts, get trip data for user
	//and change styles accordingly
	useEffect(() => {
		const list = document.querySelectorAll('#tripname');
	
		fetch('/trips', {
			method: 'POST',
			credentials: 'include'
		})
		.then(res => res.json())
		.then(function(json) {
			let trips = JSON.parse(json);
			list.forEach(t => {
				trips.forEach(i => {
					if (t.innerHTML === i.tripname) {
						let row = t.parentNode;
						let btn = row.querySelector('#signup-btn');
						let gear = row.querySelector('#gear');
						let paid = row.querySelector('#paid-check');
						row.style.backgroundColor = "#D0FFD6";
						btn.style.background = "#FC5C7D";
						btn.innerHTML = "Remove";
						gear.value = i.gear;
						paid.checked = i.paid;
					}
				})
			})
		})
	})

	async function results() {
		fetch('/results', {
			method: 'GET',
			credentials: 'include'
		})
		.then(function(req) {
			window.location.href = req.url
		})
	}

	function gearSelect(trip, gear) {
		const json = {
			tripname: trip,
			gear: gear
		}
		const body = JSON.stringify(json);
	
		fetch('/gear', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body
		})
	}

	function paidCheck(trip, self) {
		const json = {
			tripname: trip,
			paid: self.checked
		}
		const body = JSON.stringify(json);
		
		fetch('/pay', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body
		})
	}

	function signup(e) {
		e.preventDefault();
		let parent = e.target.parentNode;
		let row = parent.parentNode;
		let btn = parent.querySelector('#signup-btn');

		const json = {
			tripname: row.querySelector('#tripname').innerHTML,
			dates: row.querySelector('#dates').innerHTML,
			gear: row.querySelector('#gear').value,
			paid: row.querySelector('#paid-check').checked,
		}
		const body = JSON.stringify(json);

		fetch ('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body
		}).then(res => res.json())
		.then(function(msg) {
			if (msg.message === "added") {
				row.style.transition = "background-color 0.2s ease"
				row.style.backgroundColor = "#D0FFD6"
				btn.style.background = "#FC5C7D";
				btn.innerHTML = "Remove";
			} else if (msg.message === "removed") {
				row.style.transition = "background-color 0.2s ease"
				row.style.backgroundColor = "white"
				btn.style.background = "linear-gradient(90deg, #FC5C7D, #6A82FB) center center fixed";
				btn.innerHTML = "Sign up"
			}
		})
	}


	return (
		<React.Fragment>
			
			<header className="Header">
				<section className="Section container1 clearfix1">
					<div>
						<img className="h-16" src={logo} alt="logo"></img>
					</div>
					<nav className="Navigation">
						<a className="Link" href="/main">Trips</a>
						<a className="Link" onClick={results}>Results</a>
					</nav>
				</section>
			</header>

			<div id="tb-div">
				<div className="my-4 mx-40 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" id="tb-div-inner">
				<table>

					<thead>
					<tr>
						<th>Trip</th>
						<th>Dates</th>
						<th>Do you need gear?</th>
						<th>Have you paid?</th>
						<th></th>
					</tr>
					</thead>

					<tbody>

					<tr>
						<td id="tripname">White Water Rafting</td>
						<td id="dates">9/13/19 - 9/15/19</td>
						<td>
						<div className="relative">
							<select
							className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="gear" onChange={() => gearSelect("White Water Rafting", event.target.value)}>
							<option value="None">None</option>
							<option value="Sleeping bag">Sleeping bag</option>
							<option value="Sleeping pad">Sleeping pad</option>
							<option value="Tent">Tent</option>
							<option value="Backpack">Backpack</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							</div>
						</div>
						</td>
						<td>
						<div className="flex flex-row">
							<label className="checkbox-label">
							<input id="paid-check" type="checkbox" onClick={() => paidCheck("White Water Rafting", event.target)} />
							<span className="checkbox-custom circular"></span>
							</label>
							<span className="mx-8" style={{marginTop: 2 + 'px'}}>$60</span>
						</div>
						</td>
						<td>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full" id="signup-btn"
							onClick={() => signup(event)}>
							Sign up
						</button>
						</td>
					</tr>

					<tr>
						<td id="tripname">Ice Climbing</td>
						<td id="dates">1/13/20 - 1/15/20</td>
						<td>
						<div className="relative">
							<select
							className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="gear" onChange={() => gearSelect("Ice Climbing", event.target.value)}>
							<option value="None">None</option>
							<option value="Sleeping bag">Sleeping bag</option>
							<option value="Sleeping pad">Sleeping pad</option>
							<option value="Tent">Tent</option>
							<option value="Backpack">Backpack</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							</div>
						</div>
						</td>
						<td>
						<div className="flex flex-row">
							<label className="checkbox-label">
							<input id="paid-check" type="checkbox" onClick={() => paidCheck("Ice Climbing", event.target)} />
							<span className="checkbox-custom circular"></span>
							</label>
							<span className="mx-8" style={{marginTop: 2 + 'px'}}>$60</span>
						</div>
						</td>
						<td>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full" id="signup-btn"
							onClick={() => signup(event)}>
							Sign up
						</button>
						</td>
					</tr>

					<tr>
						<td id="tripname">Rock Climbing NH</td>
						<td id="dates">10/24/19 - 10/26/19</td>
						<td>
						<div className="relative">
							<select
							className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="gear" onChange={() => gearSelect("Rock Climbing NH", event.target.value)}>
							<option value="None">None</option>
							<option value="Sleeping bag">Sleeping bag</option>
							<option value="Sleeping pad">Sleeping pad</option>
							<option value="Tent">Tent</option>
							<option value="Backpack">Backpack</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							</div>
						</div>
						</td>
						<td>
						<div className="flex flex-row">
							<label className="checkbox-label">
							<input id="paid-check" type="checkbox" onClick={() => paidCheck("Rock Climbing NH", event.target)} />
							<span className="checkbox-custom circular"></span>
							</label>
							<span className="mx-8" style={{marginTop: 2 + 'px'}}>$60</span>
						</div>
						</td>
						<td>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full" id="signup-btn"
							onClick={() => signup(event)}>
							Sign up
						</button>
						</td>
					</tr>

					<tr>
						<td id="tripname">Kayaking</td>
						<td id="dates">4/13/20 - 4/15/20</td>
						<td>
						<div className="relative">
							<select
							className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="gear" onChange={() => gearSelect("Kayaking", event.target.value)}>
							<option value="None">None</option>
							<option value="Sleeping bag">Sleeping bag</option>
							<option value="Sleeping pad">Sleeping pad</option>
							<option value="Tent">Tent</option>
							<option value="Backpack">Backpack</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							</div>
						</div>
						</td>
						<td>
						<div className="flex flex-row">
							<label className="checkbox-label">
							<input id="paid-check" type="checkbox" onClick={() => paidCheck("Kayaking", event.target)} />
							<span className="checkbox-custom circular"></span>
							</label>
							<span className="mx-8" style={{marginTop: 2 + 'px'}}>$60</span>
						</div>
						</td>
						<td>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full" id="signup-btn"
							onClick={() => signup(event)}>
							Sign up
						</button>
						</td>
					</tr>
					</tbody>
				</table>
				</div>
			</div>
		</React.Fragment>
	)
}