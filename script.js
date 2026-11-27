
/* =========================================
   RONA GOODS — STORE CONFIGURATION
========================================= */

// Ganti dengan nomor WhatsApp bisnis kamu.
// Format: kode negara + nomor, tanpa tanda + atau spasi.
// Contoh Indonesia: 6281234567890
const WHATSAPP_NUMBER = "6281234567890";

const products = [
  {
    id: 1,
    name: "The Daily Tote",
    category: "bags",
    categoryLabel: "Bags",
    price: 189000,
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85",
    description: "Tas sehari-hari dengan desain minimalis yang mudah dipadukan. Cocok untuk menemani aktivitas kerja, kuliah, maupun perjalanan santai."
  },
  {
    id: 2,
    name: "Sunday Shoulder Bag",
    category: "bags",
    categoryLabel: "Bags",
    price: 249000,
    tag: "New arrival",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85",
    description: "Shoulder bag dengan siluet timeless dan warna netral. Pilihan praktis untuk tampilan kasual yang tetap rapi."
  },
  {
    id: 3,
    name: "Everyday Pouch",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 89000,
    tag: "",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=85",
    description: "Pouch serbaguna untuk menyimpan barang-barang kecil agar lebih terorganisir. Ringkas dan mudah dibawa."
  },
  {
    id: 4,
    name: "Soft Form Wallet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 129000,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=85",
    description: "Dompet compact dengan desain sederhana. Dirancang untuk membawa kebutuhan esensial tanpa membuat tas terasa penuh."
  },
  {
    id: 5,
    name: "Sunday Ceramic Cup",
    category: "home",
    categoryLabel: "Home living",
    price: 79000,
    tag: "Handpicked",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=85",
    description: "Cangkir keramik untuk menemani ritual kopi atau teh harian. Desain sederhana yang membuat momen kecil terasa lebih menyenangkan."
  },
  {
    id: 6,
    name: "Little Space Vase",
    category: "home",
    categoryLabel: "Home living",
    price: 115000,
    tag: "",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=85",
    description: "Vas dekoratif untuk mempercantik meja, rak, atau sudut ruangan favoritmu. Cocok dipadukan dengan bunga segar maupun kering."
  },
  {
    id: 7,
    name: "Daily Notes Journal",
    category: "stationery",
    categoryLabel: "Stationery",
    price: 65000,
    tag: "Best pick",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85",
    description: "Jurnal untuk menuangkan ide, rencana, dan cerita sehari-hari. Ruang kecil untuk menyimpan hal-hal yang berarti."
  },
  {
    id: 8,
    name: "The Simple Planner",
    category: "stationery",
    categoryLabel: "Stationery",
    price: 95000,
    tag: "",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=85",
    description: "Planner simpel untuk membantu mengatur aktivitas dan prioritas. Mulai hari dengan rencana yang lebih terarah."
  }
];

/* =========================================
   APP STATE
========================================= */

const STORAGE_KEYS = {
  cart: "rona_goods_cart",
  wishlist: "rona_goods_wishlist"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Storage tidak dapat dibaca:", error);
    return fallback;
  }
}

let cart = readStorage(STORAGE_KEYS.cart, []);
let wishlist = readStorage(STORAGE_KEYS.wishlist, []);

let activeCategory = "all";
let searchTerm = "";
let sortMode = "featured";
let wishlistMode = false;
let toastTimeout;

/* =========================================
   DOM ELEMENTS
========================================= */

const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const overlay = document.getElementById("overlay");

const productModal = document.getElementById("productModal");
const productModalContent = document.getElementById("productModalContent");

const checkoutModal = document.getElementById("checkoutModal");
const toastElement = document.getElementById("toast");

/* =========================================
   HELPERS
========================================= */

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
}

function getProduct(productId) {
  return products.find(product => product.id === Number(productId));
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2400);
}

