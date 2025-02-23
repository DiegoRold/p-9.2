// Esperamos a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", () => {
  // Importamos el Web Component (ya se ha importado como módulo desde main.js)
  import("./components/book-card.js");

  const API_URL = "https://books-foniuhqsba-uc.a.run.app/";

  /* Función para cargar los libros y mostrarlos en el catálogo */
  async function cargarLibros() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("Datos recibidos de la API:", data);
      const catalogo = document.getElementById("catalogo");
      catalogo.innerHTML = ""; // Limpiar catálogo

      data.forEach((libro) => {
        const bookCard = document.createElement("book-card");
        bookCard.setAttribute("cover", libro.coverImage);
        bookCard.setAttribute("titulo", libro.title);
        bookCard.setAttribute("autor", libro.author);
        bookCard.setAttribute("fecha", libro.publicationDate);
        bookCard.setAttribute("rating", libro.rating);
        bookCard.setAttribute("precio", libro.price);
        catalogo.appendChild(bookCard);
      });
    } catch (error) {
      console.error("Error al cargar los libros:", error);
    }
  }

  cargarLibros();

  /* Capturamos los eventos para agregar a la wishlist y al carrito */
  document.addEventListener("add-to-wishlist", (e) => {
    console.log('Evento "add-to-wishlist" recibido:', e.detail);
    // Lógica para actualizar la wishlist aquí
  });

  document.addEventListener("add-to-cart", (e) => {
    console.log('Evento "add-to-cart" recibido:', e.detail);
    // Lógica para actualizar el carrito aquí
  });

  /* Mostrar/Ocultar Paneles */
  // Panel del Carrito
  document.getElementById("cart-icon").addEventListener("click", () => {
    console.log("Icono de carrito clickeado");
    const cartPanel = document.getElementById("cart-panel");
    cartPanel.classList.toggle("-translate-x-full");
  });
  document.getElementById("close-cart").addEventListener("click", () => {
    console.log("Cerrar panel de carrito");
    document.getElementById("cart-panel").classList.add("-translate-x-full");
  });

  // Panel de la Wishlist
  document.getElementById("wishlist-icon").addEventListener("click", () => {
    console.log("Icono de wishlist clickeado");
    const wishlistPanel = document.getElementById("wishlist-panel");
    wishlistPanel.classList.toggle("translate-x-full");
  });
  document.getElementById("close-wishlist").addEventListener("click", () => {
    console.log("Cerrar panel de wishlist");
    document.getElementById("wishlist-panel").classList.add("translate-x-full");
  });
});
