getUsers();

function getUsers(searchTerm) {
  APIGetUsers(searchTerm)
    .then((response) => {
      console.log(response.data);
      // duyệt qua mảng vừa lấy từ data xuống xong duyệt qua từng phần tử bên trong nó
      let users = response.data.map((user) => {
        return new User(
          user.id,
          user.taiKhoan,
          user.matKhau,
          user.hoTen,
          user.email,
          user.ngonNgu,
          user.loaiND,
          user.moTa,
          user.hinhAnh
        );
      });
      display(users);
    })
    .catch((error) => {
      console.log(error);
    });
}

function addUser(user) {
  APIAddUser(user)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteUser(userID) {
  APIDeleteUser(userID)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUser(userID, user) {
  APIUpdateUser(userID, user)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}

let users = [];

// ===============================================================================================================================

function display(users) {
  // từ mảng biến thành chuổi thì .reduce
  output = users.reduce((result, user, index) => {
    return (
      result +
      `
            <tr>
                <td>${index + 1}</td>
                <td>${user.taiKhoan}</td>
                <td>${user.matKhau}</td>
                <td>${user.hoTen}</td>
                <td>${user.email}</td>
                <td>${user.ngonNgu}</td>
                <td>${user.loaiND}</td>
                <td>${user.moTa}</td>
                <td>
                    <img src="${user.hinhAnh}" width="50px" height="50px" />
                </td>
                <td>
                    <button class="btn btn-success" data-toggle="modal" data-target="#myModal" data-id="${
                      user.id
                    }" data-type="edit">Sửa</button>
                </td>
                <td>
                    <button class="btn btn-danger" data-id="${
                      user.id
                    }" data-type="delete">Xóa</button>
                </td>
            </tr>
        `
    );
  }, "");

  dom("#tblDanhSachNguoiDung").innerHTML = output;
}

function dom(selector) {
  return document.querySelector(selector);
}

function resetForm() {
  dom("#MaSP").value = "";
  dom("#TaiKhoan").value = "";
  dom("#MatKhau").value = "";
  dom("#HoTen").value = "";
  dom("#Email").value = "";
  dom("#loaiNgonNgu").value = "";
  dom("#loaiNguoiDung").value = "";
  dom("#MoTa").value = "";
  dom("#HinhAnh").value = "";
}

//=============================== DOM ==============================================
// button thêm mới (hàm oncick mới)
dom("#btnThemNguoiDung").addEventListener("click", () => {
  dom(".modal-title").innerHTML = "thêm người dùng";
  dom(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class="btn btn-primary" data-type="add">Thêm</button>
    `;
  resetForm();
});

dom(".modal-footer").addEventListener("click", (evt) => {
  let elementType = evt.target.getAttribute("data-type");

  let id = dom("#MaSP").value;
  let taiKhoan = dom("#TaiKhoan").value;
  let matKhau = dom("#MatKhau").value;
  let hoTen = dom("#HoTen").value;
  let email = dom("#Email").value;
  let ngonNgu = dom("#loaiNgonNgu").value;
  let loaiND = dom("#loaiNguoiDung").value;
  let moTa = dom("#MoTa").value;
  let hinhAnh = dom("#HinhAnh").value;

  let Valida = ValidateForm();
  if (!Valida) {
    return;
  }

  users = new User(
    null,
    taiKhoan,
    matKhau,
    hoTen,
    email,
    ngonNgu,
    loaiND,
    moTa,
    hinhAnh
  );

  if (elementType === "add") {
    addUser(users);
  } else if (elementType === "update") {
    updateUser(id, users);
  }

  resetForm();

});

dom("#tblDanhSachNguoiDung").addEventListener("click", (evt) => {
  let id = evt.target.getAttribute("data-id");
  let elType = evt.target.getAttribute("data-type");

  if (elType === "delete") {
    deleteUser(id);
  } else if (elType === "edit") {
    dom(".modal-title").innerHTML = "cập nhật người dùng";
    dom(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class="btn btn-primary" data-type="update">Cập Nhật</button>
    `;

    let Valida = ValidateForm();
    if (!Valida) {
      return;
    }

    APIGetUserByID(id)
      .then((response) => {
        let user = response.data;
        //fill thông tin lên input
        dom("#MaSP").value = user.id; // hidden input
        dom("#TaiKhoan").value = user.taiKhoan;
        dom("#HoTen").value = user.hoTen;
        dom("#MatKhau").value = user.matKhau;
        dom("#Email").value = user.email;
        dom("#HinhAnh").value = user.hinhAnh;
        dom("#loaiNguoiDung").value = user.loaiND;
        dom("#loaiNgonNgu").value = user.ngonNgu;
        dom("#MoTa").value = user.moTa;
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

dom("#search").addEventListener("keydown", (evt) => {
  console.log(evt.key);

  if (evt.key !== "Enter") return;

  getUsers(evt.target.value);
});

// ===================================== Validate ===============================================
// thêm topping cho span
let tagname = document.getElementsByTagName("span");
[...tagname].forEach((el) => {
  el.style.color = "red";
  el.style.display = "block";
});

function ValidateId() {
  let id = dom("#TaiKhoan").value;
  let spanEl = dom("#uId");

  if (!id) {
    spanEl.innerHTML = " Tài Khoản người dùng không được để trống ";
    return false;
  }

  if (id.length < 4 || id.length > 8) {
    spanEl.innerHTML = " Tài khoản người dùng từ 4 đến 8 kí tự ";
    return false;
  }
  
  spanEl.innerHTML = "";
  return true;
}

function ValidateName() {
  let name = dom("#HoTen").value;
  let spanEl = dom("#uName");

  if (!name) {
    spanEl.innerHTML = " Họ và Tên không được để trống ";
    return false;
  }

  if (name.length < 8) {
    spanEl.innerHTML = " Điền đầy đủ Họ và Tên ";
    return false;
  }

  let regex = /(?=.*\d)/;
  if (regex.test(name)) {
    spanEl.innerHTML = " Họ và Tên chỉ nhập chữ ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidatePassword() {
  let password = dom("#MatKhau").value;
  let spanEl = dom("#uPassword");

  if (!password) {
    spanEl.innerHTML = " Mật khẩu không được để trống ";
    return false;
  }
  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    spanEl.innerHTML = " Mật khẩu không đúng định dạng ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

function ValidateEmail() {
  let email = dom("#Email").value;
  let spanEl = dom("#uEmail");

  if (!email) {
    spanEl.innerHTML = " Email không được để trống ";
    return false;
  }
  let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(email)) {
    spanEl.innerHTML = " Email không đúng định dạng ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

function ValidatePicture() {
  let picture = dom("#HinhAnh").value;
  let spanEl = dom("#uPicture");

  if (!picture) {
    spanEl.innerHTML = "Hình ảnh không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateHuman() {
  let human = dom("#loaiNguoiDung").value;
  let spanEl = dom("#uLoaiNd");

  if (!human) {
    spanEl.innerHTML = "Loại người dùng không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateLangue() {
  let langue = dom("#loaiNgonNgu").value;
  let spanEl = dom("#uLangue");

  if (!langue) {
    spanEl.innerHTML = "Loại ngôn ngữ không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateNote() {
  let note = dom("#MoTa").value;
  let spanEl = dom("#uMota");

  if (!note) {
    spanEl.innerHTML = "Mô tả không được để trống";
    return false;
  }

  if (note.length > 60) {
    spanEl.innerHTML = "Không vượt quá 60 kí tự";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateForm() {
  let isValid = true;

  isValid =
    ValidateId() &
    ValidateName() &
    ValidatePassword() &
    ValidateEmail() &
    ValidatePicture() &
    ValidateHuman() &
    ValidateLangue() &
    ValidateNote();

  if (!isValid) {
    alert("ĐIỀN CHƯA ĐÚNG");
    return false;
  }
  return true;
}
