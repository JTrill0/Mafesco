
/*==========================================================
 FrostFlow POS
 pos.js - Part A
==========================================================*/

const products=[
 {id:1,name:"Tube Ice",price:35},
 {id:2,name:"Cube Ice",price:30},
 {id:3,name:"Block Ice",price:150}
];

let cart=[];

document.addEventListener("DOMContentLoaded",()=>{

    initializePOS();

});

function initializePOS(){

    bindProductButtons();

    bindEvents();

    renderCart();

}

function bindProductButtons(){

    document.querySelectorAll("#productCatalog .product-card").forEach((card,index)=>{

        card.querySelector("button").addEventListener("click",()=>{

            addToCart(products[index].id);

        });

    });

}

function bindEvents(){

    document.getElementById("cmbDiscount")?.addEventListener("change",computeTotals);
    document.getElementById("cmbDelivery")?.addEventListener("change",computeTotals);
    document.getElementById("txtCash")?.addEventListener("input",computeChange);

}

function addToCart(id){

    const item=cart.find(x=>x.id===id);

    if(item) item.qty++;
    else cart.push({id:id,qty:1});

    renderCart();

}

function changeQty(id,delta){

    const item=cart.find(x=>x.id===id);

    if(!item) return;

    item.qty+=delta;

    if(item.qty<=0)
        cart=cart.filter(x=>x.id!==id);

    renderCart();

}

function renderCart(){

    const tbl=document.getElementById("tblCart");

    tbl.innerHTML="";

    cart.forEach(item=>{

        const p=products.find(x=>x.id===item.id);

        tbl.innerHTML+=`
        <tr>
            <td>${p.name}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id},-1)">-</button>
                <span class="mx-2">${item.qty}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id},1)">+</button>
            </td>
            <td>₱${(p.price*item.qty).toFixed(2)}</td>
        </tr>`;

    });

    computeTotals();

}

function computeTotals(){

    let subtotal=0;

    cart.forEach(item=>{

        const p=products.find(x=>x.id===item.id);

        subtotal+=p.price*item.qty;

    });

    let rate=0;

    switch(document.getElementById("cmbDiscount").selectedIndex){

        case 1: rate=.10; break;
        case 2: rate=.20; break;
        case 3: rate=.05; break;

    }

    const discount=subtotal*rate;

    let delivery=0;

    switch(document.getElementById("cmbDelivery").selectedIndex){

        case 2: delivery=100; break;
        case 3: delivery=250; break;

    }

    const grand=subtotal-discount+delivery;

    setMoney("lblSubtotal",subtotal);
    setMoney("lblDiscount",discount);
    setMoney("lblDelivery",delivery);
    setMoney("lblGrandTotal",grand);

    computeChange();

}

function setMoney(id,val){

    document.getElementById(id).textContent="₱"+val.toFixed(2);

}

function getGrandTotal(){

    return parseFloat(document.getElementById("lblGrandTotal").textContent.replace(/[₱,]/g,""))||0;

}

function computeChange(){

    const cash=parseFloat(document.getElementById("txtCash").value)||0;

    document.getElementById("txtChange").value="₱"+Math.max(0,cash-getGrandTotal()).toFixed(2);

}


/*==========================================================
 FrostFlow POS
 pos.js - Part B
 Append after Part A
==========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    document.getElementById("btnCheckout")?.addEventListener("click",checkout);
    document.getElementById("btnReceipt")?.addEventListener("click",printReceipt);
    document.getElementById("btnClear")?.addEventListener("click",clearTransaction);

});

function checkout(){

    if(cart.length===0){

        toast("Cart is empty.");
        return;

    }

    const customer=document.getElementById("txtCustomer").value || "Walk-in Customer";

    toast("Sale completed for "+customer);

    alert(
`FROSTFLOW RECEIPT

Customer : ${customer}

Total : ${document.getElementById("lblGrandTotal").textContent}

Cash : ₱${(parseFloat(document.getElementById("txtCash").value)||0).toFixed(2)}

Change : ${document.getElementById("txtChange").value}

Thank you!`);

}

function printReceipt(){

    window.print();

}

function clearTransaction(){

    if(!confirm("Clear current transaction?")) return;

    cart=[];

    document.getElementById("txtCustomer").value="";
    document.getElementById("txtCash").value="";
    document.getElementById("txtChange").value="";

    document.getElementById("cmbDiscount").selectedIndex=0;
    document.getElementById("cmbDelivery").selectedIndex=0;

    renderCart();

    toast("Transaction cleared.");

}

function toast(message){

    const t=document.createElement("div");

    t.className="alert alert-success position-fixed";

    t.style.top="20px";
    t.style.right="20px";
    t.style.zIndex="9999";

    t.innerHTML=message;

    document.body.appendChild(t);

    setTimeout(()=>t.remove(),2200);

}

/* Demo inventory sync placeholder */

function reduceInventory(){

    console.log("Inventory updated.");

}

/* Demo sales history placeholder */

function saveTransaction(){

    console.log("Transaction saved.");

}
