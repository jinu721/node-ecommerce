const cropperInstances = [];
const croppedImages = [];
let currentImageIndex = null;

const name = document.getElementById("productName");
const description = document.getElementById("productDescription");
const categorySelect = document.getElementById("productCategory");
const brand = document.getElementById("productBrand");
const ogPrice = document.getElementById("productOgPrice");
const offerPrice = document.getElementById("productOfferPrice");
const tags = document.getElementById("productTags");
const warranty = document.getElementById("productWarranty");
const returnPolicy = document.getElementById("productReturnPolicy");
const cashOnDelivery = document.getElementById("cashOnDelivery");

const nameRegex = /^[a-zA-Z0-9 ]{3,}$/;
const priceRegex = /^\d+(\.\d{1,2})?$/;
const tagsRegex = /^(#\w+)(\s#\w+)*$/;

// Store size and stock data
const sizeStock = {};

function previewAndCrop(event, index) {
  const file = event.target.files[0];
  if (!file) return;

  const cropPreview = document.getElementById(`cropPreview${index}`);
  const cropPreviewSection = document.getElementById(`cropPreviewSection${index}`);

  cropPreview.src = URL.createObjectURL(file);
  cropPreviewSection.style.display = "block";
  if (cropperInstances[index]) {
    cropperInstances[index].destroy();
  }
  cropperInstances[index] = new Cropper(cropPreview, {
    aspectRatio: 1,
    viewMode: 1,
    autoCropArea: 1,
    scalable: true,
    zoomable: true,
    movable: true,
  });

  currentImageIndex = index;
}


function startCropping(index) {
  if (cropperInstances[index]) {
    const cropper = cropperInstances[index];
    const canvas = cropper.getCroppedCanvas();

    if (canvas) {
      canvas.toBlob((blob) => {
        const croppedImageFile = new File(
          [blob],
          `croppedImage${index + 1}.png`,
          {
            type: "image/png",
            lastModified: Date.now(),
          }
        );
        croppedImages[index] = croppedImageFile;

        document.getElementById(`cropPreviewSection${index}`).style.display = "none";
        currentImageIndex = null; 
      });
    } else {
      alert(`Could not retrieve the cropped canvas for index: ${index}`);
    }
  } else {
    alert("Please select an image to crop.");
  }
}

const colorsOption = [];

function addColor() {
  const colorPicker = document.getElementById("colorPicker");
  const selectedColor = colorPicker.value;
  if (!colorsOption.includes(selectedColor)) {
    colorsOption.push(selectedColor);
    const colorCircle = document.createElement("div");
    colorCircle.style.width = "20px";
    colorCircle.style.height = "20px";
    colorCircle.style.backgroundColor = selectedColor;
    colorCircle.style.borderRadius = "50%";
    colorCircle.style.display = "inline-block";
    colorCircle.style.margin = "5px";
    document.getElementById("showColors").appendChild(colorCircle);
  }
  colorPicker.value = "#ffffff";
}

function validateStockInput(stockId, errorMessageId, inputId) {
  const stockInput = document.getElementById(inputId);
  const errorMessage = document.getElementById(errorMessageId);

  if (stockInput.value <= 0 || isNaN(stockInput.value)) {
    console.log("Please enter a positive stock number.");
    return false;
  }
  return true;
}

function handleSizeCheckboxChange(size, stockId, errorMessageId, inputId) {
  const checkbox = document.getElementById(size);
  const stockInputDiv = document.getElementById(stockId);

  if (checkbox.checked) {
    stockInputDiv.style.display = "block"; 
  } else {
    stockInputDiv.style.display = "none"; 
    delete sizeStock[size];
  }
}

function collectStockData() {
  const sizeMap = {
    sizeS: "S",
    sizeM: "M",
    sizeL: "L",
    sizeXL: "XL",
    sizeXXL: "XXL",
    sizeXXXL: "XXXL"
  };

  const allSizes = Object.keys(sizeMap);
  
  allSizes.forEach(size => {
    const stockId = 'stockInput' + size.charAt(size.length - 1).toUpperCase();
    const errorMessageId = 'stock' + size.charAt(size.length - 1).toUpperCase() + 'Error';
    const inputId = 'productStock' + size.charAt(size.length - 1).toUpperCase();

    if (document.getElementById(size).checked) {
      const isValid = validateStockInput(stockId, errorMessageId, inputId);
      if (isValid) {
        const stockValue = document.getElementById(inputId).value;
        const sizeAbbreviation = sizeMap[size];
        sizeStock[sizeAbbreviation] = stockValue;  // Store the size as S, M, L, XL, etc.
      }
    }
  });
  console.log(sizeStock); // Now stores sizes as S, M, L, XL, XXL, XXXL
}

document.querySelectorAll('.checkBoxFOrSizes').forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    const size = checkbox.id;
    const stockId = 'stockInput' + size.charAt(size.length - 1).toUpperCase();
    const errorMessageId = 'stock' + size.charAt(size.length - 1).toUpperCase() + 'Error';
    const inputId = 'productStock' + size.charAt(size.length - 1).toUpperCase();

    handleSizeCheckboxChange(size, stockId, errorMessageId, inputId);
  });
});

