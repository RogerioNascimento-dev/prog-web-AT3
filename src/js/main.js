import { cepValues, products } from './data.js';

const cartEmpty = `<div class="cart-empty">
                    <img src="src/img/cart.png" alt="Carrinho de compras">
                    <p>Nenhum item adicionado.</p>
                    </div>`;

//Definições de variáveis globais.
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const productsInCart = [];
let totalPriceCart = 0;
let priceShipping = 0;

//Definições das funções
const updateCart = () => {
    $('#content-cart').innerHTML = '';

    if (productsInCart.length === 0) {
        $('#content-cart').innerHTML = cartEmpty;
        $('.container-shipping').setAttribute('style', 'display:none');
        return;
    }

    $('.container-shipping').setAttribute('style', 'display:block');
    addFunctionInputCep();

    $('#content-cart').innerHTML = `
    <div class="cart-products">
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Quatidade</th>
                    <th>Valor</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody id="table-content-cart">
            </tbody>
            <tfoot>
        <tr>
            <th colspan="3">Total</th>
            <td id="total-price"></td>
        </tr>
    </tfoot>
        </table>
    </div>`;

    let tableContentCart = ``;
    let totalPrice = 0;
    productsInCart.map(product => {
        $(`#qtd-product-${product.id}`).value = product.quantity;
        tableContentCart += `<tr>
        <td>${product.title}</td>
        <td>${product.quantity}</td>
        <td>${floatToReal(product.price)}</td>
        <td>${floatToReal(product.price * product.quantity)}</td>
        </tr>`;
        totalPrice += product.price * product.quantity;
    });
    totalPrice += priceShipping;

    if (priceShipping > 0) {
        tableContentCart += `<tr style="color:red">
        <th>Entrega</td>        
        <th></td>        
        <th>${floatToReal(priceShipping)}</td>
        <th>${floatToReal(priceShipping)}</td>
        </tr>`;
    }

    $('#table-content-cart').innerHTML = tableContentCart;
    $('#total-price').innerText = floatToReal(totalPrice);
    totalPriceCart = totalPrice;
}

const listProducts = () => {
    let contentProductsList = ``;
    products.map(product => {
        contentProductsList += `<li>
                          <div class="container-img">
                            <img src="${product.photo}" alt="${product.title}">
                          </div>
                          <h1>${product.title}</h1>
                          <p>${sliceDescription(product.description)}</p>
                          <div class="container-price">
                              <span>${floatToReal(product.price)}</span>
                              <div class="actions">
                                  <button data-id="${product.id}" class="minus"><i class="fa fa-minus"></i></button>
                                  <input id="qtd-product-${product.id}" type="text" readonly value="0">
                                  <button data-id="${product.id}" class="plus"><i class="fa fa-plus"></i></button>
                              </div>
                          </div>
                        </li>`;
    });
    $('#products-list').innerHTML = contentProductsList;
}
const floatToReal = (value) => {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

const sliceDescription = (description) => {
    let cut = 80;
    let Ismore = (description.length > cut) ? '...' : '';
    return description.slice(0, cut) + Ismore;
}


const addFuntionButtonPlus = () => {
    $$('.plus').forEach(buttonPlus => {
        buttonPlus.addEventListener('click', () => {
            let targetId = parseInt(buttonPlus.getAttribute('data-id'));
            let indexProductList = products.findIndex(product => product.id === targetId)
            let indexProductCart = productsInCart.findIndex(product => product.id === targetId)

            if (indexProductCart == -1) {
                productsInCart.push({...products[indexProductList], quantity: 1 })
            } else {
                productsInCart[indexProductCart].quantity++
            }

            updateCart();

        })
    })
}
const addFuntionButtonMinus = () => {
    $$('.minus').forEach(buttonMinus => {
        buttonMinus.addEventListener('click', () => {
            let targetId = parseInt(buttonMinus.getAttribute('data-id'));
            let indexProductList = products.findIndex(product => product.id === targetId)
            let indexProductCart = productsInCart.findIndex(product => product.id === targetId)
            if (indexProductCart != -1) {
                productsInCart[indexProductCart].quantity--;
                updateCart();
                if (productsInCart[indexProductCart].quantity === 0) {
                    productsInCart.splice(indexProductCart, 1);
                }
            }
            updateCart();
        })
    })
}
const addFunctionInputCep = () => {
    $('#cep').addEventListener('blur', () => {
        let cepValue = $('#cep').value;
        if (cepValue != '' || parseInt(cepValue.charAt(0)) >= 0) {
            const indexValue = parseInt(cepValue.charAt(0));
            const region = cepValues[indexValue];
            $('#shipping-to-region').innerText = `Frete para ${region.region}`
            $('#shipping-to-price').innerText = floatToReal(region.price);
            priceShipping = region.price;
            updateCart();
            return;
        }
        $('#shipping-to-region').innerText = ``
        $('#shipping-to-price').innerText = ``;
        $('#total-price').innerText = floatToReal(totalPriceCart);
        priceShipping = 0;
        updateCart();
    });
}

listProducts();
updateCart();
addFuntionButtonPlus();
addFuntionButtonMinus();