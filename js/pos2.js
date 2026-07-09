
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
