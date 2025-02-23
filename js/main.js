// Importamos el Web Component
import "./components/book-card.js";

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://books-foniuhqsba-uc.a.run.app/";

  /* Función para cargar los libros y mostrarlos en el catálogo */
  async function cargarLibros() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("Datos recibidos de la API:", data);
      const catalogo = document.getElementById("catalogo");
      catalogo.innerHTML = "";

      // Extraer categorías y cargar el menú de filtrado (si se implementa)
      let todasCategorias = [];
      data.forEach((libro) => {
        if (libro.categories) {
          todasCategorias = todasCategorias.concat(libro.categories);
        }
      });
      const categoriasUnicas = [...new Set(todasCategorias)];
      cargarMenuFiltrado(categoriasUnicas);

      data.forEach((libro) => {
        const bookCard = document.createElement("book-card");
        bookCard.setAttribute("cover", libro.coverImage);
        bookCard.setAttribute("titulo", libro.title);
        bookCard.setAttribute("autor", libro.author);
        bookCard.setAttribute("fecha", libro.publicationDate);
        bookCard.setAttribute("rating", libro.rating);
        bookCard.setAttribute("precio", libro.price);
        bookCard.setAttribute("publisher", libro.publisher || "No disponible");
        if (libro.tags) {
          bookCard.setAttribute("tags", libro.tags.join(", "));
        } else {
          bookCard.setAttribute("tags", "Sin etiquetas");
        }
        // Guardamos las categorías para filtrado
        bookCard.dataset.categories = libro.categories
          ? libro.categories.join(",")
          : "";
        catalogo.appendChild(bookCard);
      });
    } catch (error) {
      console.error("Error al cargar los libros:", error);
    }
  }

  cargarLibros();

  /* Función para actualizar la UI del carrito */
  function updateCartUI() {
    const cartContent = document.getElementById("cart-content");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      cartContent.innerHTML = "<p class='text-gray-600'>Carrito vacío</p>";
      return;
    }
    cartContent.innerHTML = "";
    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between mb-2 border-b pb-2";
      div.innerHTML = `
        <span>${item.titulo} - $${item.precio}</span>
        <button data-index="${index}" class="text-red-500 font-bold">×</button>
      `;
      cartContent.appendChild(div);
    });
  }

  // Actualizar la UI del carrito al inicio
  updateCartUI();

  /* Función para cargar el menú de filtrado de categorías */
  function cargarMenuFiltrado(categorias) {
    const filterMenu = document.getElementById("filter-menu");
    filterMenu.innerHTML = "";
    categorias.forEach((categoria) => {
      const btn = document.createElement("button");
      btn.textContent = categoria;
      btn.className = "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300";
      btn.addEventListener("click", () => {
        filtrarPorCategoria(categoria);
      });
      filterMenu.appendChild(btn);
    });
    // Botón para mostrar todos
    const btnTodos = document.createElement("button");
    btnTodos.textContent = "Todos";
    btnTodos.className =
      "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600";
    btnTodos.addEventListener("click", () => {
      document.querySelectorAll("#catalogo book-card").forEach((card) => {
        card.style.display = "block";
      });
    });
    filterMenu.appendChild(btnTodos);
  }

  function filtrarPorCategoria(categoria) {
    const cards = document.querySelectorAll("#catalogo book-card");
    cards.forEach((card) => {
      const cardCategorias = card.dataset.categories.split(",");
      if (cardCategorias.includes(categoria)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  /* Funcionalidad de cambio de vista (Grid / Flex) */
  const toggleBtn = document.getElementById("toggle-view");
  toggleBtn.addEventListener("click", () => {
    const catalogo = document.getElementById("catalogo");
    if (catalogo.classList.contains("grid")) {
      catalogo.classList.remove(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
        "gap-4"
      );
      catalogo.classList.add("flex", "flex-col", "space-y-4");
    } else {
      catalogo.classList.remove("flex", "flex-col", "space-y-4");
      catalogo.classList.add(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
        "gap-4"
      );
    }
  });

  /* Persistencia de la Wishlist */
  function obtenerWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  }
  function guardarWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
  function actualizarWishlistUI() {
    const wishlistContent = document.getElementById("wishlist-content");
    wishlistContent.innerHTML = "";
    const wishlist = obtenerWishlist();
    wishlist.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between mb-2 p-2 border-b";
      div.innerHTML = `
        <div class="flex items-center space-x-2">
          <img src="${item.cover}" alt="${item.titulo}" class="w-10 h-10 object-cover rounded" />
          <span class="font-semibold text-sm">${item.titulo}</span>
        </div>
        <button data-index="${index}" class="text-red-500 font-bold">×</button>
      `;
      wishlistContent.appendChild(div);
    });
  }

  document.addEventListener("add-to-wishlist", (e) => {
    console.log('Evento "add-to-wishlist" recibido:', e.detail);
    let wishlist = obtenerWishlist();
    if (!wishlist.find((item) => item.titulo === e.detail.titulo)) {
      wishlist.push({ titulo: e.detail.titulo, cover: e.detail.cover });
      guardarWishlist(wishlist);
      actualizarWishlistUI();
    }
  });

  /* Agregar al carrito */
  document.addEventListener("add-to-cart", (e) => {
    console.log('Evento "add-to-cart" recibido:', e.detail);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ titulo: e.detail.titulo, precio: e.detail.precio });
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById("cart-counter").textContent = cart.length;
    updateCartUI();
  });

  /* Manejo de eventos para eliminar ítems del carrito */
  document.getElementById("cart-content").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      document.getElementById("cart-counter").textContent = cart.length;
      updateCartUI();
    }
  });

  /* Mostrar/Ocultar Paneles */
  document.getElementById("cart-icon").addEventListener("click", () => {
    console.log("Icono de carrito clickeado");
    const cartPanel = document.getElementById("cart-panel");
    cartPanel.classList.toggle("-translate-x-full");
  });
  document.getElementById("close-cart").addEventListener("click", () => {
    console.log("Cerrar panel de carrito");
    document.getElementById("cart-panel").classList.add("-translate-x-full");
  });

  document.getElementById("wishlist-icon").addEventListener("click", () => {
    console.log("Icono de wishlist clickeado");
    const wishlistPanel = document.getElementById("wishlist-panel");
    wishlistPanel.classList.toggle("translate-x-full");
  });
  document.getElementById("close-wishlist").addEventListener("click", () => {
    console.log("Cerrar panel de wishlist");
    document.getElementById("wishlist-panel").classList.add("translate-x-full");
  });

  /* Manejo de la compra */
  const purchaseButton = document.getElementById("purchase-button");
  const purchaseDialog = document.getElementById("purchase-dialog");
  const acceptPurchase = document.getElementById("accept-purchase");
  const rejectPurchase = document.getElementById("reject-purchase");

  purchaseButton.addEventListener("click", () => {
    console.log("Botón COMPRAR clickeado");
    purchaseDialog.showModal();
  });

  acceptPurchase.addEventListener("click", () => {
    console.log("Compra aceptada");
    alert("Se ha realizado la compra con éxito.");
    purchaseDialog.close();
    localStorage.removeItem("cart");
    document.getElementById("cart-counter").textContent = 0;
    document.getElementById("cart-content").innerHTML =
      "<p class='text-gray-600'>Carrito vacío</p>";
  });

  rejectPurchase.addEventListener("click", () => {
    console.log("Compra rechazada");
    purchaseDialog.close();
  });
});