function validateAndSubmit() {
  const errorMsgs = document.querySelectorAll(".error-message");
  errorMsgs.forEach((error) => error.remove());
  if (!nameRegex.test(name.value)) {
    showError(name, "Product name must be at least 3 characters long and alphanumeric.");
  } else if (description.value.length < 5) {
    showError(description, "Description must be at least 5 characters long.");
  } else if (categorySelect.value === "") {
    showError(categorySelect, "Please select a category.");
  } else if (!tagsRegex.test(tags.value)) {
    showError(tags, "Tags should start with #, have letters or numbers, and be separated by spaces.");
  } else if (!priceRegex.test(ogPrice.value)) {
    showError(ogPrice, "Original Price must be a valid number with up to 2 decimal places.");
  } else {
    const imageFiles = document.querySelectorAll('input[type="file"]');
    let validImages = true;
    imageFiles.forEach((fileInput, index) => {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileType = file.type.split('/')[1];
        if (!['jpeg', 'jpg', 'png'].includes(fileType)) {
          validImages = false;
          showError(fileInput, "Only PNG, JPG, or JPEG files are allowed.");
        }
      }
    });

    if (!validImages) return;

    collectStockData();

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("description", description.value);
    formData.append("category", categorySelect.value);
    formData.append("brand", brand.value);
    formData.append("price", parseFloat(ogPrice.value));
    formData.append("tags", tags.value);
    formData.append("sizes", JSON.stringify(sizeStock)); 
    formData.append("colors", colorsOption);
    formData.append("cashOnDelivery", cashOnDelivery.checked);
    formData.append("offerPrice", offerPrice.value !== "" ? offerPrice.value : null);
    formData.append("warranty", warranty.value !== "" ? warranty.value : null);
    formData.append("returnPolicy", returnPolicy.value !== "" ? returnPolicy.value : null);

    croppedImages.forEach((croppedImage, index) => {
      if (croppedImage) {
        formData.append(`productImage${index + 1}`, croppedImage);
      }
    });

    (async function addData() {
      try {
        const response = await fetch("/admin/products/add", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data.msg);
      } catch (err) {
        console.log("Error ::- " + err);
      }
    })();
  }
}

function showError(input, message) {
  const error = document.createElement("p");
  error.className = "error-message";
  error.style.color = "red";
  error.textContent = message;
  input.parentElement.appendChild(error);
}

document.querySelector(".btn-CreateProduct").addEventListener("click", (event) => {
  event.preventDefault(); 
  validateAndSubmit();
});

function toggleOfferPriceInput() {
  const offerPriceDiv = document.getElementById("offerPriceDiv");
  const checkbox = document.getElementById("toggleOfferPrice");
  offerPriceDiv.style.display = checkbox.checked ? "block" : "none";
}

function toggleWarrantyInput() {
  const warrantyDiv = document.getElementById("warrantyDiv");
  warrantyDiv.style.display = warrantyDiv.style.display === "none" ? "block" : "none";
}

function toggleReturnPolicyInput() {
  const returnPolicyDiv = document.getElementById("returnPolicyDiv");
  returnPolicyDiv.style.display = returnPolicyDiv.style.display === "none" ? "block" : "none";
}