function openOverlay() {
  overlay.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeAllPanels() {
  cartDrawer.classList.remove("active");
  productModal.classList.remove("active");
  checkoutModal.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

function openCart() {
  closeAllPanels();
  cartDrawer.classList.add("active");
  openOverlay();
}

function closeCart() {
  cartDrawer.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

function openModal(modal) {
  closeAllPanels();
  modal.classList.add("active");
  openOverlay();
}

/* =========================================
   PRODUCT RENDERING
========================================= */

function getFilteredProducts() {
  let filtered = [...products];

  if (activeCategory !== "all") {
    filtered = filtered.filter(
      product => product.category === activeCategory
    );
  }

  if (searchTerm.trim()) {
    const keyword = searchTerm.toLowerCase().trim();

    filtered = filtered.filter(product => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.categoryLabel.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    });
  }

  if (wishlistMode) {
    filtered = filtered.filter(product =>
      wishlist.includes(product.id)
    );
  }

  switch (sortMode) {
    case "low-high":
      filtered.sort((a, b) => a.price - b.price);
      break;

    case "high-low":
      filtered.sort((a, b) => b.price - a.price);
      break;

    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;

    default:
      break;
  }

  return filtered;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = "";

  resultCount.textContent = `Showing ${filteredProducts.length} products`;

  emptyState.hidden = filteredProducts.length !== 0;
  productGrid.hidden = filteredProducts.length === 0;

  filteredProducts.forEach(product => {
    const isFavorite = wishlist.includes(product.id);

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${product.tag ? `
          <span class="product-tag">${product.tag}</span>
        ` : ""}

        <button
          class="product-heart ${isFavorite ? "active" : ""}"
          data-action="wishlist"
          data-id="${product.id}"
          aria-label="Tambah ${product.name} ke wishlist"
        >
          <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>

        <button
          class="quick-view-button"
          data-action="quick-view"
          data-id="${product.id}"
        >
          QUICK VIEW
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3 class="product-name">${product.name}</h3>

        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>

          <button
            class="add-button"
            data-action="add-cart"
            data-id="${product.id}"
            aria-label="Tambah ${product.name} ke keranjang"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

/* =========================================
   CATEGORY FILTER
========================================= */

document.getElementById("categoryList").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;
  wishlistMode = false;

  document.querySelectorAll(".category-button").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");

  document.getElementById("wishlistToggle").classList.remove("active");

  renderProducts();
});

/* =========================================
   SEARCH
========================================= */

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchToggle").addEventListener("click", () => {
  searchPanel.classList.toggle("active");

  if (searchPanel.classList.contains("active")) {
    searchInput.focus();
  }
});

document.getElementById("closeSearch").addEventListener("click", () => {
  searchPanel.classList.remove("active");
  searchInput.value = "";
  searchTerm = "";
  renderProducts();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

document.getElementById("clearFilters").addEventListener("click", () => {
  activeCategory = "all";
  searchTerm = "";
  sortMode = "featured";
  wishlistMode = false;

  searchInput.value = "";
  document.getElementById("sortSelect").value = "featured";

  document.querySelectorAll(".category-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === "all"
    );
  });

  document.getElementById("wishlistToggle").classList.remove("active");

  renderProducts();
});

document.getElementById("resetSearch").addEventListener("click", () => {
  document.getElementById("clearFilters").click();
});

/* =========================================
   SORTING
========================================= */

document.getElementById("sortSelect").addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(productId) {
  const id = Number(productId);

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Produk dihapus dari wishlist.");
  } else {
    wishlist.push(id);
    showToast("Produk ditambahkan ke wishlist.");
  }

  saveWishlist();
  updateHeaderCounts();
  renderProducts();
}

document.getElementById("wishlistToggle").addEventListener("click", () => {
  wishlistMode = !wishlistMode;

  const wishlistButton = document.getElementById("wishlistToggle");
  wishlistButton.classList.toggle("active", wishlistMode);

  activeCategory = "all";

  document.querySelectorAll(".category-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === "all"
    );
  });

  renderProducts();

  document.getElementById("shop").scrollIntoView({
    behavior: "smooth"
  });

  if (wishlistMode) {
    showToast("Menampilkan produk wishlist kamu.");
  }
});

/* =========================================
   PRODUCT GRID ACTIONS
========================================= */

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const action = button.dataset.action;
  const productId = Number(button.dataset.id);

  if (action === "wishlist") {
    toggleWishlist(productId);
  }

  if (action === "add-cart") {
    addToCart(productId);
  }

  if (action === "quick-view") {
    openProductModal(productId);
  }
});

/* =========================================
   QUICK VIEW MODAL
========================================= */

