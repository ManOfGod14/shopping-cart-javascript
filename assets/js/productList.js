import * as helpers from './helpers.js';

// mise à jour du compteur du panier
helpers.updateCartCounterStatus('cartBadgeId');

// const testElt = document.createElement('div');
// testElt.classList.add("col", "mb-5");
// testElt.classList.add("py-2");
// testElt.innerHTML = "<span>Hello</span>";
// console.log(testElt);

// generate product list
const productListContainer = document.querySelector('#productListId');
function generateProductList(productData) {
    productData.forEach(product => {
        const productItemDiv = document.createElement('div');
        productItemDiv.classList.add('col', 'mb-5');
        productItemDiv.innerHTML = `
            <div class="card h-100">
                ${product.hasSaleBadge ? `<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>` : ''}
                
                <img class="card-img-top" src="${product.img}" alt="..." />
                
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${product.name}</h5>

                        <div class="d-flex justify-content-center small text-warning mb-2">
                            ${helpers.productNoteStars(product.note)}
                        </div>

                        ${product.discount ? `<span class="text-muted text-decoration-line-through">${helpers.formatPrice(parseFloat(product.price))}</span>` : ``}
                        ${helpers.formatPrice(helpers.calculateDiscountedPrice(parseFloat(product.price), parseFloat(product.discount)))}
                    </div>
                </div>

                ${product.hasCartBtn ?
                `<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <button data-product-id="${product.id}" class="btn btn-outline-dark mt-auto add-to-cart">Add to cart</button>
                    </div>
                </div>` : ``}
            </div>
        `;
        productListContainer.appendChild(productItemDiv);
    });
}

// exécution de la fonction d'affichage des produits
generateProductList(helpers.products);

// fonction pour ajouter un produit au panier
productListContainer.addEventListener("click", addToCart);
function addToCart(evt) {
    evt.preventDefault();

    const dataProductIdValue = parseInt(evt.target.getAttribute('data-product-id'));
    if(dataProductIdValue) {
        const selectedProduct = helpers.products.find(product => product.id === dataProductIdValue);
        // console.log(dataProductIdValue, selectedProduct);
        helpers.addShoppingCartToLocalStorage(selectedProduct); // ajouter les informations du produit au panier dans le localStorage
        helpers.updateCartCounterStatus('cartBadgeId'); // mettre à jour l'état du compteur
    }

    evt.target.blur();
}
