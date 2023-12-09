// product list
export const products = [
    {
        "id": 1,
        "name": "Fancy Product 1",
        "price": 40.00,
        "discount": 8,
        "img": "https://picsum.photos/451/301",
        "note": 0, 
        "hasCartBtn": false,
        "hasSaleBadge": false
    },
    {
        "id": 2,
        "name": "Fancy Product 2",
        "price": 18.00,
        "discount": 0,
        "img": "https://picsum.photos/452/302",
        "note": 2, 
        "hasCartBtn": true,
        "hasSaleBadge": true
    },
    {
        "id": 3,
        "name": "Fancy Product 3",
        "price": 22.00,
        "discount": 10,
        "img": "https://picsum.photos/453/303",
        "note": 1, 
        "hasCartBtn": true,
        "hasSaleBadge": true
    },
    {
        "id": 4,
        "name": "Fancy Product 4",
        "price": 28.00,
        "discount": 0,
        "img": "https://picsum.photos/454/304",
        "note": 5, 
        "hasCartBtn": true,
        "hasSaleBadge": true
    },
    {
        "id": 5,
        "name": "Fancy Product 5",
        "price": 42.00,
        "discount": 0,
        "img": "https://picsum.photos/455/305",
        "note": 4, 
        "hasCartBtn": true,
        "hasSaleBadge": true
    },
    {
        "id": 6,
        "name": "Fancy Product 6",
        "price": 34.00,
        "discount": 0,
        "img": "https://picsum.photos/456/306",
        "note": 3, 
        "hasCartBtn": false,
        "hasSaleBadge": false
    },
    {
        "id": 7,
        "name": "Fancy Product 7",
        "price": 85.00,
        "discount": 10,
        "img": "https://picsum.photos/457/307",
        "note": 2, 
        "hasCartBtn": false,
        "hasSaleBadge": false
    },
    {
        "id": 8,
        "name": "Fancy Product 8",
        "price": 61.00,
        "discount": 15,
        "img": "https://picsum.photos/458/308",
        "note": 2, 
        "hasCartBtn": true,
        "hasSaleBadge": true
    }
];

// formatage du prix avec la devise
export function formatPrice(price) {
    return price.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'MAD'
    });
}

// fonction pour calculer la remise en pourcentage
export function calculateDiscountedPrice(price, discount, addCurrency = false) {
    if (discount !== null && discount > 0 && discount < 100) {
        const discountAmount = price * (discount / 100);
        const amount = price - discountAmount;
        return addCurrency ? formatPrice(amount) : amount;
    } else {
        return addCurrency ? formatPrice(price) : price;
    }
}

// product note stars
export function productNoteStars(note) {
    let divStars = ``;
    const emptyStars = 5 - note;
    
    for (let i = 0; i < note; i++) {
        divStars += `<div class="bi-star-fill"></div>`;
    }

    for (let j = 0; j < emptyStars; j++) {
        divStars += `<div class="bi-star"></div>`;
    }

    return divStars;
}

// set shopping cart in localStorage
export function setShoppingCartInLocalStorage(myCart) {
    localStorage.setItem('myShoppingCart', JSON.stringify(myCart));
}

// get shopping cart in localStorage
export function getShoppingCartInLocalStorage() {
    let myCart = localStorage.getItem('myShoppingCart');
    if (!myCart) myCart = [];
    else myCart = JSON.parse(myCart);
    return myCart;
}

// remove shopping cart element in localStorage
export function removeShoppingCartEltInLocalStorage(cartId) {
    let myCart = getShoppingCartInLocalStorage();
    if (myCart && myCart.length > 0) {
        myCart = myCart.filter(cart => cart.id !== cartId);
        setShoppingCartInLocalStorage(myCart);
    }
}

