/* javascript.js - Wonder Stickers (clean, ASCII-safe, improved) */

/* ---------- Config ---------- */
var STORAGE_KEY = 'ws_cart_v1';
var CURRENCY = { locale: 'en-IN', code: 'INR' };
var WHATSAPP_NUMBER = '919220727618'; // your WhatsApp business number (country code, no plus)

/* ---------- Products (simple ASCII names/paths) ---------- */
var PRODUCTS = [
  { id: 'p1',  name: 'Diwali Sticker Pack (20 pcs)',              price: 120, img: 'images/p1.png' },
  { id: 'p2',  name: 'Christmas Sticker Pack (15 pcs)',          price: 60,  img: 'images/p2.png' },
  { id: 'p3',  name: 'Birthday Sticker Set (10 pcs)',            price: 230, img: 'images/p3.png' },
  { id: 'p4',  name: 'Custom Name Sticker (Single)',             price: 100, img: 'images/p4.png' },
  { id: 'p5',  name: 'New Year Sticker Pack (25 pcs)',           price: 150, img: 'images/p5.png' },
  { id: 'p6',  name: 'Raksha Bandhan Sticker Pack (15 pcs)',     price: 90,  img: 'images/p6.png' },
  { id: 'p7',  name: 'Holi Colors Sticker Pack (30 pcs)',        price: 200, img: 'images/p7.png' },
  { id: 'p8',  name: 'Independence Day Sticker Pack (10 pcs)',   price: 80,  img: 'images/p8.png' },
  { id: 'p9',  name: 'Ganesh Chaturthi Sticker Pack (12 pcs)',   price: 110, img: 'images/p9.png' },
  { id: 'p10', name: 'Navratri Sticker Pack (18 pcs)',           price: 160, img: 'images/p10.png' },
  { id: 'p11', name: 'Karva Chauth Sticker Pack (8 pcs)',        price: 70,  img: 'images/p11.png' },
  { id: 'p12', name: 'Eid Mubarak Sticker Pack (20 pcs)',        price: 140, img: 'images/p12.png' },
  { id: 'p13', name: "Valentine's Day Sticker Pack (15 pcs)",   price: 120, img: 'images/p13.png' },
  { id: 'p14', name: 'Friendship Day Sticker Pack (12 pcs)',     price: 95,  img: 'images/p14.png' },
  { id: 'p15', name: "Teacher's Day Sticker Pack (10 pcs)",     price: 85,  img: 'images/p15.png' },
  { id: 'p16', name: "Children's Day Sticker Pack (14 pcs)",    price: 100, img: 'images/p16.png' },
  { id: 'p17', name: 'Halloween Sticker Pack (16 pcs)',         price: 150, img: 'images/p17.png' },
  { id: 'p18', name: 'Black Friday Sticker Pack (20 pcs)',      price: 180, img: 'images/p18.png' },
  { id: 'p19', name: 'Cyber Monday Sticker Pack (20 pcs)',      price: 170, img: 'images/p19.png' },
  { id: 'p20', name: 'Lohri Sticker Pack (12 pcs)',             price: 90,  img: 'images/p20.png' },
  { id: 'p21', name: 'Pongal Sticker Pack (12 pcs)',            price: 90,  img: 'images/p21.png' },
  { id: 'p22', name: 'Makar Sankranti Sticker Pack (15 pcs)',   price: 100, img: 'images/p22.png' },
  { id: 'p23', name: 'Baisakhi Sticker Pack (10 pcs)',          price: 85,  img: 'images/p23.png' },
  { id: 'p24', name: 'Republic Day Sticker Pack (12 pcs)',      price: 95,  img: 'images/p24.png' }
];

window.PRODUCTS = PRODUCTS;

/* ---------- Cart state ---------- */
var cart = {};
window.cart = cart;

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('saveCart error', e);
  }
}

function loadCart() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw) || {};
      cart = parsed;
      window.cart = cart;
    } else {
      cart = {};
      window.cart = cart;
    }
  } catch (e) {
    cart = {};
    window.cart = cart;
    console.error('loadCart error', e);
  }
}

/* ---------- Helpers ---------- */
function fmtCurrency(n) {
  try {
    return new Intl.NumberFormat(CURRENCY.locale, { style: 'currency', currency: CURRENCY.code }).format(n);
  } catch (e) {
    return '₹' + Number(n).toFixed(2);
  }
}
function getProductById(id) {
  return PRODUCTS.find(function (p) { return p.id === id; }) || null;
}
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

