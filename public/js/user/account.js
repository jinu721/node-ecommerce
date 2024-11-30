// ~~~~~~~~~~~~~~~~~~ update profile section ~~~~~~~~~~~~~~~~~~

const profileInfo = document.querySelector(".profile-info");
const updateForm = document.querySelector(".updateform");
const editButton = document.querySelector(".edit-profile");
const updateButton = updateForm.querySelector(".updatebtn");

const usernameField = updateForm.querySelector(".usernameUpdate");
const emailField = updateForm.querySelector(".emailUpdate");
const phoneField = updateForm.querySelector(".phoneUpdate") || null;

const usernameError = document.querySelector(".error-msg-updateUsername");
const emailError = document.querySelector(".error-msg-updateEmail");
const phoneError = document.querySelector(".error-msg-updatePhone");

const usernamePattern = /^[a-zA-Z0-9_]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+[0-9]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
editButton.addEventListener("click", (e) => {
  e.preventDefault();
  profileInfo.style.display = "none";
  updateForm.style.display = "grid";
});

updateButton.addEventListener("click", (e) => {
  e.preventDefault();
  let isValid = true;
  if (!usernamePattern.test(usernameField.value)) {
    usernameError.style.display = "block";
    usernameError.textContent =
      "Username must contain only letters, numbers, and underscores (_).";
    isValid = false;
  } else {
    usernameError.style.display = "none";
  }
  // if (!emailPattern.test(emailField.value)) {
  //   emailError.style.display = "block";
  //   emailError.textContent = "Please enter a valid email address.";
  //   isValid = false;
  // } else {
  //   emailError.style.display = "none";
  // }
  if (phoneField && phoneField.value.trim() !== "") {
    if (!phonePattern.test(phoneField.value)) {
      phoneError.style.display = "block";
      phoneError.textContent =
        "Phone number must start with '+' followed by numbers.";
      isValid = false;
    } else {
      phoneError.style.display = "none";
    }
  } else {
    phoneError.style.display = "none";
  }

  if (isValid) {
    const userInfo = {
      username: usernameField.value,
      // email: emailField.value,
      phone: phoneField.value,
    };

    let sendReq = async () => {
      try {
        const resData = await fetch("/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });

        const parsedData = await resData.json();

        if (!parsedData.val) {
          if (parsedData.type === "username") {
            usernameError.style.display = "block";
            usernameError.textContent = parsedData.msg;
          } else if (parsedData.type === "email") {
            emailError.style.display = "block";
            emailError.textContent = parsedData.msg;
          } else if (parsedData.type === "phone") {
            phoneError.style.display = "block";
            phoneError.textContent = parsedData.msg;
          }
        } else {
          usernameError.style.display = "none";
          // emailError.style.display = "none";
          phoneError.style.display = "none";
          document.querySelector(".displayUsername").textContent =
            parsedData.user.username;
          // document.querySelector(".displayEmail").textContent =
          //   parsedData.user.email;
          document.querySelector(".displayPhone").textContent =
            parsedData.user.phone;
          profileInfo.style.display = "block";
          updateForm.style.display = "none";
        }
      } catch (err) {
        console.log("Error in updating profile:", err);
      }
    };
    sendReq();
  }
});

// ~~~~~~~~~~~~~ My address section ~~~~~~~~~~~~~

// create address section

const countryInput = document.querySelector(".countryInp");
const stateInput = document.querySelector(".stateInp");
const districtInput = document.querySelector(".districtInp");
const cityInput = document.querySelector(".cityInp");
const streetInput = document.querySelector(".streetInp");
const landmarkInput = document.querySelector(".landmarkInp");
const housenoInput = document.querySelector(".housenoInp");
const pincodeInput = document.querySelector(".pincodeInp");

const errCountry = document.querySelector(".errCountryAddress");
const errState = document.querySelector(".errStateAddress");
const errDistrict = document.querySelector(".errDistrictAddress");
const errCity = document.querySelector(".errCityAddress");
const errStreet = document.querySelector(".errStreetAddress");
const errLandmark = document.querySelector(".errLandmarkAddress");
const errHouseno = document.querySelector(".errHousenoAddress");
const errPincode = document.querySelector(".errPincodeAddress");

const createButton = document.querySelector(".btnAddAddress");
const buttonText = document.querySelector(".btnAddAddressText");
const loader = document.querySelector(".btnAddAddressLoader");

const addressFormCreate = document.querySelector(".address-form-create");
const addressFormEdit = document.querySelector(".address-form-edit");
const addressShow = document.querySelector(".address");
const createAddressText = document.querySelector(".createAddress");

const textPattern = /^[a-zA-Z\s]+$/;
const pincodePattern = /^[0-9]{6}$/;

const addressDisplaySection = document.querySelector('.addressDisplaySection');
const addressCreateSection = document.querySelector('.address-form-create');
const addressEditSection = document.querySelector('.address-form-edit');

createAddressText.addEventListener("click", () => {
  addressDisplaySection.style.display = "none";
  addressEditSection.style.display = "none";
  addressCreateSection.style.display = "block";
});

createButton.addEventListener("click", (e) => {
  buttonText.style.display = "none";
  loader.style.display = "flex";
  e.preventDefault();
  if (!countryInput.value.match(textPattern)) {
    errCountry.style.display = "flex";
    errState.style.display = "none";
    errDistrict.style.display = "none";
    errCity.style.display = "none";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "none";
    errCountry.textContent = "Please enter a valid country name.";
  } else if (!stateInput.value.match(textPattern)) {
    errCountry.style.display = "none";
    errState.style.display = "flex";
    errDistrict.style.display = "none";
    errCity.style.display = "none";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "none";
    errState.textContent = "Please enter a valid state name.";
  } else if (!districtInput.value.match(textPattern)) {
    errCountry.style.display = "none";
    errState.style.display = "none";
    errDistrict.style.display = "flex";
    errCity.style.display = "none";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "none";
    errDistrict.textContent = "Please enter a valid district name.";
  } else if (!cityInput.value.match(textPattern)) {
    errCountry.style.display = "none";
    errState.style.display = "none";
    errDistrict.style.display = "none";
    errCity.style.display = "flex";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "none";
    errCity.textContent = "Please enter a valid city name.";
  } else if (!streetInput.value.match(textPattern)) {
    errCountry.style.display = "none";
    errState.style.display = "none";
    errDistrict.style.display = "none";
    errCity.style.display = "none";
    errStreet.style.display = "flex";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "none";
    errStreet.textContent = "Please enter a valid street name.";
  } else if (!housenoInput.value) {
    errCountry.style.display = "none";
    errState.style.display = "none";
    errDistrict.style.display = "none";
    errCity.style.display = "none";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "flex";
    errPincode.style.display = "none";
    errHouseno.textContent = "House number cannot be empty.";
  } else if (!pincodeInput.value.match(pincodePattern)) {
    errCountry.style.display = "none";
    errState.style.display = "none";
    errDistrict.style.display = "none";
    errCity.style.display = "none";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "flex";
    errPincode.textContent = "Please enter a valid 6-digit pincode.";
  } else {
    errCountry.style.display = "none";
    errState.style.display = "none";
    errDistrict.style.display = "none";
    errCity.style.display = "none";
    errStreet.style.display = "none";
    errLandmark.style.display = "none";
    errHouseno.style.display = "none";
    errPincode.style.display = "none";
    const addressInfo = {
      country: countryInput.value,
      state: stateInput.value,
      district: districtInput.value,
      city: cityInput.value,
      street: streetInput.value,
      landmark: landmarkInput.value,
      houseno: housenoInput.value,
      pincode: pincodeInput.value,
    };
    let sendReq = async () => {
      try {
        const resData = await fetch("/create-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressInfo),
        });
        const parsedData = await resData.json();
        if (parsedData.val) {
          buttonText.style.display = "none";
          loader.style.display = "flex";
          fetchAddress();
          addressShow.style.display = "block";
          addressFormCreate.style.display = "none";
        }
      } catch (err) {
        console.log("Error in updating profile:", err);
      }
    };
    sendReq();
  }
});

