const loader = document.querySelector(".loaderPlain");

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMoreProducts();
  }
});

let page = 1;
const limit = 10;

async function loadMoreProducts() {
  loader.style.display = "block";
  page++;
  try {
    const response = await fetch(`/shop?page=${page}&limit=${limit}&api=true`);
    const data = await response.json();
    data.products.forEach((product) => {
      const productContainer = document.querySelector(".products__container");
      const productItem = document.createElement("div");
      productItem.classList.add("product__item");
      productItem.innerHTML = `
                <div class="product__banner">
                    <a href="/details/${product._id}" class="product__images">
                        <img src="${product.images[0]}" alt="${
        product.name
      }" class="product__img default" />
                        <img src="${product.images[1]}" alt="${
        product.name
      }" class="product__img hover" />
                    </a>
                    <div class="product__actions">
                        <a href="#" class="action__btn" aria-label="Quick View">
                            <i class="fi fi-rs-eye"></i>
                        </a>
                        <a href="#" class="action__btn" aria-label="Add to Wishlist">
                            <i class="fi fi-rs-heart"></i>
                        </a>
                    </div>
                    <div class="product__badge light-pink">Hot</div>
                </div>
                <div class="product__content">
                    <span class="product__category">${
                      product.categoryName
                    }</span>
                    <h3 class="product__title">${product.name}</h3>
                    <div class="product__rating">
                        <i class="fi fi-rs-star"></i>
                        <i class="fi fi-rs-star"></i>
                        <i class="fi fi-rs-star"></i>
                        <i class="fi fi-rs-star"></i>
                        <i class="fi fi-rs-star"></i>
                    </div>
                    <div class="product__price flex">
                        ${
                          product.offerPrice
                            ? `<span class="new__price">&#8377;${product.offerPrice}</span><span class="old__price">&#8377;${product.price}</span>`
                            : `<span class="new__price">&#8377;${product.price}</span>`
                        }
                    </div>
                    <a href="#" class="action__btn cart__btn" aria-label="Add To Cart">
                        <i class="fi fi-rs-shopping-bag-add"></i>
                    </a>
                </div>
            `;
      productContainer.appendChild(productItem);
      loader.style.display = "none";
    });
  } catch (err) {
    console.log(err);
  }
}

const filterLinks = document.querySelectorAll(".filter-link");

let selectedFilters = {
  sortBy: "Default",
  price: "All",
  category: "All",
  name: "All",
};

filterLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); 
    const filterType = link
      .closest(".filter-col2")
      .querySelector(".mtext-102")
      .textContent.trim()
      .toLowerCase();
    if (link.classList.contains("filter-link-active")) {
      return;
    }
    const otherLinks = link
      .closest(".filter-col2")
      .querySelectorAll(".filter-link");
    otherLinks.forEach((otherLink) => {
      otherLink.classList.remove("filter-link-active");
    });
    link.classList.add("filter-link-active");
    const filterValue = link.textContent.trim();
    if (filterType === "sort by") {
      selectedFilters.sortBy = filterValue;
    } else if (filterType === "price") {
      selectedFilters.price = filterValue;
    } else if (filterType === "category") {
      selectedFilters.category = filterValue;
    } else if (filterType === "by name") {
      selectedFilters.name = filterValue;
    }
    updateFilters();
  });
});

async function updateFilters() {
  const queryParams = new URLSearchParams(selectedFilters).toString();
  try{
    const response = await fetch('/')
  }catch(err){
    console.log(er);
  }
}
