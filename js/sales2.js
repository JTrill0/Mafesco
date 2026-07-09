/*==========================================================
 FrostFlow
 sales.js - Part B
 Append after Part A
==========================================================*/

/*==========================================================
 KPI CALCULATIONS
==========================================================*/

function updateKPIs(){

    const totalSales=salesData.reduce((sum,s)=>sum+s.total,0);

    const totalTransactions=salesData.length;

    const averageSale=totalTransactions===0 ? 0 : totalSales/totalTransactions;

    const collectibles=salesData
        .filter(s=>s.payment==="Credit")
        .reduce((sum,s)=>sum+s.total,0);

    console.log("Total Sales:",totalSales);
    console.log("Transactions:",totalTransactions);
    console.log("Average:",averageSale);
    console.log("Collectibles:",collectibles);

}

/*==========================================================
 SALES CHART
==========================================================*/

function initializeChart(){

    const canvas=document.getElementById("salesChart");

    if(!canvas) return;

    salesChart=new Chart(canvas,{
        type:"line",
        data:{
            labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            datasets:[{
                label:"Daily Sales",
                data:[12000,18000,15500,24000,21500,26000,19800],
                fill:false,
                tension:.35
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false
        }
    });

}

/*==========================================================
 VIEW TRANSACTION
==========================================================*/

function viewSale(index){

    const s=salesData[index];

    alert(
`========== SALES DETAILS ==========

Invoice No. : ${s.invoice}
Date & Time : ${s.datetime}

Customer    : ${s.customer}
Cashier     : ${s.cashier}
Factory     : ${s.factory}

Sales Type  : ${s.salesType}
Payment     : ${s.payment}
Delivery    : ${s.delivery}
Driver      : ${s.driver}

Total       : ₱${s.total.toLocaleString()}
Status      : ${s.status}`);

}

/*==========================================================
 EXPORT
==========================================================*/

function exportSales(){

    toast("Export to Excel/PDF will be added in the next version.");

}

/*==========================================================
 PLACEHOLDERS
==========================================================*/

function refreshFromPOS(){

    console.log("Loading latest POS transactions...");

}

function syncInventory(){

    console.log("Synchronizing inventory...");

}

function updateCollectibles(){

    console.log("Updating collectibles...");

}

function generateAIRecommendation(){

    console.log("Refreshing AI recommendations...");

}

/*==========================================================
 TOAST
==========================================================*/

function toast(message){

    const div=document.createElement("div");

    div.className="alert alert-success position-fixed";

    div.style.top="20px";
    div.style.right="20px";
    div.style.zIndex="9999";

    div.innerHTML=message;

    document.body.appendChild(div);

    setTimeout(()=>div.remove(),2000);

}
