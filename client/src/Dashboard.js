import React from 'react';

export default class Dashboard extends React.Component {
  componentDidMount() {
    $.get('/api/data', (data) => {
      console.log(data);
      global = data;
      data.users.forEach(item => $('#user-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `));

      data.books.forEach(item => $('#book-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `));
      data.list.forEach(item => {
        const username = data.users.find(user => item.userId === user.id).name;
        const bookname = data.books.find(book => book.id === item.bookId).name;
        $('#borrowlist-group').append(`
        <ul class="list-group list-group-horizontal" id="relation-list-${item.id}">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${username}</li>
          <li class="list-group-item flex-fill ">${bookname}</li>
          <li class="list-group-item flex-fill ">
            <button type="button" class="btn btn-danger" id="delete-relation-${item.id}">Delete</button>
            <button type="button" class="btn btn-warning" id="edit-relation-${item.id}">Edit</button>
          </li>
        </ul>
      `);
      });
      data.list.forEach(item => {
        $(`#delete-relation-${item.id}`).click(() => {
          deleteRelation(item);
        });
        $(`#edit-relation-${item.id}`).click(() => {
          editRelation(item);
        });
      })
    });

    const addingUserForm = document.getElementById('add-user');
    const addingBookForm = document.getElementById('add-book');
    const editRationForm = $('#edit-relation');
    editRationForm.hide();
    addingUserForm.onsubmit = function(event) {
      event.preventDefault();
      const userId = $("#user-id").val();
      const username = $("#user-name").val();
      $.ajax({
        type: "POST",
        url: '/api/user',
        data: {
          username,
          userId,
        },
        success: (item) => {
          $('#user-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `)
        },
      }).done(() => {
      }).fail(e => {
      });
    };
    addingBookForm.onsubmit = function(event) {
      event.preventDefault();
      const bookId = $("#book-id").val();
      const bookname = $("#book-name").val();
      $.ajax({
        type: "POST",
        url: '/api/book',
        data: {
          bookId,
          bookname,
        },
        success: (item) => {
          $('#book-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `)
        },
      }).done(() => {
      }).fail(e => {
      });
    };
    editRationForm.submit((event) => {
      event.preventDefault();
      console.log(global);
      editRationForm.hide();
      $.ajax({
        type: 'PUT',
        url: '/api/relation',
        data: {
          id: $('#relation-id').val(),
          userId: $('#relation-user-id').val(),
          bookId: $('#relation-book-id').val(),
        },
        success: () => {
          window.location.reload();
        },
      })
    });
    function deleteRelation(item) {
      console.log(item.id);
      $.ajax({
        type: "DELETE",
        url: '/api/relation',
        data: {
          id: item.id,
        },
        success: () => {
          console.log((`#relation-list-${item.id}`));
          $(`#relation-list-${item.id}`).remove()
        },
      });
    }
    function editRelation(item) {
      $('#relation-id').val(item.id);
      $('#relation-user-id').val(item.userId);
      $('#relation-book-id').val(item.bookId);
      editRationForm.show();
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-3">
            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab"
                 aria-controls="v-pills-home" aria-selected="false">Users</a>
              <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab"
                 aria-controls="v-pills-profile" aria-selected="false">Books</a>
              <a className="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab"
                 aria-controls="v-pills-messages" aria-selected="true">BorrowingList</a>
            </div>
          </div>
          <div className="col-6">
            <div className="tab-content" id="v-pills-tabContent">
              <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel"
                   aria-labelledby="v-pills-home-tab">
                <ul className="list-group" id="user-group">
                  <ul className="list-group list-group-horizontal ">
                    <li className="list-group-item flex-fill list-group-item-primary">id</li>
                    <li className="list-group-item flex-fill list-group-item-primary">name</li>
                  </ul>
                </ul>
                <form id="add-user">
                  <div className="form-group">
                    <label htmlFor="user-id">User Id</label>
                    <input type="number" className="form-control" id="user-id" placeholder="Enter Id" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-name">User Name</label>
                    <input type="text" className="form-control" id="user-name" placeholder="User Name" />
                  </div>
                  <button type="submit" className="btn btn-primary">Add</button>
                </form>
              </div>
              <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                <ul className="list-group" id="book-group">
                  <ul className="list-group list-group-horizontal ">
                    <li className="list-group-item flex-fill list-group-item-primary">id</li>
                    <li className="list-group-item flex-fill list-group-item-primary">name</li>
                  </ul>
                </ul>
                <form id="add-book">
                  <div className="form-group">
                    <label htmlFor="book-id">Book Id</label>
                    <input type="number" className="form-control" id="book-id" placeholder="Enter Id" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-name">Book Name</label>
                    <input type="text" className="form-control" id="book-name" placeholder="User Name" />
                  </div>
                  <button type="submit" className="btn btn-primary">Add</button>
                </form>
              </div>
              <div className="tab-pane fade" id="v-pills-messages" role="tabpanel"
                   aria-labelledby="v-pills-messages-tab">
                <ul className="list-group" id="borrowlist-group">
                  <ul className="list-group list-group-horizontal">
                    <li className="list-group-item flex-fill list-group-item-primary">id</li>
                    <li className="list-group-item flex-fill list-group-item-primary">user-name</li>
                    <li className="list-group-item flex-fill list-group-item-primary">book-name</li>
                    <li className="list-group-item flex-fill list-group-item-primary">control</li>
                  </ul>
                </ul>
                <form id="edit-relation">
                  <div className="form-group">
                    <label htmlFor="relation-id">Id</label>
                    <input type="number" disabled className="form-control" id="relation-id" placeholder="Enter Id" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="relation-user-id">User Id</label>
                    <input type="number" className="form-control" id="relation-user-id" placeholder="Enter Id" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="relation-book-id">Book Id</label>
                    <input type="number" className="form-control" id="relation-book-id" placeholder="User Name" />
                  </div>
                  <button type="submit" className="btn btn-primary">Edit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
  }
  }