// fonction pour ajouter un element dans le localStorage
export function addShoppingCartToLocalStorage(selectedProduct, newQuantity = 0) {
    // vérifier si le panier existe déjà dans le localStorage
    let myCart = getShoppingCartInLocalStorage();

    // ajouter le nouveau produit au panier
    const existingProductIndex = myCart.findIndex(cartItem => cartItem.id === selectedProduct.id);
    if (existingProductIndex !== -1) {
        const quantity = (newQuantity !== 0) ? newQuantity : myCart[existingProductIndex].quantity + 1;
        myCart[existingProductIndex] = {
            id: selectedProduct.id,
            img: selectedProduct.img,
            name: selectedProduct.name,
            price: selectedProduct.price,
            discount: selectedProduct.discount,
            quantity: quantity
        };
    } else {
        myCart.push({
            id: selectedProduct.id,
            img: selectedProduct.img,
            name: selectedProduct.name,
            price: selectedProduct.price,
            discount: selectedProduct.discount,
            quantity: 1
        });
    }

    // mettre à jour le panier
    setShoppingCartInLocalStorage(myCart);
}

// fonction pour mettre à jour le compteur du panier
export function updateCartCounterStatus(elementId) {
    let myCart = getShoppingCartInLocalStorage();
    const cartBadgeIdElt = document.querySelector("#"+ elementId);
    cartBadgeIdElt.innerText = myCart.length;
}

// fonction pour ajuster la quantité
export function adjustQuantity(elementId, cartItemId, actionValue) {
    // console.log(elementId, cartItemId, actionValue);
    let myCart = getShoppingCartInLocalStorage();
    const cartItem = myCart.find(cart => cart.id === parseInt(cartItemId));
    if(cartItem) {
        let quantity = parseInt(cartItem.quantity) + actionValue;
        quantity = (quantity > 0) ? quantity : 1;
        if(actionValue !== 0) addShoppingCartToLocalStorage(cartItem, quantity);
        const cartItemQuantityIdElt = document.querySelector("#"+ elementId);
        cartItemQuantityIdElt.innerText = quantity;
    }
}

// get shopping cart item total price
export function getShoppingCartItemTotalPrice(cartItem, addCurrency = false) {
    let totalPrice = 0;
    if(cartItem) {
        totalPrice = calculateDiscountedPrice(parseFloat(cartItem.price), parseFloat(cartItem.discount)) * parseInt(cartItem.quantity);
    }
    return addCurrency ? formatPrice(totalPrice) : totalPrice;
}

// update shopping cart item total price
export function updateShoppingCartItemTotalPrice(elementId, cartItemId, addCurrency = true) {
    let myCart = getShoppingCartInLocalStorage();
    const cartItem = myCart.find(cart => cart.id === parseInt(cartItemId));
    let totalPrice = getShoppingCartItemTotalPrice(cartItem, addCurrency);
    const totalPriceIdElt = document.querySelector("#"+ elementId);
    totalPriceIdElt.innerText = totalPrice;
}

// get shopping cart total amount
export function getShoppingCartTotalAmount(myCart, addCurrency = false) {
    let totalAmount = 0;
    if(myCart.length > 0) {
        myCart.map(cart => { totalAmount += getShoppingCartItemTotalPrice(cart); });
    }
    return addCurrency ? formatPrice(totalAmount) : totalAmount;
}

// update shopping cart total amount
export function updateShoppingCartTotalAmount(elementId, addCurrency = true) {
    let myCart = getShoppingCartInLocalStorage();
    let totalAmount = getShoppingCartTotalAmount(myCart, addCurrency);
    const totalAmountIdElt = document.querySelector("#"+ elementId);
    totalAmountIdElt.innerText = totalAmount;
}

// remove element by id in DOM
export function removeElementByIdInDOM(elementId, parentId) {
    // récupérer l'élément parent par son ID
    const parentElement = document.querySelector('#'+ parentId);
    if (parentElement) {
        // récupérer l'élément à supprimer par son ID
        const elementToRemove = document.querySelector('#'+ elementId);
        if (elementToRemove) {
            // supprimer l'élément de son parent
            parentElement.removeChild(elementToRemove);
            return true;
        } else {
            console.error("L'élément à supprimer n'a pas été trouvé !");
            return false;
        }
    } else {
        console.error("L'élément parent n'a pas été trouvé !");
        return false;
    }
}

// show custom confirmation
export function showCustomConfirm(callbackFn) {
    const confirmBox = document.getElementById('custom-confirm');
    confirmBox.classList.remove('hidden');
  
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
  
    confirmYesBtn.addEventListener('click', function () {
        callbackFn(true);
        confirmBox.classList.add('hidden');
    });
  
    confirmNoBtn.addEventListener('click', function () {
        callbackFn(false);
        confirmBox.classList.add('hidden');
    });
}
