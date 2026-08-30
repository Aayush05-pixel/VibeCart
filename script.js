// Each object represents one product card in the gallery.
const defaultProducts = [
  {
    id: 1,
    name: "Cloud Tote",
    price: 1299,
    category: "fashion",
    icon: "👜",
    rating: "4.8",
    description:
      "A soft, roomy tote for books, daily essentials, and every unplanned stop.",
    isFavorite: false,
  },
  {
    id: 2,
    name: "Studio Headphones",
    price: 2499,
    category: "tech",
    icon: "🎧",
    rating: "4.9",
    description:
      "Comfortable over-ear headphones with detailed sound for work or unwinding.",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Pebble Lamp",
    price: 1899,
    category: "home",
    icon: "💡",
    rating: "4.6",
    description:
      "A warm, sculptural lamp that makes a desk or bedside table feel calmer.",
    isFavorite: false,
  },
  {
    id: 4,
    name: "Weekend Sneakers",
    price: 2199,
    category: "fashion",
    icon: "👟",
    rating: "4.7",
    description:
      "Lightweight sneakers designed for easy everyday walks and weekend plans.",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Pocket Speaker",
    price: 1599,
    category: "tech",
    icon: "🔊",
    rating: "4.5",
    description:
      "A compact wireless speaker that brings a little music anywhere.",
    isFavorite: false,
  },
  {
    id: 6,
    name: "Soft Cushion",
    price: 799,
    category: "home",
    icon: "🛋️",
    rating: "4.8",
    description:
      "A textured cushion that adds comfort and a relaxed finish to any room.",
    isFavorite: false,
  },
];

// Use saved products if they exist; otherwise, start with the original sample products.
// Every product gets a `hidden` flag: this is the single source of truth the whole
// gallery uses to show/hide a product instantly, without ever reloading the page.
let products = loadProducts().map((product) => ({
  hidden: false,
  ...product,
}));

// These variables connect JavaScript to elements in index.html.
const productGrid = document.querySelector("#productGrid");
const productCount = document.querySelector("#productCount");
const emptyMessage = document.querySelector("#emptyMessage");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const sortSelect = document.querySelector("#sortSelect");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
const themeToggle = document.querySelector("#themeToggle");
const favoritesSection = document.querySelector("#favoritesSection");
const favoritesGrid = document.querySelector("#favoritesGrid");
const favoritesCount = document.querySelector("#favoritesCount");
const bagPanel = document.querySelector("#bagPanel");
const bagOverlay = document.querySelector("#bagOverlay");
const bagItems = document.querySelector("#bagItems");
const bagTotal = document.querySelector("#bagTotal");
const productModal = document.querySelector("#productModal");
const modalContent = document.querySelector("#modalContent");
const manageToggle = document.querySelector("#manageToggle");
const manageSection = document.querySelector("#manageSection");
const productForm = document.querySelector("#productForm");
const manageProductsList = document.querySelector("#manageProductsList");

// These variables remember the current state of the page.
let activeCategory = "all";
let bag = [];
let toastTimer;

// Save changes in this browser so added and deleted products remain after refresh.
function saveProducts() {
  try {
    localStorage.setItem("vibeCartProducts", JSON.stringify(products));
  } catch {
    // The gallery still works if this browser does not allow local storage.
  }
}

function loadProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem("vibeCartProducts"));
    return Array.isArray(savedProducts)
      ? savedProducts
      : defaultProducts.map((product) => ({ ...product }));
  } catch {
    return defaultProducts.map((product) => ({ ...product }));
  }
}

// This turns 1299 into the readable price ₹1,299.
function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

// This creates one reusable product card for the main and favourites sections.
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  card.innerHTML = `
    <div class="product-visual ${product.category}">
      ${product.imageUrl ? `<img class="product-image" src="${product.imageUrl}" alt="${product.name}">` : product.icon}
      <button class="favorite-button ${product.isFavorite ? "is-favorite" : ""}" type="button" aria-label="Save ${product.name}">♥</button>
    </div>
    <div class="product-details">
      <p class="product-category">${product.category}</p>
      <div class="product-name-row">
        <h2 class="product-name">${product.name}</h2>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
      <p class="product-rating">★ ${product.rating} rating</p>
      <button class="add-button" type="button">Add to bag</button>
      <button class="details-button" type="button">View details</button>
    </div>
  `;

  card.querySelector(".favorite-button").addEventListener("click", () => {
    product.isFavorite = !product.isFavorite;
    saveProducts();
    updateGallery();
    renderFavorites();
  });

  card
    .querySelector(".add-button")
    .addEventListener("click", () => addToBag(product));
  card
    .querySelector(".details-button")
    .addEventListener("click", () => openProductModal(product));

  return card;
}

