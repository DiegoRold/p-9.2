class BookCard extends HTMLElement {
  constructor() {
    super();
    // Creamos el Shadow DOM
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Obtener atributos
    const cover =
      this.getAttribute("cover") ||
      "https://via.placeholder.com/150?text=Portada";
    const titulo = this.getAttribute("titulo") || "Título desconocido";
    const autor = this.getAttribute("autor") || "Autor desconocido";
    const fecha = this.getAttribute("fecha") || "Fecha no disponible";
    const rating = this.getAttribute("rating") || "0";
    const precio = this.getAttribute("precio") || "0";

    // Plantilla del componente
    this.shadowRoot.innerHTML = `
        <style>
          .card {
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 0.5rem;
            padding: 1rem;
            display: flex;
            flex-direction: column;
          }
          .card img {
            width: 100%;
            height: 12rem;
            object-fit: cover;
            margin-bottom: 0.5rem;
          }
          .card h3 {
            font-size: 1.125rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
          }
          .card p {
            font-size: 0.875rem;
            color: #4a5568;
          }
          .card .price {
            font-size: 1rem;
            font-weight: 600;
            margin-top: 0.5rem;
          }
          .card button {
            margin-top: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: #3b82f6;
            color: #fff;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
          }
        </style>
        <div class="card">
          <img src="${cover}" alt="${titulo}">
          <h3>${titulo}</h3>
          <p>Por: ${autor}</p>
          <p>Publicado: ${fecha}</p>
          <p>Rating: ${rating}</p>
          <p class="price">$${precio}</p>
          <div class="flex justify-between mt-4">
            <button class="btn-cart">Agregar al carrito</button>
            <button class="btn-wishlist">Agregar a la lista de deseos</button>
          </div>
        </div>
      `;

    // Listener para "Agregar al carrito"
    const btnCart = this.shadowRoot.querySelector(".btn-cart");
    btnCart.addEventListener("click", () => {
      console.log('Clic en "Agregar al carrito" para:', titulo);
      this.dispatchEvent(
        new CustomEvent("add-to-cart", {
          detail: { titulo, cover },
          bubbles: true,
          composed: true,
        })
      );
    });

    // Listener para "Agregar a la wishlist"
    const btnWishlist = this.shadowRoot.querySelector(".btn-wishlist");
    btnWishlist.addEventListener("click", () => {
      console.log('Clic en "Agregar a la lista de deseos" para:', titulo);
      this.dispatchEvent(
        new CustomEvent("add-to-wishlist", {
          detail: { titulo, cover },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define("book-card", BookCard);