/* ---------- Render products grid ---------- */
function renderProductsGrid() {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  PRODUCTS.forEach(function (p) {
    var card = document.createElement('article');
    card.className = 'card';
    var imgHtml = '';
    if (p.img) {
      imgHtml = '<div class="thumb"><img src="' + p.img + '" alt="' + (p.name || '') + '" class="product-img"></div>';
    } else {
      imgHtml = '<div class="thumb"><span>' + (p.name ? p.name[0] : '') + '</span></div>';
    }

    card.innerHTML = ''
      + imgHtml
      + '<div class="title">' + p.name + '</div>'
      + '<div class="price">' + fmtCurrency(p.price) + '</div>'
      + '<div class="actions"><button class="btn add-to-cart" data-id="' + p.id + '">Add to cart</button></div>';

    grid.appendChild(card);
  });

  // attach add handlers
  var buttons = grid.querySelectorAll('.add-to-cart');
  buttons.forEach(function (b) {
    // guard to prevent double-attach
    if (!b._wsAddAttached) {
      b.addEventListener('click', function () {
        addToCart(b.dataset.id);
      });
      b._wsAddAttached = true;
    }
  });
}

/* ---------- Cart operations ---------- */
function addToCart(id) {
  if (!id) return;
  if (!cart[id]) cart[id] = 0;
  cart[id] += 1;
  window.cart = cart;
  saveCart();
  updateUI();
}
function removeFromCart(id) {
  if (!id) return;
  if (cart[id]) {
    delete cart[id];
    window.cart = cart;
    saveCart();
    updateUI();
  }
}
function computeTotal() {
  var total = 0;
  Object.keys(cart).forEach(function (id) {
    var p = getProductById(id);
    var qty = cart[id] || 0;
    if (p) total += (p.price || 0) * qty;
  });
  return total;
}

/* ---------- Update UI (cart area + FAB) ---------- */
function updateUI() {
  // compute qty & totals
  var qty = Object.keys(cart).reduce(function (s, k) { return s + Number(cart[k] || 0); }, 0);
  var totalValue = computeTotal();

  // update small bits
  var fabCount = document.getElementById('fabCount');
  if (fabCount) fabCount.textContent = qty;

  var cartTotalShort = document.getElementById('cartTotalShort');
  if (cartTotalShort) cartTotalShort.textContent = fmtCurrency(totalValue);
  var cartTotal = document.getElementById('cartTotal');
  if (cartTotal) cartTotal.textContent = fmtCurrency(totalValue);
  var drawerTotal = document.getElementById('drawerTotal');
  if (drawerTotal) drawerTotal.textContent = fmtCurrency(totalValue);

  // Build items HTML in memory (so desktop/mobile both receive same content)
  var itemsHtml = '';
  if (qty === 0) {
    itemsHtml = '<div class="muted small">Your cart is empty</div>';
  } else {
    Object.keys(cart).forEach(function (id) {
      var p = getProductById(id);
      var q = cart[id] || 0;
      if (!p) return;
      var thumb = p.img ? ('<img src="' + p.img + '" alt="' + p.name + '" class="ci-img">') : ('<span>' + (p.name ? p.name[0] : '') + '</span>');
      itemsHtml += ''
        + '<div class="cart-item">'
        +   '<div class="ci-thumb">' + thumb + '</div>'
        +   '<div class="ci-info">'
        +     '<div class="ci-title">' + p.name + '</div>'
        +     '<div class="small muted">' + fmtCurrency(p.price) + ' × ' + q + ' = <strong style="color:var(--accent)">' + fmtCurrency((p.price || 0) * q) + '</strong></div>'
        +   '</div>'
        +   '<div><button class="remove" data-id="' + id + '">Remove</button></div>'
        + '</div>';
    });
  }

  // Write to desktop cart container
  var cartItems = document.getElementById('cartItems');
  if (cartItems) cartItems.innerHTML = itemsHtml;

  // Ensure mobile container exists (create inside drawer if needed)
  var mobileItems = document.getElementById('mobileCartItems');
  if (!mobileItems) {
    var drawer = document.getElementById('cartDrawer');
    if (drawer) {
      mobileItems = document.createElement('div');
      mobileItems.id = 'mobileCartItems';
      // insert near top so it's visible immediately
      drawer.insertBefore(mobileItems, drawer.firstChild);
    }
  }
  if (mobileItems) mobileItems.innerHTML = itemsHtml;

  // Attach remove handlers (idempotent attach)
  var remButtons = document.querySelectorAll('.remove');
  remButtons.forEach(function (b) {
    if (!b._wsRemoveAttached) {
      b.addEventListener('click', function () {
        removeFromCart(b.dataset.id);
      });
      b._wsRemoveAttached = true;
    }
  });

  // Enable/disable checkout buttons
  var checkoutBtn = document.getElementById('checkoutBtn');
  var mobileCheckout = document.getElementById('mobileCheckout');
  var placeOrder = document.getElementById('place-order');
  var enabled = qty > 0;
  if (checkoutBtn) { checkoutBtn.disabled = !enabled; checkoutBtn._wsEnabled = enabled; }
  if (mobileCheckout) { mobileCheckout.disabled = !enabled; mobileCheckout._wsEnabled = enabled; }
  if (placeOrder) { placeOrder.disabled = !enabled; placeOrder._wsEnabled = enabled; }

  // debug log
  console.log('updateUI() done — qty:', qty, 'total:', totalValue);
}

