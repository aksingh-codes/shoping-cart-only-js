

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


let AllProducts = fetch("products.json");
AllProducts
.then(res => res.json())
.then( data => {

    for (const element of data.items) {
        makeElementOnpage(element);
    }      

    function makeElementOnpage(element) {
        
        let showcaseRowDOM = document.querySelector(".showcase .row");
        let card = document.createElement("div");
        card.classList.add("col-lg-4");
        card.classList.add("col-sm-6");
        card.classList.add("card");


        card.innerHTML = `  
                            <div class="image-container">
                                <img src="${element.image}" alt="">
                            </div>
                            
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero, accusantium!</p>
                                <div class="price">
                                    <h6>${element.currency}<span class="absolute">${element.price}</span></h6>
                                </div>
                                <div class="card-buttons">
                                    <a href="view-item.html" class="btn btn-dark view-item">View Item</a>
                                    <a class="btn btn-outline-dark add-to-cart">Add to Cart</a>
                                </div>
                            </div>
        `;
        console.log(card);
        
        showcaseRowDOM.appendChild(card);

    }

    showCount();

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

    function showCount(){
        let countDOM = document.querySelector(".cart h3.item-count");
        countDOM.innerHTML = `${localStorage.getItem("product_count")}`;
    }

    let addToCartButtons = document.querySelectorAll(".showcase .card-buttons a.add-to-cart");
    let itemCount = document.querySelector("p.item-count");

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
            showCount();
        });
    }
    
});