// This function receives a list of products and creates their HTML cards.
function displayProducts(productList) {
  productGrid.innerHTML = "";
  productList.forEach((product) =>
    productGrid.appendChild(createProductCard(product)),
  );

  productCount.textContent = `${productList.length} product${productList.length === 1 ? "" : "s"} found`;
  emptyMessage.hidden = productList.length !== 0;
}

// This shows the saved products below the main product grid.
function renderFavorites() {
  const favoriteProducts = products.filter(
    (product) => product.isFavorite && !product.hidden,
  );
  favoritesGrid.innerHTML = "";
  favoritesSection.hidden = favoriteProducts.length === 0;
  favoritesCount.textContent = `${favoriteProducts.length} saved`;
  favoriteProducts.forEach((product) =>
    favoritesGrid.appendChild(createProductCard(product)),
  );
}

// This lists every product in the manager — visible and hidden alike — with a
// button that toggles whether it currently appears in the gallery.
function renderManageProducts() {
  manageProductsList.innerHTML = "";

  products.forEach((product) => {
    const manageItem = document.createElement("article");
    manageItem.className = `manage-product${product.hidden ? " is-hidden" : ""}`;
    manageItem.innerHTML = `
      <div class="manage-product-info">
        <span class="manage-product-icon">${product.icon}</span>
        <div>
          <h3 class="manage-product-name">${product.name}</h3>
          <p class="manage-product-meta">
            ${product.category} · ${formatPrice(product.price)}
            ${product.hidden ? '<span class="hidden-tag">Hidden</span>' : ""}
          </p>
        </div>
      </div>
      <button class="visibility-toggle-button${product.hidden ? " is-show" : ""}" type="button">
        ${product.hidden ? "Show" : "Hide"}
      </button>
    `;

    manageItem
      .querySelector(".visibility-toggle-button")
      .addEventListener("click", () => toggleProductVisibility(product.id));
    manageProductsList.appendChild(manageItem);
  });
}

// Show or hide a product in the gallery — instantly, with no page reload.
// Hiding a product also drops it from the bag, since a shopper should not be
// able to check out with an item the store no longer displays.
function toggleProductVisibility(productId) {
  const product = products.find((entry) => entry.id === productId);
  product.hidden = !product.hidden;

  if (product.hidden) {
    bag = bag.filter((item) => item.productId !== productId);
    productModal.hidden = true;
  }

  saveProducts();
  updateGallery();
  renderFavorites();
  renderBag();
  renderManageProducts();
  showToast(product.hidden ? `${product.name} hidden` : `${product.name} shown`);
}

// This function applies the selected category, search word, and sort option.
function updateGallery() {
  const searchText = searchInput.value.toLowerCase().trim();
  const matchingProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch && !product.hidden;
  });

  if (sortSelect.value === "low-high") {
    matchingProducts.sort((first, second) => first.price - second.price);
  }

  if (sortSelect.value === "high-low") {
    matchingProducts.sort((first, second) => second.price - first.price);
  }

  displayProducts(matchingProducts);
}

// Add one product to the bag, or increase its quantity if it is already there.
function addToBag(product) {
  const existingItem = bag.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    bag.push({ productId: product.id, quantity: 1 });
  }

  renderBag();
  showToast(`${product.name} added to your bag`);
}

// Draw the bag panel and calculate its total price and item count.
function renderBag() {
  const itemCount = bag.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = bag.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return total + product.price * item.quantity;
  }, 0);

  cartCount.textContent = itemCount;
  bagTotal.textContent = formatPrice(totalPrice);
  bagItems.innerHTML = "";

  if (bag.length === 0) {
    bagItems.innerHTML =
      '<p class="bag-empty">Your bag is waiting for something lovely.</p>';
    return;
  }

  bag.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const bagItem = document.createElement("article");
    bagItem.className = "bag-item";
    bagItem.innerHTML = `
      <div class="bag-icon ${product.category}">${product.imageUrl ? `<img class="bag-image" src="${product.imageUrl}" alt="${product.name}">` : product.icon}</div>
      <div>
        <h3 class="bag-name">${product.name}</h3>
        <p class="bag-price">${formatPrice(product.price)}</p>
      </div>
      <div class="quantity-controls">
        <button class="quantity-button decrease-button" type="button" aria-label="Decrease ${product.name}">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-button increase-button" type="button" aria-label="Increase ${product.name}">+</button>
      </div>
    `;

    bagItem
      .querySelector(".decrease-button")
      .addEventListener("click", () => changeQuantity(product.id, -1));
    bagItem
      .querySelector(".increase-button")
      .addEventListener("click", () => changeQuantity(product.id, 1));
    bagItems.appendChild(bagItem);
  });
}

