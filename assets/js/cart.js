import * as helpers from './helpers.js';

// mise à jour du compteur du panier
helpers.updateCartCounterStatus('cartBadgeId');

// shopping cart list
const shoppingCartListContainer = document.querySelector('#shoppingCartListId');
function generateShoppingCartList(cartData) {
    if(cartData.length > 0) {
        cartData.map((cartItem, cartIndex) => {
            const shoppingCartItemTrElt = document.createElement('tr');
            shoppingCartItemTrElt.setAttribute('id', 'idCartItemTr'+ cartItem.id);
            shoppingCartItemTrElt.setAttribute('data-cart-item-id', cartItem.id);
            shoppingCartItemTrElt.innerHTML = `
                <th>${cartIndex + 1}</th>
                <td><span data-cart-item-action="removeElt" class="bi bi-trash text-danger hoverable"></span></td>
                <td><img src="${cartItem.img}" class="img-thumbnail rounded" alt="" style="width: 80px;"></td>
                <td>${cartItem.name}</td>
                <td class="text-end">${helpers.calculateDiscountedPrice(parseFloat(cartItem.price), parseInt(cartItem.discount), true)}</td>
                <td class="text-end">
                    <div class="d-flex gap-3 justify-content-end align-content-center">
                        <button data-cart-item-action="minusQte" class="btn btn-outline-secondary btn-sm py-0">
                            <span class="bi bi-dash"></span>
                        </button>
                        <div id="${'cartItemQuantityId'+ cartItem.id}"></div>
                        <button data-cart-item-action="plusQte" class="btn btn-outline-secondary btn-sm py-0">
                            <span class="bi bi-plus"></span>
                        </button>
                    </div>
                </td>
                <td id="${'cartItemTotalPriceId'+ cartItem.id}" class="text-end"></td>
            `;
            shoppingCartListContainer.appendChild(shoppingCartItemTrElt);

            // mise à jour (de la quantité, du prix total)
            helpers.adjustQuantity('cartItemQuantityId'+ cartItem.id, cartItem.id, 0); 
            helpers.updateShoppingCartItemTotalPrice('cartItemTotalPriceId'+ cartItem.id, cartItem.id);
        });

        const totalAmountTrElt = document.createElement('tr');
        totalAmountTrElt.innerHTML = `
            <td colspan="6" class="text-end fw-bold">Montant Total HT :</td>
            <td id="totalAmountId" class="text-end fw-bold"></td>
        `;
        shoppingCartListContainer.appendChild(totalAmountTrElt);

        helpers.updateShoppingCartTotalAmount('totalAmountId'); // mise à jour du montant total
    } else {
        const shoppingCartEmptyTrElt = document.createElement('tr');
        shoppingCartEmptyTrElt.innerHTML = `<td colspan="7" class="text-center fw-bold fs-5">Votre panier est vide</td>`;
        shoppingCartListContainer.appendChild(shoppingCartEmptyTrElt);
    }
}

// exécution des fonctions d'affichage du panier
const myShoppingCartData = helpers.getShoppingCartInLocalStorage();
generateShoppingCartList(myShoppingCartData);

// update shopping cart elements
shoppingCartListContainer.addEventListener('click', updateShoppingCartElements);
function updateShoppingCartElements(event) {
    event.preventDefault();
    const targetElement = event.target;

    const dataCartItemIdElement = targetElement.closest('[data-cart-item-id]');
    const dataCartItemActionElement = targetElement.closest('[data-cart-item-action]');
    if(dataCartItemIdElement && dataCartItemActionElement) {
        // console.log(dataCartItemIdElement, dataCartItemActionElement);

        const dataCartItemIdValue = parseInt(dataCartItemIdElement.getAttribute('data-cart-item-id'));
        const dataCartItemActionValue = dataCartItemActionElement.getAttribute('data-cart-item-action');
        if(dataCartItemIdValue && dataCartItemActionValue) {
            // console.log(dataCartItemIdValue, dataCartItemActionValue);
            
            // adjust quantity
            if(['minusQte', 'plusQte'].includes(dataCartItemActionValue)) {
                const actionValue = (dataCartItemActionValue.localeCompare('plusQte') === 0) ? 1 : -1;
                helpers.adjustQuantity('cartItemQuantityId'+ dataCartItemIdValue, dataCartItemIdValue, actionValue); // mise à jour de la quantité
                helpers.updateShoppingCartItemTotalPrice('cartItemTotalPriceId'+ dataCartItemIdValue, dataCartItemIdValue); // mise à jour du prix total
                // helpers.updateShoppingCartTotalAmount('totalAmountId');
            }

            // remove shopping cart element
            if(dataCartItemActionValue.localeCompare('removeElt') === 0) {
                const removeConfirmation = confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?");
                if(removeConfirmation) {
                    if(helpers.removeElementByIdInDOM('idCartItemTr'+ dataCartItemIdValue, 'shoppingCartListId')) {
                        helpers.removeShoppingCartItemInLocalStorage(dataCartItemIdValue);
                        helpers.updateCartCounterStatus('cartBadgeId'); // mise à jour du compteur du panier
                        // helpers.updateShoppingCartTotalAmount('totalAmountId');
                    }
                }
            }
            
            helpers.updateShoppingCartTotalAmount('totalAmountId'); // mise à jour du montant total
        }
    }

    targetElement.blur();
}