function toggleStockInput(size) {
  const stockInputDiv = document.getElementById(`stockInput${size}`);
  const checkbox = document.getElementById(`size${size}`);
  stockInputDiv.style.display = checkbox.checked ? 'block' : 'none';
  if (!checkbox.checked) {
    document.getElementById(`productStock${size}`).value = '';
  }
}


// window.onload = function() {
//   const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
//   sizes.forEach(size => {
//     if (document.getElementById(`size${size}`).checked) {
//       toggleStockInput(size);
//     }
//   });
// };



// ~~~~~~~~~~~~~~~~~~~~~ product update ~~~~~~~~~~~~~~~~~~~~~~



// `const updateBtn = document.querySelector('.btnUpdateProduct');

// updateBtn.forEach(elem=>{
  
// })`

const productNameUpdate = document.querySelector('#productUpdateName');
const image1 = document.querySelector('.image1');
const image2 = document.querySelector('.image2');
const image3 = document.querySelector('.image3');
const image4 = document.querySelector('.image4');
const productDescriptionUpdate = document.querySelector('#productUpdateDescription');
const productCategoryUpdate = document.querySelector('#productUpdateCategory');
const productTagsUpdate = document.querySelector('#productUpdateTags');
const productBrandUpdate = document.querySelector('#productUpdateBrand');
const colorPickerUpdate = document.querySelector('#colorPickerUpdate');
const productOgPriceUpdate = document.querySelector('#productUpdateOgPrice');
const productStockUpdate = document.querySelector('#productUpdateStock');
const cashOnDeliveryUpdate = document.querySelector('#cashOnDeliveryUpdate');
const toggleOfferPriceUpdate = document.querySelector('#toggleOfferPriceUpdate');
const toggleWarrantyUpdate = document.querySelector('#toggleWarrantyUpdate');
const returnPolicyUpdate = document.querySelector('#productUpdateReturnPolicy');

const productImagesUpdate = document.querySelectorAll('.product-update-image');
const sizeOptionsUpdate = document.querySelectorAll('.form-check-input'); 


console.log(productBrandUpdate.value)

let currentProductId;
const productUpdateModal = document.getElementById('productUpdateModal');

productUpdateModal.addEventListener('shown.bs.modal', function (event) {
    const button = event.relatedTarget;
    const productId = button.getAttribute('data-id');
    currentProductId = productId;
    console.log("Product ID:", productId);
    fetchProductData(productId);
});
async function fetchProductData(productId) {
  try{
    const response = await fetch(`/admin/update-product/${currentProductId}`);
    const data = await response.json();
    console.log(data)
    productNameUpdate.value = data.data.name;
    productDescriptionUpdate.value = data.data.description;
    // image1.src = data.data.images[0].replace(/\\/g, '/');
    // image2.src = data.data.images[1].replace(/\\/g, '/');
    // image3.src = data.data.images[2].replace(/\\/g, '/');
    // image4.src = data.data.images[3].replace(/\\/g, '/');
    // console.log(data.data.images)
    productTagsUpdate.value = data.data.tags;
    productBrandUpdate.value = data.data.brand;
  }catch(err){
    console.log("Err ::- "+err);
  }
}



// ~~~~~~~~~~~~~~~~~ product List and Unlist ~~~~~~~~~~~~~~~~~~~~~~~


const btnUnlist = document.querySelectorAll(".btnListAndUnlist");

btnUnlist.forEach((elem) => {
  elem.addEventListener("click", async () => {
    try {
      const productId = elem.getAttribute("data-id");
      const res = await fetch(
        `/admin/products/unlist?id=${productId}&val=${elem.textContent}`
      );
      const data = await res.json();
      console.log(data);
      if (data.val) {
        if (elem.textContent === "Unlist") {
          elem.classList.replace(
            "badge-outline-primary",
            "badge-outline-success"
          );
          elem.textContent = "List";
        } else {
          console.log(elem.textContent);
          elem.classList.replace(
            "badge-outline-success",
            "badge-outline-primary"
          );
          elem.textContent = "Unlist";
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
});