// Edit address section

const countryEditInput = document.querySelector(".countryInpEdit");
const stateEditInput = document.querySelector(".stateInpEdit");
const districtEditInput = document.querySelector(".districtInpEdit");
const cityEditInput = document.querySelector(".cityInpEdit");
const streetEditInput = document.querySelector(".streetInpEdit");
const landmarkEditInput = document.querySelector(".landmarkInpEdit");
const housenoEditInput = document.querySelector(".housenoInpEdit");
const pincodeEditInput = document.querySelector(".pincodeInpEdit");
const addressIdEdit = document.querySelector(".addressIdEdit");

const errCountryEdit = document.querySelector(".errCountryAddressEdit");
const errStateEdit = document.querySelector(".errStateAddressEdit");
const errDistrictEdit = document.querySelector(".errDistrictAddressEdit");
const errCityEdit = document.querySelector(".errCityAddressEdit");
const errStreetEdit = document.querySelector(".errStreetAddressEdit");
const errLandmarkEdit = document.querySelector(".errLandmarkAddressEdit");
const errHousenoEdit = document.querySelector(".errHousenoAddressEdit");
const errPincodeEdit = document.querySelector(".errPincodeAddressEdit");

const editButtonText = document.querySelector(".btnEditAddressText");
const editLoader = document.querySelector(".btnEditAddressLoader");