/* ---------- Mobile drawer / FAB handlers ---------- */
function attachDrawerHandlers() {
  var fab = document.getElementById('cartFab');
  var drawer = document.getElementById('cartDrawer');
  var backdrop = document.getElementById('drawerBackdrop');

  if (fab && !fab._wsAttached) {
    fab.addEventListener('click', function () {
      if (drawer) drawer.classList.add('open');
      if (backdrop) backdrop.style.display = 'block';
    });
    fab._wsAttached = true;
  }
  if (backdrop && !backdrop._wsAttached) {
    backdrop.addEventListener('click', function () {
      if (drawer) drawer.classList.remove('open');
      backdrop.style.display = 'none';
    });
    backdrop._wsAttached = true;
  }
}

/* ---------- WhatsApp checkout (safe) ---------- */
function buildWhatsAppMessage(phone) {
  // prefer live window.cart, fall back to localStorage for safety
  var cartObj = (window.cart && Object.keys(window.cart).length) ? window.cart : {};
  if (!cartObj || Object.keys(cartObj).length === 0) {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      cartObj = raw ? (JSON.parse(raw) || {}) : {};
    } catch (e) {
      cartObj = {};
    }
  }

  if (!cartObj || Object.keys(cartObj).length === 0) return null;

  var lines = [];
  lines.push('Hey Ranvir 👋 I want to order these items from Wonder Stickers:');
  lines.push('');
  var total = 0;

  Object.keys(cartObj).forEach(function (id) {
    var qty = Number(cartObj[id] || 0);
    if (!qty) return;
    var p = getProductById(id) || { name: id, price: 0 };
    var sub = (p.price || 0) * qty;
    total += sub;
    lines.push('- ' + p.name + ' × ' + qty + ' = ' + fmtCurrency(sub));
  });

  lines.push('');
  lines.push('----------------------');
  lines.push('Total = ' + fmtCurrency(total));
  lines.push('');
  if (phone) lines.push('Customer phone: ' + phone);
  else lines.push('Customer phone: (please reply with your phone)');
  lines.push('');
  lines.push('Name:');
  lines.push('Address:');
  lines.push('');
  lines.push('Please confirm availability & payment instructions. Thanks!');

  return lines.join('\n');
}

function openWhatsAppCheckout(phone) {
  var msg = buildWhatsAppMessage(phone);
  if (!msg) {
    alert('Your cart is empty. Add items before checkout.');
    return;
  }
  var encoded = encodeURIComponent(msg);

  // attempt mobile protocol first on mobile devices, otherwise open web wa.me
  if (isMobileDevice()) {
    // try app protocol
    var appUrl = 'whatsapp://send?phone=' + WHATSAPP_NUMBER + '&text=' + encoded;
    try {
      window.location.href = appUrl;
      // also open wa.me fallback shortly after as last-resort
      setTimeout(function () {
        window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded, '_blank');
      }, 600);
    } catch (e) {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded, '_blank');
    }
  } else {
    // desktop: open web.whatsapp (web WhatsApp reads the text param)
    var webUrl = 'https://web.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encoded;
    try {
      window.open(webUrl, '_blank');
    } catch (e) {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded, '_blank');
    }
  }
}

/* ---------- Attach checkout buttons ---------- */
function attachCheckoutButtons() {
  var checkoutBtn = document.getElementById('checkoutBtn');
  var mobileCheckout = document.getElementById('mobileCheckout');
  var placeOrder = document.getElementById('place-order');
  var any = document.querySelectorAll('[data-whatsapp-checkout]');

  function handler(e) {
    if (e && e.preventDefault) e.preventDefault();
    var phoneInput = document.getElementById('customer-phone');
    var phone = phoneInput ? phoneInput.value.trim() : '';
    openWhatsAppCheckout(phone);
  }

  if (checkoutBtn && !checkoutBtn._wsAttached) {
    checkoutBtn.addEventListener('click', handler);
    checkoutBtn._wsAttached = true;
  }
  if (mobileCheckout && !mobileCheckout._wsAttached) {
    mobileCheckout.addEventListener('click', handler);
    mobileCheckout._wsAttached = true;
  }
  if (placeOrder && !placeOrder._wsAttached) {
    placeOrder.addEventListener('click', handler);
    placeOrder._wsAttached = true;
  }
  any.forEach(function (el) {
    if (!el._wsAttached) {
      el.addEventListener('click', handler);
      el._wsAttached = true;
    }
  });
}

/* ---------- Init ---------- */
function initSite() {
  loadCart();
  renderProductsGrid();
  updateUI();
  attachDrawerHandlers();
  attachCheckoutButtons();
}

/* run when DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}

/* expose debug helpers */
window.__ws = {
  saveCart: saveCart,
  loadCart: loadCart,
  products: PRODUCTS,
  cart: cart,
  buildWhatsAppMessage: buildWhatsAppMessage,
  openWhatsAppCheckout: openWhatsAppCheckout
};