// Change a bag item's quantity. It is removed when its quantity becomes zero.
function changeQuantity(productId, amount) {
  const item = bag.find((entry) => entry.productId === productId);
  item.quantity += amount;

  if (item.quantity === 0) {
    bag = bag.filter((entry) => entry.productId !== productId);
  }

  renderBag();
}

// Open the product popup and fill it with the selected product's information.
function openProductModal(product) {
  modalContent.innerHTML = `
    <div class="modal-layout">
      <div class="modal-visual ${product.category}">${product.imageUrl ? `<img class="product-image" src="${product.imageUrl}" alt="${product.name}">` : product.icon}</div>
      <div class="modal-details">
        <p class="product-category">${product.category}</p>
        <h2 id="modalProductName">${product.name}</h2>
        <p class="product-rating">★ ${product.rating} rating</p>
        <p class="modal-description">${product.description}</p>
        <p class="modal-price">${formatPrice(product.price)}</p>
        <button class="add-button modal-add-button" type="button">Add to bag</button>
      </div>
    </div>
  `;

  modalContent
    .querySelector(".modal-add-button")
    .addEventListener("click", () => addToBag(product));
  productModal.hidden = false;
}

// Briefly show a message after the user adds an item to the bag.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Open and close the shopping bag panel.
function openBag() {
  bagPanel.classList.add("open");
  bagOverlay.classList.add("visible");
  bagPanel.setAttribute("aria-hidden", "false");
}

function closeBag() {
  bagPanel.classList.remove("open");
  bagOverlay.classList.remove("visible");
  bagPanel.setAttribute("aria-hidden", "true");
}

searchInput.addEventListener("input", updateGallery);
sortSelect.addEventListener("change", updateGallery);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateGallery();
  });
});
document.querySelector("#cartButton").addEventListener("click", openBag);
document.querySelector("#closeBag").addEventListener("click", closeBag);
bagOverlay.addEventListener("click", closeBag);
document
  .querySelector("#closeModal")
  .addEventListener("click", () => (productModal.hidden = true));
productModal.addEventListener("click", (event) => {
  if (event.target === productModal) productModal.hidden = true;
});

// Show or hide the personal product manager.
manageToggle.addEventListener("click", () => {
  manageSection.hidden = !manageSection.hidden;
  manageToggle.textContent = manageSection.hidden
    ? "Manage products"
    : "Close manager";
  if (!manageSection.hidden)
    manageSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#closeManage").addEventListener("click", () => {
  manageSection.hidden = true;
  manageToggle.textContent = "Manage products";
});

// Convert a selected image file into text that can be displayed and saved in the browser.
function readImageFile(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject());
    reader.readAsDataURL(imageFile);
  });
}

// Read the form fields, create a product object, and add it to the gallery.
productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(productForm);
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const imageFile = formData.get("imageFile");

  if (!imageUrl && (!imageFile || imageFile.size === 0)) {
    showToast("Add a direct image URL or upload an image first");
    return;
  }

  if (imageFile && imageFile.size > 1500000) {
    showToast("Choose an image smaller than 1.5 MB");
    return;
  }

  const savedImage =
    imageUrl ||
    (imageFile && imageFile.size > 0 ? await readImageFile(imageFile) : "");
  const ratingValue = Number(formData.get("rating"));

  const newProduct = {
    id: Date.now(),
    name: String(formData.get("name") || "").trim(),
    price: Number(formData.get("price")),
    category: String(formData.get("category") || "fashion"),
    icon: "🛍️",
    imageUrl: savedImage,
    rating: Number.isFinite(ratingValue) ? ratingValue.toFixed(1) : "4.5",
    description: String(formData.get("description") || "").trim(),
    isFavorite: false,
    hidden: false,
  };

  products.unshift(newProduct);
  saveProducts();
  productForm.reset();
  productForm.elements.rating.value = "4.5";
  updateGallery();
  renderFavorites();
  renderManageProducts();
  showToast(`${newProduct.name} added to the gallery`);
});

// Show all products and an empty bag once when the page first opens.
updateGallery();
renderFavorites();
renderBag();
renderManageProducts();