const editAddressButton = document.querySelector(".btnEditAddress");

editAddressButton.addEventListener("click", (e) => {
  e.preventDefault();
  [
    errCountryEdit,
    errStateEdit,
    errDistrictEdit,
    errCityEdit,
    errStreetEdit,
    errLandmarkEdit,
    errHousenoEdit,
    errPincodeEdit,
  ].forEach((error) => (error.style.display = "none"));

  if (!countryEditInput.value.match(textPattern)) {
    errCountryEdit.style.display = "flex";
    errCountryEdit.textContent = "Please enter a valid country name.";
  } else if (!stateEditInput.value.match(textPattern)) {
    errStateEdit.style.display = "flex";
    errStateEdit.textContent = "Please enter a valid state name.";
  } else if (!districtEditInput.value.match(textPattern)) {
    errDistrictEdit.style.display = "flex";
    errDistrictEdit.textContent = "Please enter a valid district name.";
  } else if (!cityEditInput.value.match(textPattern)) {
    errCityEdit.style.display = "flex";
    errCityEdit.textContent = "Please enter a valid city name.";
  } else if (!streetEditInput.value.match(textPattern)) {
    errStreetEdit.style.display = "flex";
    errStreetEdit.textContent = "Please enter a valid street name.";
  } else if (!housenoEditInput.value) {
    errHousenoEdit.style.display = "flex";
    errHousenoEdit.textContent = "House number cannot be empty.";
  } else if (!pincodeEditInput.value.match(pincodePattern)) {
    errPincodeEdit.style.display = "flex";
    errPincodeEdit.textContent = "Please enter a valid 6-digit pincode.";
  } else {
    editButtonText.style.display = "none";
    editLoader.style.display = "block";
    const editedAddressInfo = {
      id: document.querySelector(".addressIdEdit").value,
      country: countryEditInput.value,
      state: stateEditInput.value,
      district: districtEditInput.value,
      city: cityEditInput.value,
      street: streetEditInput.value,
      landmark: landmarkEditInput.value,
      houseno: housenoEditInput.value,
      pincode: pincodeEditInput.value,
    };

    let updateReq = async () => {
      try {
        const res = await fetch("/update-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedAddressInfo),
        });
        const result = await res.json();
        if (result.val) {
          fetchAddress();
          addressFormEdit.style.display = "none";
          addressShow.style.display = "block";
          editButtonText.style.display = "block";
          editLoader.style.display = "none";
          console.log("Address updated successfully!");
        }
      } catch (error) {
        console.log("Error in updating address:", error);
      }
    };
    updateReq();
  }
});

const tabs = document.querySelectorAll(".account__tab");
const tabsContents = document.querySelectorAll(".tab__content");