function openProductModal(productId) {
  const product = getProduct(productId);

  if (!product) return;

  productModalContent.innerHTML = `
    <div class="quick-view">
      <div class="quick-view-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="quick-view-info">
        <span class="eyebrow">${product.categoryLabel}</span>
        <h2>${product.name}</h2>
        <span class="quick-price">${formatPrice(product.price)}</span>
        <p>${product.description}</p>

        <button
          class="button button-dark"
          id="quickAddButton"
        >
          Add to bag <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;

  openModal(productModal);

  document.getElementById("quickAddButton").addEventListener("click", () => {
    addToCart(product.id);
    closeAllPanels();
    openCart();
  });
}

document.getElementById("closeProductModal").addEventListener("click", closeAllPanels);

/* =========================================
   CART
========================================= */

function addToCart(productId) {
  const product = getProduct(productId);

  if (!product) return;

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  updateHeaderCounts();

  showToast(`${product.name} ditambahkan ke bag.`);
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === Number(productId));

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== Number(productId));
  }

  saveCart();
  renderCart();
  updateHeaderCounts();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== Number(productId));

  saveCart();
  renderCart();
  updateHeaderCounts();

  showToast("Produk dihapus dari bag.");
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);

    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
  cartItems.innerHTML = "";

  const hasItems = cart.length > 0;

  cartEmpty.style.display = hasItems ? "none" : "flex";
  cartFooter.style.display = hasItems ? "block" : "none";

  document.getElementById("drawerCartCount").textContent =
    `(${getCartQuantity()})`;

  document.getElementById("cartSubtotal").textContent =
    formatPrice(getCartTotal());

  document.getElementById("checkoutTotal").textContent =
    formatPrice(getCartTotal());

  if (!hasItems) return;

  cart.forEach(item => {
    const product = getProduct(item.id);

    if (!product) return;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}">

      <div class="cart-item-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h4>${product.name}</h4>
        <span>${formatPrice(product.price)}</span>

        <div class="quantity-control">
          <button
            data-cart-action="decrease"
            data-id="${product.id}"
            aria-label="Kurangi jumlah"
          >−</button>

          <span>${item.quantity}</span>

          <button
            data-cart-action="increase"
            data-id="${product.id}"
            aria-label="Tambah jumlah"
          >+</button>
        </div>
      </div>

      <div class="cart-item-side">
        <strong>${formatPrice(product.price * item.quantity)}</strong>

        <button
          class="remove-item"
          data-cart-action="remove"
          data-id="${product.id}"
          aria-label="Hapus produk"
        >
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-cart-action]");

  if (!button) return;

  const action = button.dataset.cartAction;
  const productId = Number(button.dataset.id);

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeFromCart(productId);
  }
});

function updateHeaderCounts() {
  document.getElementById("cartCount").textContent = getCartQuantity();
  document.getElementById("wishlistCount").textContent = wishlist.length;
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);

document.getElementById("continueShopping").addEventListener("click", () => {
  closeCart();

  document.getElementById("shop").scrollIntoView({
    behavior: "smooth"
  });
});

/* =========================================
   CHECKOUT
========================================= */

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Keranjang kamu masih kosong.");
    return;
  }

  renderCart();
  openModal(checkoutModal);
});

document.getElementById("closeCheckoutModal").addEventListener("click", () => {
  closeAllPanels();
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Keranjang kamu masih kosong.");
    closeAllPanels();
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerAddress = document.getElementById("customerAddress").value.trim();
  const customerNote = document.getElementById("customerNote").value.trim();

  if (!customerName || !customerPhone || !customerAddress) {
    showToast("Lengkapi data pemesanan terlebih dahulu.");
    return;
  }

  if (!/^[0-9+\-\s()]{8,20}$/.test(customerPhone)) {
    showToast("Periksa kembali nomor WhatsApp kamu.");
    return;
  }

  if (
    WHATSAPP_NUMBER === "6281234567890" ||
    !/^\d{9,15}$/.test(WHATSAPP_NUMBER)
  ) {
    showToast("Atur nomor WhatsApp toko di script.js terlebih dahulu.");
    return;
  }

  const orderLines = cart.map((item, index) => {
    const product = getProduct(item.id);

    return `${index + 1}. ${product.name}
   ${item.quantity} x ${formatPrice(product.price)}
   Subtotal: ${formatPrice(product.price * item.quantity)}`;
  });

  const message = `
Halo Rona Goods! Saya ingin melakukan pemesanan.

*DETAIL PEMESAN*
Nama: ${customerName}
WhatsApp: ${customerPhone}
Alamat: ${customerAddress}

*DETAIL PESANAN*
${orderLines.join("\n\n")}

*TOTAL: ${formatPrice(getCartTotal())}*

Catatan:
${customerNote || "-"}

Mohon informasikan ketersediaan produk dan biaya pengiriman. Terima kasih!
  `.trim();

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");

  closeAllPanels();
});

/* =========================================
   NEWSLETTER DEMO
========================================= */

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput.value.trim();

  if (!email) return;

  showToast("Thank you! Email kamu berhasil didaftarkan (demo).");

  emailInput.value = "";
});

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("active");

  menuToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("active");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

/* =========================================
   FOOTER CONTACT
========================================= */

document.getElementById("footerContact").addEventListener("click", event => {
  event.preventDefault();

  if (
    WHATSAPP_NUMBER === "6281234567890" ||
    !/^\d{9,15}$/.test(WHATSAPP_NUMBER)
  ) {
    showToast("Atur nomor WhatsApp toko di script.js terlebih dahulu.");
    return;
  }

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo Rona Goods, saya ingin bertanya.")}`,
    "_blank",
    "noopener,noreferrer"
  );
});

/* =========================================
   OVERLAY & KEYBOARD
========================================= */

overlay.addEventListener("click", closeAllPanels);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeAllPanels();
    searchPanel.classList.remove("active");
    mainNav.classList.remove("active");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

/* =========================================
   INITIALIZATION
========================================= */

function initializeApp() {
  // Pastikan hanya produk yang valid yang dipakai.
  cart = cart.filter(item =>
    getProduct(item.id) && Number(item.quantity) > 0
  );

  wishlist = wishlist.filter(id => getProduct(id));

  saveCart();
  saveWishlist();

  renderProducts();
  renderCart();
  updateHeaderCounts();

  document.getElementById("currentYear").textContent =
    new Date().getFullYear();
}

initializeApp();
