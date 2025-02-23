class BookCard extends HTMLElement {
  constructor() {
    super();
    // Creamos el Shadow DOM
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const cover =
      this.getAttribute("cover") ||
      "https://via.placeholder.com/150?text=Portada";
    const titulo = this.getAttribute("titulo") || "Título desconocido";
    const autor = this.getAttribute("autor") || "Autor desconocido";
    const fecha = this.getAttribute("fecha") || "Fecha no disponible";
    const rating = this.getAttribute("rating") || "0";
    const precio = this.getAttribute("precio") || "0";
    const publisher =
      this.getAttribute("publisher") || "Editorial no disponible";
    const tags = this.getAttribute("tags") || "Sin etiquetas";

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css">
      <style>
        /* Estilos para el popover informativo */
        .popover {
          display: none;
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 0.5rem;
          z-index: 10;
          white-space: nowrap;
        }
        .info-container:hover .popover {
          display: block;
        }
      </style>
      <div class="bg-white shadow rounded p-4 flex flex-col">
        <img src="${cover}" alt="${titulo}" class="w-full h-80 object-cover mb-2 rounded" />
        <h3 class="text-lg font-bold mb-1">${titulo}</h3>
        <p class="text-sm text-gray-600">Por: ${autor}</p>
        <p class="text-sm text-gray-600">Publicado: ${fecha}</p>
        <p class="text-sm text-gray-600">Rating: ${rating}</p>
        <p class="text-base font-semibold mt-2">$${precio}</p>
        <div class="flex items-center justify-between mt-4">
          <div class="flex space-x-2">
            <img src="./assets/img/car-icon-book.png" alt="Agregar al carrito" class="w-8 h-8 cursor-pointer icon-car-book" />
            <img src="./assets/img/wish-icon-book.png" alt="Agregar a la wishlist" class="w-8 h-8 cursor-pointer icon-wish-book" />
          </div>
          <div class="relative info-container">
            <img src="./assets/img/info-icon.png" alt="Información" class="w-6 h-6 cursor-pointer" />
            <div class="popover text-xs text-gray-800 bg-gray-100 p-2 rounded">
              <p><span class="font-bold">Editorial:</span> ${publisher}</p>
              <p><span class="font-bold">Etiquetas:</span> ${tags}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const iconCar = this.shadowRoot.querySelector(".icon-car-book");
    iconCar.addEventListener("click", () => {
      console.log('Clic en "Agregar al carrito" para:', titulo);
      this.dispatchEvent(
        new CustomEvent("add-to-cart", {
          detail: { titulo, precio },
          bubbles: true,
          composed: true,
        })
      );
    });

    const iconWish = this.shadowRoot.querySelector(".icon-wish-book");
    iconWish.addEventListener("click", () => {
      console.log('Clic en "Agregar a la wishlist" para:', titulo);
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
