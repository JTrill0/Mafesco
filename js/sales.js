/*==========================================================
 FrostFlow
 sales.js - Part A
==========================================================*/

const salesData = [

{
invoice:"INV-000125",
datetime:"09 Jul 2026 09:35",
customer:"ABC Seafood",
cashier:"Maria Santos",
factory:"Factory A",
salesType:"Delivery",
payment:"Cash",
delivery:"Yes",
driver:"Juan Dela Cruz",
total:2350,
status:"Delivered"
},

{
invoice:"INV-000126",
datetime:"09 Jul 2026 10:10",
customer:"Maria Store",
cashier:"Peter Ramos",
factory:"Factory B",
salesType:"Pick-up",
payment:"Credit",
delivery:"No",
driver:"-",
total:6200,
status:"Collectible"
},

{
invoice:"INV-000127",
datetime:"09 Jul 2026 10:42",
customer:"Hotel Oazis",
cashier:"Maria Santos",
factory:"Factory A",
salesType:"Walk-in",
payment:"Cash",
delivery:"No",
driver:"-",
total:1800,
status:"Completed"
}

];

let salesChart;

/*==========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initializeSales();

});

/*==========================================================*/

function initializeSales(){

    renderSalesTable(salesData);

    initializeChart();

    updateKPIs();

    bindEvents();

}

/*==========================================================*/

function bindEvents(){

    document.querySelector('input[placeholder*="Invoice"]')
        ?.addEventListener("keyup",filterSales);

}

/*==========================================================*/

function renderSalesTable(data){

    const body=document.getElementById("salesTableBody");

    if(!body) return;

    body.innerHTML="";

    data.forEach((sale,index)=>{

        body.innerHTML+=`

        <tr>

        <td>${sale.invoice}</td>

        <td>${sale.datetime}</td>

        <td>${sale.customer}</td>

        <td>${sale.cashier}</td>

        <td>${sale.factory}</td>

        <td>${sale.salesType}</td>

        <td>${sale.payment}</td>

        <td>${sale.delivery}</td>

        <td>${sale.driver}</td>

        <td>₱${sale.total.toLocaleString()}</td>

        <td>${statusBadge(sale.status)}</td>

        <td>

        <button
        class="btn btn-sm btn-outline-primary"
        onclick="viewSale(${index})">

        View

        </button>

        </td>

        </tr>

        `;

    });

}

/*==========================================================*/

function statusBadge(status){

    switch(status){

        case "Delivered":
            return '<span class="badge bg-success">Delivered</span>';

        case "Collectible":
            return '<span class="badge bg-warning text-dark">Collectible</span>';

        case "Completed":
            return '<span class="badge bg-primary">Completed</span>';

        default:
            return '<span class="badge bg-secondary">'+status+'</span>';

    }

}

/*==========================================================*/

function filterSales(){

    const keyword=this.value.toLowerCase();

    const filtered=salesData.filter(s=>

        s.invoice.toLowerCase().includes(keyword) ||

        s.customer.toLowerCase().includes(keyword) ||

        s.cashier.toLowerCase().includes(keyword)

    );

    renderSalesTable(filtered);

}

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

