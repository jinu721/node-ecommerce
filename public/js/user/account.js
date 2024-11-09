// ~~~~~~~~~~~~~~~~~~ update profile section ~~~~~~~~~~~~~~~~~~

// section and buttons
const profileInfo = document.querySelector(".profile-info");
const updateForm = document.querySelector(".updateform");
const editButton = document.querySelector(".edit-profile");
const updateButton = updateForm.querySelector(".updatebtn");

// Form fields
const usernameField = updateForm.querySelector(".usernameUpdate");
const emailField = updateForm.querySelector(".emailUpdate");
const phoneField = updateForm.querySelector(".phoneUpdate") || null;

// Error message containers
const usernameError = document.querySelector(".error-msg-updateUsername");
const emailError = document.querySelector(".error-msg-updateEmail");
const phoneError = document.querySelector(".error-msg-updatePhone");

// Validation patterns
const usernamePattern = /^[a-zA-Z0-9_]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+[0-9]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// when edit button click
editButton.addEventListener("click", (e) => {
  e.preventDefault();
  profileInfo.style.display = "none";
  updateForm.style.display = "grid"; // Show the update form
});

// Add validation and submission logic for the update form

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
  if (!emailPattern.test(emailField.value)) {
    emailError.style.display = "block";
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  } else {
    emailError.style.display = "none";
  }
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
      email: emailField.value,
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
          emailError.style.display = "none";
          phoneError.style.display = "none";
          document.querySelector(".displayUsername").textContent =
            parsedData.user.username;
          document.querySelector(".displayEmail").textContent =
            parsedData.user.email;
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

createAddressText.addEventListener("click", () => {
  addressShow.style.display = "none";
  addressFormCreate.style.display = "block";
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
                    <p data-id="${val._id}" class="editAddress">Edit</p>
                    <p data-id="${val._id}" class="removeAddress">Remove</p>
                  </div>
        <hr style="margin:10px;">
      `;
            addressContainer.appendChild(addressDiv);
          });
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

async function fetchOrders() {
  console.log("Fetching orders...");
}

async function fetchWallet() {
  console.log("Fetching wallet data...");
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
    addressData.address.address.forEach((a)=>{
      console.log(a)
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
    })
    addressShow.style.display = "none";
    addressFormEdit.style.display = "block";
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
  const changePassSaveLoader = document.querySelector(".btn-saveChangePassLoader");
  [errCurrentPass, errNewPass, errConfirmPass].forEach((error) => {
    error.style.display = "none";
    error.textContent = "";
  });
  let isValid = true;
  if (!currentPasswordInput.value) {
    errCurrentPass.style.display = "flex";
    errCurrentPass.textContent = "Current Password cannot be empty.";
    isValid = false;
  }
  else if (!passwordPattern.test(newPasswordInput.value)) {
    errNewPass.style.display = "flex";
    errNewPass.textContent = "New Password must be at least 8 characters long, with uppercase, lowercase, a number, and a special character.";
    isValid = false;
  }
  else if (confirmPasswordInput.value.length === 0) {
    errConfirmPass.style.display = "flex";
    errConfirmPass.textContent = "Confirm Password cannot be empty.";
    isValid = false;
  } 
  
  else if (confirmPasswordInput.value !== newPasswordInput.value) {
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
    let changePassRequest = async ()=>{
      try{
        const response = await fetch('/change-password',{
          method:'PATCH',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            currentPass:currentPasswordInput.value,
            newPass:newPasswordInput.value
          })
        })
        const data = await response.json();
        if(!data.val){
          changePassSaveText.style.display = "flex";
          changePassSaveLoader.style.display = "none";
          errCurrentPass.style.display = "flex";
          errCurrentPass.textContent = data.msg;
        }else{
          errCurrentPass.style.display = "none";
          changePassSaveText.style.display = "flex";
          changePassSaveLoader.style.display = "none";
          changePassSaveText.textContent = "Password Changed";
          setTimeout(()=>{
            changePassSaveText.textContent = "Save Changes";
          },3000);
          currentPasswordInput.value = ""
          newPasswordInput.value = ""
          confirmPasswordInput.value = ""
          console.log("Pass changed");
        }
      }catch(err){
        console.log('Error fetching:-'+err);
      }
    }
    changePassRequest();
  }
});
