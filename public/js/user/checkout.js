async function fetchAddress() {
    try {
      const response = await fetch("/account/address");
      const data = await response.json();
      console.log(data)
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
  fetchAddress()




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