tabs.forEach((tab) => {
  tab.addEventListener("click", async () => {
    const targetSelector = tab.dataset.target;
    const targetContent = document.querySelector(targetSelector);
    if (!targetContent) {
      if (targetSelector === "#logout") {
        async function fetchData(){
          try{
            const response = await fetch('/logout', { method: "POST" });
            const data = await response.json();
            if(!data.val){
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.msg,
              });
            }else{
              window.location.href = '/';
            }
          }catch(err){
            console.log(err);
          }
        }
        fetchData();
      }
      return;
    }
    tabsContents.forEach((tabsContent) => {
      tabsContent.classList.remove("active-tab");
    });
    tabs.forEach((tab) => {
      tab.classList.remove("active-tab");
    });
    tab.classList.add("active-tab");
    targetContent.classList.add("active-tab");
    switch (targetSelector) {
      case "#orders":
        await fetchOrders();
        break;
      case "#wallet":
        await fetchWallet();
        break;
      case "#address":
        await fetchAddress();
        break;
      case "#change-password":
        await showChangePassword();
        break;
      default:
        console.log("Switching to tab:", targetSelector);
    }
  });
});

async function fetchWallet() {
  const balanceSection = document.querySelector(".balanceSection");
  const transactionHistorySection = document.querySelector(
    ".transactionHistorySection"
  );
  balanceSection.innerHTML = "";
  transactionHistorySection.innerHTML = "";
  try {
    const response = await fetch("account/wallet");
    const data = await response.json();
    console.log(data);
    if (data.val) {
      balanceSection.innerHTML = `
      <div class="card">
        <div class="balance-header">
          <span>Balance</span>
          <div class="currency-toggle">R/ &#8377;</div>
        </div>
        <div class="balance-amount">&#8377;${data.wallet.balance}</div>
        <div class="transactions">
          <span>↗ +&#8377; ${data.wallet.balance}</span>
          <span>↙ -&#8377; ${0}</span>
        </div>

        <div class="info-section">
          <div class="info-item">
            <span class="label">Wallet ID:</span>
            <span>${data.wallet._id}</span>
          </div>
        </div>
      </div>
      `;
      data.wallet.transactionHistory.forEach((x) => {
        function formatDate(dateString) {
          const date = new Date(dateString);
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };

          return date.toLocaleString("en-US", options); 
        }
        function capitalize(str) {
          return str.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
          });
        }

        const div = document.createElement("div");
        div.classList.add("transactionItem");
        div.innerHTML = `
        <div class="transaction-item">
              <div class="transaction-info">
                <div class="transaction-icon ${x.transactionType==='refund'?'icon-receive':'icon-send'}">${x.transactionType==='refund'?'↓':'↑'}</div>
                <div class="transaction-details">
                  <span class="transaction-title"
                    >${capitalize(x.transactionType)}</span
                  >
                  <span class="transaction-date">${formatDate(x.transactionDate)}</span>
                </div>
              </div>
              <div
                class="transaction-details"
                style="text-align: right"
              >
                <span class="transaction-amount amount-received"
                  >${x.transactionType==='refund'?'+':'-'}&#8377;${x.transactionAmount}</span
                >
                <span class="transaction-status status-completed"
                  >Completed</span
                >
              </div>
            </div>
        `;
        transactionHistorySection.append(div);
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function fetchAddress() {
  try {
    const response = await fetch("/account/address");
    const data = await response.json();
    const addressContainer = document.querySelector(".address-display");
    addressContainer.innerHTML = "";
    data.user.forEach((val) => {
      const addressDiv = document.createElement("div");
      addressDiv.classList.add("address-item");
      addressDiv.innerHTML = `
        <p><strong>House Number:</strong> <span class="houseno-value">${val.houseNumber}</span></p>
        <p><strong>Street:</strong> <span class="street-value">${val.street}</span></p>
        <p><strong>Landmark:</strong> <span class="landmark-value">${val.landMark}</span></p>
        <p><strong>City:</strong> <span class="city-value">${val.city}</span></p>
        <p><strong>District:</strong> <span class="district-value">${val.district}</span></p>
        <p><strong>State:</strong> <span class="state-value">${val.state}</span></p>
        <p><strong>Country:</strong> <span class="country-value">${val.country}</span></p>
        <p><strong>Pin Code:</strong> <span class="pincode-value">${val.pinCode}</span></p>
           <div>
                    <a data-id="${val._id}"  class="editAddress">Edit</a>
                    <a data-id="${val._id}" class="removeAddress">Remove</a>
                  </div>
        <hr style="margin:10px;">
      `;
      addressContainer.appendChild(addressDiv);
    });
    addressDisplaySection.style.display = "block";
    addressEditSection.style.display = "none";
    addressCreateSection.style.display = "none";
  } catch (err) {
    console.log(err);
  }
}

async function showChangePassword() {
  console.log("Showing change password form...");
}

const addressContainer = document.querySelector(".address-display");

addressContainer.addEventListener("click", (event) => {
  event.preventDefault();

  if (event.target.classList.contains("editAddress")) {
    handleEdit(event);
  }

  if (event.target.classList.contains("removeAddress")) {
    handleRemove(event);
  }
});

async function handleEdit(event) {
  const addressId = event.target.getAttribute("data-id");
  console.log("edit click : - " + addressId);
  const response = await fetch(`/update-address/${addressId}`);
  const addressData = await response.json();
  if (addressData.val) {
    addressData.address.address.forEach((a) => {
      console.log(a);
      if (addressId === a._id) {
        countryEditInput.value = a.country;
        addressIdEdit.value = a._id;
        stateEditInput.value = a.state;
        districtEditInput.value = a.district;
        cityEditInput.value = a.city;
        streetEditInput.value = a.street;
        landmarkEditInput.value = a.landMark;
        housenoEditInput.value = a.houseNumber;
        pincodeEditInput.value = a.pinCode;
      }
    });
    addressDisplaySection.style.display = "none";
    addressEditSection.style.display = "block";
    addressCreateSection.style.display = "none";
  }
}

async function handleRemove(event) {
  const addressId = event.target.getAttribute("data-id");
  console.log("remove click : - " + addressId);
  const response = await fetch(`/delete-address/${addressId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (data.val) {
    console.log("Address deleted successfully");
    fetchAddress();
  } else {
    console.error("Failed to delete address");
  }
}

// ~~~~~~~~~~~~~~~~  change password section ~~~~~~~~~~~~~~~~~~~~~

document.querySelector(".btn-saveChangePass").addEventListener("click", (e) => {
  e.preventDefault();
  const currentPasswordInput = document.querySelector(".current-pass");
  const newPasswordInput = document.querySelector(".new-pass");
  const confirmPasswordInput = document.querySelector(".confirm-pass");
  const errCurrentPass = document.querySelector(".err-current-pass");
  const errNewPass = document.querySelector(".err-new-pass");
  const errConfirmPass = document.querySelector(".err-confirm-pass");
  const changePassSaveText = document.querySelector(".btn-saveChangePassText");
  const changePassSaveLoader = document.querySelector(
    ".btn-saveChangePassLoader"
  );
  [errCurrentPass, errNewPass, errConfirmPass].forEach((error) => {
    error.style.display = "none";
    error.textContent = "";
  });
  let isValid = true;
  if (!currentPasswordInput.value) {
    errCurrentPass.style.display = "flex";
    errCurrentPass.textContent = "Current Password cannot be empty.";
    isValid = false;
  } else if (!passwordPattern.test(newPasswordInput.value)) {
    errNewPass.style.display = "flex";
    errNewPass.textContent =
      "New Password must be at least 8 characters long, with uppercase, lowercase, a number, and a special character.";
    isValid = false;
  } else if (confirmPasswordInput.value.length === 0) {
    errConfirmPass.style.display = "flex";
    errConfirmPass.textContent = "Confirm Password cannot be empty.";
    isValid = false;
  } else if (confirmPasswordInput.value !== newPasswordInput.value) {
    errConfirmPass.style.display = "flex";
    errConfirmPass.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (isValid) {
    changePassSaveText.style.display = "flex";
    changePassSaveLoader.style.display = "none";
    errCurrentPass.style.display = "none";
    errNewPass.style.display = "none";
    errConfirmPass.style.display = "none";
    let changePassRequest = async () => {
      try {
        const response = await fetch("/change-password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPass: currentPasswordInput.value,
            newPass: newPasswordInput.value,
          }),
        });
        const data = await response.json();
        if (!data.val) {
          changePassSaveText.style.display = "flex";
          changePassSaveLoader.style.display = "none";
          errCurrentPass.style.display = "flex";
          errCurrentPass.textContent = data.msg;
        } else {
          errCurrentPass.style.display = "none";
          changePassSaveText.style.display = "flex";
          changePassSaveLoader.style.display = "none";
          changePassSaveText.textContent = "Password Changed";
          setTimeout(() => {
            changePassSaveText.textContent = "Save Changes";
          }, 3000);
          currentPasswordInput.value = "";
          newPasswordInput.value = "";
          confirmPasswordInput.value = "";
          console.log("Pass changed");
        }
      } catch (err) {
        console.log("Error fetching:-" + err);
      }
    };
    changePassRequest();
  }
});

// async function fetchOrders(page = 1) {
//   document.querySelector(".ordersInfo").style.display = "block";
//   document.querySelector(".detailsOfOrders").style.display = "none";
//   document.querySelector(".orderedAddrressInfo").style.display = "none";
//   document.querySelector(".pagination").style.display = "flex";

//   try {
//     const response = await fetch(`/account/orders?page=${page}&limit=4`);
//     const data = await response.json();

//     const orderContainer = document.querySelector(".ordersParant");
//     orderContainer.innerHTML = "";

//     if (!data.orders || data.orders.length === 0) {
//       const orderNullTr = document.createElement("tr");
//       orderNullTr.classList.add("order-null-item");
//       orderNullTr.innerHTML = `<td colspan="6">No orders yet!</td>`;
//       orderContainer.appendChild(orderNullTr);
//     } else {
//       data.orders.forEach((data, index) => {
//         const orderDate = new Date(data.orderedAt);
//         const formattedDate = orderDate.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         });

//         const orderRow = document.createElement("tr");
//         orderRow.classList.add("order-item");
//         orderRow.innerHTML = `
//           <td>${index + 1 + (page - 1) * 10}</td>
//           <td>${formattedDate}</td>
//           <td>${data.orderStatus}</td>
//           <td>${data.paymentStatus}</td>
//           <td>&#8377;${data.totalAmount}</td>
//           <td>
//             <a onclick="viewOrderedProduct(event)" class="view__order btnViewOrder" data-id="${data._id}">View</a>
//           </td>
//           <td>
//             <a class="view__order btnCancelOrder" data-id="${data._id}">
//               ${data.orderStatus === "delivered" ? "Request Return" : "Cancel Order"}
//             </a>
//           </td>
//         `;
//         orderContainer.append(orderRow);
//         orderRow.querySelector('.btnCancelOrder').addEventListener('click', (event) => {
//           if (data.orderStatus === 'delivered') {
//             requestReturn(event);
//           } else {
//             cancelOrders(event);
//           }
//         });
//       });
      

//       renderPagination(data.currentPage, data.totalPages);
//     }
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//   }
// }

async function fetchOrders(page = 1) {
  document.querySelector(".ordersInfo").style.display = "block";
  document.querySelector(".detailsOfOrders").style.display = "none";
  document.querySelector(".orderedAddrressInfo").style.display = "none";
  document.querySelector(".pagination").style.display = "flex";

  try {
    const response = await fetch(`/account/orders?page=${page}&limit=4`);
    const data = await response.json();

    const orderContainer = document.querySelector(".ordersParant");
    orderContainer.innerHTML = "";

    if (!data.orders || data.orders.length === 0) {
      const orderNullTr = document.createElement("tr");
      orderNullTr.classList.add("order-null-item");
      orderNullTr.innerHTML = `<td colspan="7">No orders yet!</td>`; // Adjusted for new column
      orderContainer.appendChild(orderNullTr);
    } else {
      data.orders.forEach((order, index) => {
        const orderDate = new Date(order.orderedAt);
        const formattedDate = orderDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const orderRow = document.createElement("tr");
        orderRow.classList.add("order-item");
        orderRow.innerHTML = `
          <td>${index + 1 + (page - 1) * 4}</td> <!-- Adjusted pagination index -->
          <td>${formattedDate}</td>
          <td>${order.orderStatus}</td>
          <td>
          ${order.paymentStatus}
          ${order.paymentStatus === "pending" ? `<a class="btnRetryPayment" data-id="${order._id}"><i class="fa fa-sync-alt"></i></a>` : ""}
          </td>
          <td>&#8377;${order.totalAmount}</td>
          <td>
            <a onclick="viewOrderedProduct(event)" class="view__order btnViewOrder" data-id="${order._id}">View</a>
          </td>
          <td>
            <a class="view__order btnCancelOrder" data-id="${order._id}">
              ${order.orderStatus === "delivered" ? "Request Return" : "Cancel Order"}
            </a>
          </td>
        `;

        orderContainer.append(orderRow);

        orderRow.querySelector('.btnCancelOrder').addEventListener('click', (event) => {
          if (order.orderStatus === 'delivered') {
            requestReturn(event);
          } else {
            cancelOrders(event);
          }
        });

        if (order.paymentStatus === "pending") {
          orderRow.querySelector('.btnRetryPayment').addEventListener('click', (event) => {
            retryPayment(event);
          });
        }
      });

      renderPagination(data.currentPage, data.totalPages);
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}


function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.classList.add("pagination-btn");
    prevButton.innerText = '<';
    prevButton.addEventListener("click", () => fetchOrders(currentPage - 1));
    paginationContainer.appendChild(prevButton);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("pagination-btn");
    pageButton.innerText = i;
    if (i === currentPage) pageButton.classList.add("active");
    pageButton.addEventListener("click", () => fetchOrders(i));
    paginationContainer.appendChild(pageButton);
  }
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.classList.add("pagination-btn");
    nextButton.innerText = ">";
    nextButton.addEventListener("click", () => fetchOrders(currentPage + 1));
    paginationContainer.appendChild(nextButton);
  }
}





function cancelOrders(e) {
  e.target.addEventListener("click",(e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const orderId = e.target.getAttribute("data-id");
        try {
          const response = await fetch(`/cancel-order/${orderId}`, {
            method: "DELETE",
          });
          const data = await response.json({});
          if (data.val) {
            fetchOrders();
            sendNotification('Order Canceled','We’ve processed the cancellation of your order #123 as requested. If this was done in error or you need assistance with placing a new order, please don’t hesitate to contact our support team. Thank you for shopping with us, and we hope to serve you again soon!','order','failed');
          } else {
            console.log(data.msg);
          }
        } catch (err) {
          console.log(err);
        }
        Swal.fire({
          title: "Canceled!",
          text: "Your order has been canceled.",
          icon: "success"
        });
      }
    });
  });
}
function requestReturn(event) {
  const orderId = event.target.getAttribute("data-id");
  Swal.fire({
    title: 'Request Return',
    html: `
      <div class="swalInput">
        <textarea id="returnReason" class="returnReason" placeholder="Enter your reason"></textarea>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Close',
    focusConfirm: false,
    customClass: {
      title: 'custom-title',
      popup: 'swalPopupCustom'
    },
    preConfirm: () => {
      const reason = document.getElementById('returnReason').value.trim();
      if (!reason) {
        Swal.showValidationMessage('Please enter a reason for the return');
        return false;
      }
      return { reason };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const reason = result.value.reason;
      async function requestReturn(){
        try{
          const response = await fetch(`/orders/request-return/${orderId}`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              reasonMsg:reason
            })
          });
          const data = await response.json();
          if(!data.val){
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.msg,
            });
          }else{
            Swal.fire({
              icon: 'success',
              title: 'Submitted!',
              text: 'Your return request has been sent.',
              confirmButtonText: 'OK',
              customClass: {
                title: 'custom-title'
              }
            });
          }
        }catch(err){
          console.log(err);
        }
      }
      requestReturn();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log('Return request canceled');
    }
  });
  
  
}

async function retryPayment(event) {
  const orderId = event.target.getAttribute("data-id");
  Swal.fire({
    title: 'Retry Payment',
    text: 'Do you want to retry the payment for this order?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Retry Payment',
    cancelButtonText: 'Cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/retry-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.val) {
          const options = {
            key: data.key, 
            amount: data.amount, 
            currency: "INR",
            order_id: data.orderId, 
            handler: async function(paymentResponse) {
              try {
                const verifyResponse = await fetch(`/verify-payment`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    paymentId: paymentResponse.razorpay_payment_id,
                    orderId: paymentResponse.razorpay_order_id,
                    signature: paymentResponse.razorpay_signature,
                    retryOrderId:orderId
                  }),
                });

                const verifyData = await verifyResponse.json();
                if (verifyData.val) {
                  Swal.fire({
                    icon: "success",
                    title: "Payment Successful",
                    text: "Your payment has been verified.",
                  });
                  fetchOrders();
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Verification Failed",
                    text: verifyData.msg || "Payment could not be verified.",
                  });
                }
              } catch (err) {
                console.error("Error verifying payment:", err);
                Swal.fire({
                  icon: "error",
                  title: "Verification Error",
                  text: "An error occurred during verification.",
                });
              }
            },
            prefill: {
              name: "User Name", 
              email: "user@example.com",
              contact: "1234567890", 
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzp = new Razorpay(options);
          rzp.open(); 
        } else {
          Swal.fire({
            icon: "error",
            title: "Payment Retry Failed",
            text: data.msg || "Something went wrong.",
          });
        }
      } catch (err) {
        console.error("Error retrying payment:", err);
        Swal.fire({
          icon: "error",
          title: "Payment Retry Failed",
          text: "Error retrying the payment.",
        });
      }
    }
  });
}



const btnViewOrder = document.querySelectorAll('.btnViewOrder');


async function viewOrderedProduct(e) {
  document.querySelector(".ordersInfo").style.display = "none";
  document.querySelector(".pagination").style.display = "none";
  document.querySelector(".detailsOfOrders").style.display = "block";
  document.querySelector(".orderedAddrressInfo").style.display = "block";

  const orderId = e.target.getAttribute("data-id");
  try {
    const response = await fetch(`/view-order-details/${orderId}`);
    const data = await response.json();
    if (data.val) {
      const addressContainer = document.querySelector(
        ".orderedAddress-display"
      );
      const productDetailsTbody = document.querySelector(".orderedProductInfo");
      addressContainer.innerHTML = "";

      const addressDiv = document.createElement("div");
      addressDiv.classList.add("address-item");
      addressDiv.innerHTML = `
        <p><strong>House Number:</strong> <span class="houseno-value">${data.shippingAddress.houseNumber}</span></p>
        <p><strong>Street:</strong> <span class="street-value">${data.shippingAddress.street}</span></p>
        <p><strong>Landmark:</strong> <span class="landmark-value">${data.shippingAddress.landMark}</span></p>
        <p><strong>City:</strong> <span class="city-value">${data.shippingAddress.city}</span></p>
        <p><strong>District:</strong> <span class="district-value">${data.shippingAddress.district}</span></p>
        <p><strong>State:</strong> <span class="state-value">${data.shippingAddress.state}</span></p>
        <p><strong>Country:</strong> <span class="country-value">${data.shippingAddress.country}</span></p>
        <p><strong>Pin Code:</strong> <span class="pincode-value">${data.shippingAddress.pinCode}</span></p>
      `;
      addressContainer.appendChild(addressDiv);

      data.items.forEach((x, index) => {
        const orderDetailTr = document.createElement("tr");
        orderDetailTr.classList.add("order-item");
        orderDetailTr.innerHTML = `
          <td>${index + 1}</td>
          <td>${x.product.name}</td>
          <td>${x.product.price}</td>
          <td>${x.quantity}</td>
          <td>&#8377;${x.offerPrice * x.quantity}</td>
          <td><a href="/details/${
            x.product._id
          }" class="view__order">View</a></td>
        `;
        productDetailsTbody.appendChild(orderDetailTr);
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function toggleEye(inputId, iconElement) {
  const passwordInput = document.getElementById(inputId);
  const isPassword = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPassword ? "text" : "password");
  iconElement.classList.toggle("fa-eye");
  iconElement.classList.toggle("fa-eye-slash");
}


async function sendNotification(title,message,type,status){
  try{
    const response = await fetch('/notifications',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        title,
        message,
        type,
        status
      })
    });
    const data = await response.json();
    if(data.val){
      console.log('Notification sended successfully');
    }else{
      console.log(data.msg);
    }
  }catch(err){
    console.log(`Sending notification error :- ${err}`);
  }
}