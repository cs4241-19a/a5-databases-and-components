const addNewOrder = function(e) {
  e.preventDefault();

  const newOrder = {
    username: document.getElementById("username").value,
    beds: document.getElementById("beds").value,
    requests: document.getElementById("requests").value
  };

  const body = JSON.stringify(newOrder);
  fetch("/submit", {
    method: "POST",
    body
  }).then(function(response) {
    document.getElementById("order-confirmed").style.display = "flex";
    document.getElementById("form").style.display = "none";
    resetForm();
  });

  return false;
};

const updateOrder = e => {
  e.preventDefault();

  const updatedOrder = {
    username: document.getElementById("update-username").value,
    beds: document.getElementById("update-beds").value,
    requests: document.getElementById("update-requests").value,
    id: parseInt(document.getElementById("update-id").value)
  };

  const body = JSON.stringify(updatedOrder);
  fetch("/update", {
    method: "POST",
    body
  }).then(function(response) {
    viewOrderTable();
  });

  return false;
};

const fetchCurrentOrders = async function() {
  const response = await fetch("/orders", { method: "GET" });
  const data = await response.json();
  const orders = data;

  let HTMLDiv = document.getElementById("orders");

  HTMLDiv.innerHTML =
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Beds</th>\n" +
    "<th>Requests</th>\n" +
    "<th></th>\n" +
    "<th></th>\n" +
    "</tr>";

  for (let i = 0; i < orders.length; i++) {
    const currentOrder = orders[i];
    const orderString = JSON.stringify(orders[i]);
    if (
      currentOrder.createdBy ===
      document.getElementById("current-username").value
    ) {
      let row = "<tr>\n";
      row += `<td> ${currentOrder.username} </td>\n`;
      row += `<td> ${currentOrder.beds} </td>\n`;
      row += `<td> ${currentOrder.requests} </td>\n`;
      row +=
        `<td> <button id="update-button-${i}" class="table-button" style="font-size: 1vw" onclick="viewUpdateForm(${i})" data-string=` +
        encodeURIComponent(orderString) +
        `>Edit</button> </td>\n`;
      row += `<td> <button id="delete-button-${i}" class="table-button" style="font-size: 1vw" onclick="deleteOrder(${currentOrder.id})">Delete</button> </td>\n`;
      row += "</tr>";
      HTMLDiv.innerHTML += row;
    }
  }

  return false;
};

const deleteOrder = function(orderid) {
  const orderNum = { id: orderid };
  const body = JSON.stringify(orderNum);

  fetch("/delete", {
    method: "POST",
    body
  });
  fetchCurrentOrders();
};

const viewOrderTable = function() {
  document.getElementById("table").style.display = "flex";
  document.getElementById("form").style.display = "none";
  document.getElementById("update-form").style.display = "none";
  document.getElementById("order-confirmed").style.display = "none";

  fetchCurrentOrders();
  return false;
};

const viewOrderForm = function() {
  document.getElementById("table").style.display = "none";
  document.getElementById("form").style.display = "block";
  document.getElementById("update-form").style.display = "none";
  document.getElementById("order-confirmed").style.display = "none";
  resetForm();
};

const viewUpdateForm = function(num) {
  let order = decodeURIComponent(
    document.getElementById(`update-button-${num}`).dataset.string
  );
  order = JSON.parse(order);

  document.getElementById("table").style.display = "none";
  document.getElementById("update-form").style.display = "block";
  document.getElementById("update-button").dataset.index = num;
  document.getElementById("update-username").value = order.username;
  document.getElementById("update-beds").value = order.beds;
  document.getElementById("update-requests").value = order.requests;
  document.getElementById("update-id").value = order.id;

  return false;
};

const resetForm = () => {
  document.getElementById("username").value = "";
  document.getElementById("beds").value = "";
  document.getElementById("requests").value = "";
};

const login = function(e) {
  e.preventDefault();

  const loginInfo = {
    username: document.getElementById("login-username").value,
    password: document.getElementById("password").value
  };

  const body = JSON.stringify(loginInfo);
  fetch("/login", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(console.log)
    .then(function(response) {
      document.getElementById("new-order-link").style.display = "flex";
      document.getElementById("current-orders-link").style.display = "flex";
      document.getElementById("login").style.display = "none";
      document.getElementById("current-username").value = loginInfo.username;
      viewOrderForm();
    });
};
