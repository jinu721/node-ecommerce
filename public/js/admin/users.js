const phoneElement = document.querySelector(".phone");
const countryElement = document.querySelector(".country");
const stateElement = document.querySelector(".state");
const districtElement = document.querySelector(".district");
const cityElement = document.querySelector(".city");
const streetElement = document.querySelector(".street");
const landmarkElement = document.querySelector(".landmark");
const pincodeElement = document.querySelector(".pincode");

const btnView = document.querySelectorAll(".btn-view");
const userInfoView = document.querySelector(".userInfoView");
const btnBan = document.querySelectorAll(".btn-ban");

btnView.forEach((elem) => {
  console.log("click1");
  elem.addEventListener("click", async () => {
    console.log("click1");
    try {
      const userId = elem.getAttribute("data-id");
      console.log(userId);
      const res = await fetch(`/admin/users/view/${userId}`);
      const data = await res.json();
      console.log(data);
      if (data) {
        data.user.address.forEach((val, index) => {
          const userInfoChild = document.createElement("div");
          userInfoChild.classList.add("childInfo");
          const genarate = `
                    <div class="card">
                    <h4>Address ${index + 1}</h4>
                    <p class="country">Country : ${val.country}</p>
                    <p class="state">State : ${val.state}</p>
                    <p class="district">District : ${val.district}</p>
                    <p class="city">City : ${val.city}</p>
                    <p class="street">Street : ${val.street} </p>
                    <p class="landmark">Landmark : ${val.landMark}</p>
                    <p class="pincode">PinCode : ${val.pinCode}</p>
                </div>
                    `;
          userInfoChild.innerHTML = genarate;
          userInfoView.appendChild(userInfoChild);
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
});

btnBan.forEach((elem) => {
  elem.addEventListener("click", async () => {
    try {
      const userId = elem.getAttribute("data-id");
      const res = await fetch(
        `/admin/users/ban/?id=${userId}&val=${elem.textContent}`
      );
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.val) {
        if (elem.textContent === "Ban") {
          console.log(elem.textContent);
          elem.classList.replace(
            "badge-outline-danger",
            "badge-outline-primary"
          );
          elem.textContent = "Unban";
        } else {
          console.log(elem.textContent);
          elem.classList.replace(
            "badge-outline-primary",
            "badge-outline-danger"
          );
          elem.textContent = "Ban";
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
});