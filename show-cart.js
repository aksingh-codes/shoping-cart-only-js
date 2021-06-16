if (localStorage.getItem("product_count")==null || localStorage.getItem("cart")==null) { 
    
    //product_count
    localStorage.setItem("product_count",0);

    //cart
    let cart = { items : [] };
    // Convert the person object into JSON string and save it into storage
    localStorage.setItem("cart", JSON.stringify(cart));

}

let globalProductCount = parseInt(localStorage.getItem("product_count"));

window.addEventListener("beforeunload", function() { 
    localStorage.setItem("product_count",globalProductCount);
});

// Retrieve the JSON string
let jsonStringCart = localStorage.getItem("cart");
// Parse the JSON string back to JS object
let globalCart = JSON.parse(jsonStringCart);

window.addEventListener('beforeunload', ()=>{
    localStorage.setItem("cart" ,JSON.stringify(globalCart));
});


show();

console.log(globalCart);


function showCount(){
    let countDOM = document.querySelector(".cart h3.item-count");
    countDOM.innerHTML = `${localStorage.getItem("product_count")}`;
}


//
let addToCartButtons = document.querySelectorAll(".showcase .card-buttons a.add-to-cart");
let itemCount = document.querySelector("p.item-count");


let cancelButton = document.querySelector(".cancel");

if (cancelButton !== null) {
    cancelButton.addEventListener('click' ,(e) => {

        console.log("inside cancel");
        
        //product_count
        globalProductCount = 0;
        localStorage.setItem("product_count",0);
        
        //cart
        globalCart = { items : [] };
        localStorage.setItem("cart", JSON.stringify(globalCart));
        show();
    });
}


let viewItemButton = document.querySelectorAll(".view-item");
if (viewItemButton !== null) {
    for (const button of viewItemButton) {
        button.addEventListener('click' ,saveItemClicked);
    }
}
function saveItemClicked(e) {
    // e.preventDefault();
    console.log(e.target.parentElement.parentElement.querySelector(".card-title").innerHTML);
    localStorage.setItem("itemClicked" , e.target.parentElement.parentElement.querySelector(".card-title").innerHTML );
}


function increaseProductCount(){
    
    //increase product count
    globalProductCount++;
    
    let countDOM = document.querySelector(".cart h3.item-count");
    countDOM.innerHTML = `${globalProductCount}`;

};

function addProductToCart(e){
    let card = e.parentElement.parentElement.parentElement;
    let img = card.querySelector("img").src;
    let title = card.querySelector(".card-title").innerHTML;
    let text = card.querySelector(".card-text").innerHTML;
    let price = card.querySelector(".price .absolute").innerHTML;
    let inCart = 1;

    let flag = false; //assuming newitem is not in cart
    
    let newItem = {};
    newItem.img = `${img}`;
    newItem.title = `${title}`;
    newItem.text = `${text}`;
    newItem.price = `${price}`;
    newItem.inCart = `${inCart}`;
    // console.log(newItem);
    
    let cart = globalCart;
    console.log(cart);

    for (let i = 0; i < cart.items.length; i++) {
        const element = cart.items[i];
        if (element.title === title) {
            flag = true;    // item is already in cart
            cart.items[i].inCart = parseInt(cart.items[i].inCart) + 1;
            console.log(parseInt(parseInt(cart.items[i].inCart)));
            break;
        }
    }

    if (flag === false) {
        cart.items.push(newItem);
    }

    // //  Now setting cart to local storage
    // localStorage.setItem("cart", JSON.stringify(cart));
    
    // console.log(cart);
}

for (let i = 0; i < addToCartButtons.length; i++) {
    const element = addToCartButtons[i];
    element.addEventListener('click' , ()=>{
        // console.log("inside addtocart");
        increaseProductCount();
        addProductToCart(element);
    });
}


