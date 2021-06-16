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

showCount();

function showCount(){
    let countDOM = document.querySelector(".cart h3.item-count");
    countDOM.innerHTML = `${globalProductCount}`;
}

let AllProducts = fetch("products.json");
AllProducts
.then(res => res.json())
.then( data => {
    let viewItemCard = document.querySelector(".card.info");
    if (viewItemCard != null) {
        let title = localStorage.getItem("itemClicked");
        // console.log(data.items);
        for (const element of data.items) {
            if (element.title === title) {
                // console.log(element);
                makeElementOnpage(element);
                break;
            }
        }

        function makeElementOnpage(element) {
            let imageCard = document.querySelector(".card.img.view-item");
            imageCard.innerHTML = `<img src="${element.image}" alt="">`;
            
            viewItemCard.innerHTML = `
                                        <h4 class="display-5 card-title">${element.title}</h4>
                                        <div class="quantity-div mt-2">
                                            <p class="information display-6">${element.info}</p>
                                            <div class="cost mb-4">
                                                <span class="currency">${element.currency}</span><span class="price">${element.price}</span>
                                            </div>
                                        </div>
                                        <div class="card-buttons">
                                            <a href="" class="btn btn-dark add-btn">Add Item</a>
                                            <a href="" class="btn btn-outline-dark rm-btn">Remove Item</a>
                                        </div> 

                                        `;
            
            newFunction(element);
        }
    }

    
});

function newFunction(element) {
    var addItemDOM = document.querySelector(".add-btn");
    var removeItemDOM = document.querySelector(".show-item .rm-btn");
    var title = document.querySelector(".card-title").innerHTML;
    console.log(document.querySelector(".add-btn"));

    let flag = false; //not present

    addItemDOM.addEventListener('click' , (e)=>{
        e.preventDefault();
        globalProductCount++;
        // console.log(e);
        for (let i = 0; i < globalCart.items.length; i++) {
            const element = globalCart.items[i];
            if (element.title === title) {
                globalCart.items[i].inCart++;
                flag = true;
                console.log(flag);
                break;
            }
        }

        if (flag !== true) {
            console.log(flag);
            
            let newItem = {};
            newItem.img = `${element.image}`;
            newItem.title = `${element.title}`;
            newItem.text = `${element.info}`;
            newItem.price = `${element.price}`;
            newItem.inCart = `${1}`;

            globalCart.items.push(newItem);
        }

        showCount();
    });


    removeItemDOM.addEventListener('click', (e)=>{
        e.preventDefault();
        let rflag = false;

        for (let i = 0; i < globalCart.items.length; i++) {
            const element = globalCart.items[i];
            if (element.title === title) {
                
                globalCart.items[i].inCart--;
                globalProductCount--;
                
                rflag = true;
                break;
            }
        }

        if (rflag === false) {
            console.log("element is not present");
        }

        showCount();
    });
}




    

    // // removeItemDOM.addEventListener('click' ,()=>{

    // // });