function changeMainImage(clickedImage) {
  const mainImage = document.querySelector("#mainImage");
  const currentMainImageSrc = mainImage.src;
  mainImage.src = clickedImage.src;
  clickedImage.src = currentMainImageSrc;
}

function enableZoom(event) {
  const mainImage = document.getElementById('mainImage');
  const zoomOverlay = document.getElementById('zoomOverlay');

  zoomOverlay.style.display = 'block'; 
  zoomOverlay.style.backgroundImage = `url('${mainImage.src}')`; 
  mainImage.addEventListener('mousemove', (event) => moveZoom(event, mainImage, zoomOverlay));
}

function disableZoom() {
  const zoomOverlay = document.getElementById('zoomOverlay');
  zoomOverlay.style.display = 'none'; 
  const mainImage = document.getElementById('mainImage');
  mainImage.removeEventListener('mousemove', moveZoom); 
}

function moveZoom(event, mainImage, zoomOverlay) {
  const { left, top, width, height } = mainImage.getBoundingClientRect();
  const x = event.clientX - left; 
  const y = event.clientY - top; 

  const bgPosX = (x / width) * 100;
  const bgPosY = (y / height) * 100; 

  zoomOverlay.style.left = `${event.clientX - 75}px`; 
  zoomOverlay.style.top = `${event.clientY - 75}px`; 
  zoomOverlay.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
}



// ~~~~~~~~~~~~~~~~~~~ cart add item ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



let selectedSize = '';
let selectedColor = '';

function selectColor(event) {
  const colorLinks = document.querySelectorAll('.color__link');
  colorLinks.forEach(link => link.classList.remove('selected'));
  event.target.classList.add('selected');
  selectedColor = event.target.getAttribute('data-color-name'); 
  console.log('Selected color:', selectedColor); 
}
function selectSize(event) {
  const sizeLinks = document.querySelectorAll('.size__link');
  sizeLinks.forEach(link => link.classList.remove('size-active'));
  event.target.classList.add('size-active');
  selectedSize = event.target.textContent;  
  console.log('Selected size:', selectedSize);
}

document.querySelectorAll('.color__link').forEach(colorLink => {
  colorLink.addEventListener('click', selectColor);
});

document.querySelectorAll('.size__link').forEach(sizeLink => {
  sizeLink.addEventListener('click', selectSize);
});


const btAddToCart  = document.querySelector('.btAddToCart');

btAddToCart.addEventListener('click',async (e)=>{
  const quantity = document.querySelector('.quantity').value;
  const price = document.querySelector('.currentPrice').textContent;
  console.log(price)
  const productId = e.target.getAttribute('data-id');
  console.log(quantity)
  console.log(productId)
  try{
    const response = await fetch('/add-to-cart',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        productId,
        price:parseInt(price.replace('₹','')),
        quantity:parseInt(quantity),
        size:selectSize,
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
        title: "Good job!",
        text: data.msg,
        icon: "success"
      });
    }
  }catch(err){
    console.log(err);
  }
})

function validateQuantity(input, stock) {
  let value = parseInt(input.value, 10);
  if (value < 1) {
    input.value = 1;
  } else if (value > stock) {
    input.value = stock;
  } else if (isNaN(value)) {
    input.value = 1; 
  }
}

