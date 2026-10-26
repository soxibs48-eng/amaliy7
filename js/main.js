/**
 * HNST - Sustainable Denim
 * Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= CART STATE =================
  const cart = {
    items: [
      {
        id: 'h002',
        name: 'WOMENS HIGH RISE / H002',
        color: 'Raw Indigo Rinse',
        price: 145.00,
        image: 'assets/images/product-2.jpg',
        quantity: 1
      }
    ]
  };

  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartBtn = document.getElementById('cartBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalDisplay = document.getElementById('cartTotal');
  const cartCountBadges = document.querySelectorAll('.cart-count-val');
  const toast = document.getElementById('toastNotice');

  function updateCartUI() {
    const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => badge.textContent = totalCount);

    if (cart.items.length === 0) {
      cartItemsContainer.innerHTML = '<div class="cart-empty-message">Your shopping bag is empty. Explore our circular denim collection.</div>';
      cartTotalDisplay.textContent = '€0,00';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = cart.items.map(item => {
      subtotal += item.price * item.quantity;
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <div>
              <div class="cart-item-title">${item.name}</div>
              <div style="font-size:0.75rem; opacity:0.8; margin-top:2px;">Color: ${item.color} | Qty: ${item.quantity}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
              <span class="cart-item-price">€${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              <button class="cart-item-remove" onclick="removeCartItem('${item.id}')">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartTotalDisplay.textContent = `€${subtotal.toFixed(2).replace('.', ',')}`;
  }

  window.removeCartItem = function(id) {
    const idx = cart.items.findIndex(it => it.id === id);
    if (idx !== -1) {
      const removed = cart.items.splice(idx, 1)[0];
      updateCartUI();
      showToast(`Removed "${removed.name}" from bag`);
    }
  };

  function openCart() {
    cartDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  window.addToCart = function(product) {
    const existing = cart.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        color: product.color || 'Standard Rinse',
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    updateCartUI();
    showToast(`Added "${product.name}" to your bag!`);
    openCart();
  };

  // Toast Helper
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Checkout Demo
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.items.length === 0) {
        showToast('Your bag is empty!');
        return;
      }
      showToast('Proceeding to encrypted circular checkout...');
      setTimeout(() => {
        alert('Thank you for choosing circular fashion! In this live demonstration, your items have been reserved.');
        cart.items = [];
        updateCartUI();
        closeCart();
      }, 1000);
    });
  }

  // ================= FILTER TABS =================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter || (filter === 'unisex' && cat.includes('unisex'))) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= PRESS & QUOTES CAROUSEL =================
  const quotes = [
    {
      author: 'Forbes',
      text: 'Is a model all fashion brands will have to follow if they want to survive, and HNST is definitely one of the pioneers of tomorrow’s fashion.',
      index: '01 / 04'
    },
    {
      author: 'Vogue',
      text: 'HNST demonstrates that circularity does not require aesthetic sacrifice. Their tailored denim is as sharp and enduring as any heritage luxury brand.',
      index: '02 / 04'
    },
    {
      author: 'Wallpaper*',
      text: 'An uncompromising manifesto in sustainable garment architecture: zero toxic chemistry, removable buttons, and true circular design from Antwerp.',
      index: '03 / 04'
    },
    {
      author: 'The Guardian',
      text: 'The jeans that actually close the loop. By dismantling the wasteful denim cycle, HNST offers a blueprint for fashion with real conscience.',
      index: '04 / 04'
    }
  ];

  let currentQuoteIndex = 0;
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const quoteBodyEl = document.getElementById('quoteBody');
  const quoteCounterEl = document.getElementById('quoteCounter');
  const quoteDots = document.querySelectorAll('.dot-btn');

  function renderQuote(idx) {
    currentQuoteIndex = idx;
    const q = quotes[idx];
    if (quoteAuthorEl) quoteAuthorEl.textContent = q.author;
    if (quoteBodyEl) quoteBodyEl.textContent = `“${q.text}”`;
    if (quoteCounterEl) quoteCounterEl.textContent = q.index;

    quoteDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  quoteDots.forEach((dot, i) => {
    dot.addEventListener('click', () => renderQuote(i));
  });

  // Auto rotate quotes every 6s
  setInterval(() => {
    const nextIdx = (currentQuoteIndex + 1) % quotes.length;
    renderQuote(nextIdx);
  }, 6500);

  // ================= NEWSLETTER FORMS =================
  const midForm = document.getElementById('midNewsletterForm');
  const footerForm = document.getElementById('footerNewsletterForm');

  function handleNewsletter(form, feedbackEl) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      if (!email || !email.includes('@')) {
        feedbackEl.textContent = 'Please enter a valid email address.';
        feedbackEl.style.color = '#DE3219';
        return;
      }

      feedbackEl.textContent = '✓ Subscribed! Welcome to the circular denim revolution.';
      feedbackEl.style.color = '#DE3219';
      input.value = '';
      showToast('Welcome to HNST newsletter!');
    });
  }

  if (midForm) {
    handleNewsletter(midForm, document.getElementById('midFormFeedback'));
  }
  if (footerForm) {
    handleNewsletter(footerForm, document.getElementById('footerFormFeedback'));
  }

  // ================= MOBILE NAVIGATION =================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavCloseBtn = document.getElementById('mobileNavCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.add('active');
    });
  }
  if (mobileNavCloseBtn && mobileNavDrawer) {
    mobileNavCloseBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('active');
    });
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('active');
    });
  });

  // Initial cart update
  updateCartUI();
});