function makeCardFromItem(element){

    let {img,price,text,title,inCart} = {...element};
    let card = document.createElement(`div`);

    card.classList.add("card");
    card.classList.add("col-lg-3");
    card.classList.add("col-sm-6");

    card.innerHTML = `
        
            <img src="${img}" alt="">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <div class="quantity-div mt-4">
                    <h6 class="quantity muted-text">Quantity :</h6>
                    <input class="quantity" type="number" name="" id="" value="${inCart}">
                </div>
                <div class="quantity-div">
                    <h6 class="">Price :</h6>
                    <div class="price">
                        <h6>₹<span class="absolute">${price}</span></h6>
                    </div>
                </div>
            </div>
            <i class="fas fa-times-circle"></i>
        
    `;
    

    let showCartDOM = document.querySelector(".show-cart-items");
    
    
    if (showCartDOM !== null) {
        showCartDOM.appendChild(card);
    }
    

}

function showCartOnPage() {
    
    let showCartDOM = document.querySelector(".show-cart-items");
    
    if (showCartDOM !== null) {

        console.log("inside showcart");

        showCartDOM.innerHTML = "";

        let cart = globalCart;
        
        if (cart.items.length>0) {
            for (let i = 0; i < cart.items.length; i++) {
                const element = cart.items[i];
                makeCardFromItem(element);
            }
        } else {
            
            let card = document.createElement(`div`);
            card.innerHTML = `<h2>Cart is empty!</h2><img src="https://image.flaticon.com/icons/png/512/2038/2038854.png">`
                
            if (showCartDOM !== null) {
                showCartDOM.appendChild(card);
            }
        }

    }
    
}


function calculate() {
    
    if (document.querySelector('.bill')) {
        
        let cart = globalCart;

        let costOfProducts = 0;
        let deliveryCharge = 50;
        let total = 0;

        let costOfProductsDOM = document.querySelector(".bill .costOfProducts");
        let deliveryChargeDOM = document.querySelector(".bill .deliveryCharge");
        let totalDOM = document.querySelector(".bill .total");

        if (cart.items.length>0) {
            for (const iterator of cart.items) {
                let quantity = iterator.inCart;
                costOfProducts = costOfProducts + (parseInt(iterator.price) * quantity);
            }
            total = costOfProducts + deliveryCharge;
        }
        else{
            deliveryCharge = 0;
        }

        costOfProductsDOM.innerHTML = `Cost of products : ₹${costOfProducts}`;
        deliveryChargeDOM.innerHTML = `Delivery Charge : ₹${deliveryCharge}`;
        totalDOM.innerHTML = `Total : ₹${total} /-`;

    }

}



let removeDOM = document.querySelectorAll(".show-cart-items .card .fa-times-circle");
for (const iterator of removeDOM) {
    iterator.addEventListener('click' , (e)=>{
        
        let removeParentDOM = e.target.parentElement;
        let title = removeParentDOM.querySelector(".card-title").innerHTML;
        let quantity = removeParentDOM.querySelector("input.quantity").value;

        removeParentDOM.remove();   //remove from screen

        globalProductCount = globalProductCount - quantity;
        let countDOM = document.querySelector(".cart h3.item-count");
        countDOM.innerHTML = `${globalProductCount}`;
        
        for (let i = 0; i < globalCart.items.length; i++) {
            const element = globalCart.items[i];
            if (element.title === title) {
                globalCart.items.splice(i,1);   //remove at index
                break;
            }
        }

        console.log("globalCart");

        calculate();
    });
}



let quantityDOM = document.querySelectorAll(".show-cart-items input.quantity");
for (const element of quantityDOM) {
    element.addEventListener('input', updateQuantityCalculate);
}

function updateQuantityCalculate(e) {
    let updateValue =  e.target.value;
    let title = e.target.parentElement.parentElement.querySelector(".card-title").innerHTML;
    
    let cart = globalCart;

    for (let i = 0; i < cart.items.length; i++) {
        const element = cart.items[i];
        if (element.title === title) {
            element.inCart = updateValue;
            break;
        }
    }

    globalCart = cart;
    
    let newCount = 0;
    for (const element of document.querySelectorAll(".show-cart-items input.quantity")) {
        newCount = newCount + parseInt(element.value);
    }
    globalProductCount = newCount;
    
    let countDOM = document.querySelector(".cart h3.item-count");
    countDOM.innerHTML = `${globalProductCount}`;

    calculate();
}







function show() {
    showCount();
    showCartOnPage();
    calculate();
}

