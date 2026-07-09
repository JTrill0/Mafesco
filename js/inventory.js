/*==========================================================
    FrostFlow Inventory Module
    Part 1 - Data, KPI and Table Rendering
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadInventory();

});

/*==========================================================
    SAMPLE INVENTORY DATA
==========================================================*/

const inventoryData = [

{
    inventoryID:"INV0001",
    product:"Tube Ice",
    factory:"Factory A",
    productionDate:"2026-07-10",
    machine:"A",
    grid:80,
    produced:2000,
    available:1980,
    storage:"Cold Storage A",
    expiry:"2026-07-17",
    damaged:20
},

{
    inventoryID:"INV0002",
    product:"Tube Ice",
    factory:"Factory B",
    productionDate:"2026-07-11",
    machine:"A",
    grid:68,
    produced:1500,
    available:1500,
    storage:"Cold Storage B",
    expiry:"2026-07-18",
    damaged:0
},

{
    inventoryID:"INV0003",
    product:"Tube Ice",
    factory:"Factory B",
    productionDate:"2026-07-12",
    machine:"B",
    grid:72,
    produced:971,
    available:971,
    storage:"Cold Storage B",
    expiry:"2026-07-19",
    damaged:0
}

];

/*==========================================================
    INITIALIZE
==========================================================*/

function loadInventory(){

    updateKPI();

    renderInventoryTable(inventoryData);

}

/*==========================================================
    KPI
==========================================================*/

function updateKPI(){

    let totalProduced = 0;
    let totalAvailable = 0;
    let totalDamaged = 0;

    inventoryData.forEach(item=>{

        totalProduced += item.produced;

        totalAvailable += item.available;

        totalDamaged += item.damaged;

    });

    document.getElementById("totalProduction").innerHTML =
        totalProduced.toLocaleString();

    document.getElementById("totalStock").innerHTML =
        totalAvailable.toLocaleString();

    document.getElementById("batchCount").innerHTML =
        inventoryData.length;

}

/*==========================================================
    INVENTORY TABLE
==========================================================*/

function renderInventoryTable(data){

    const tbody = document.getElementById("inventoryTable");

    tbody.innerHTML = "";

    data.forEach(item=>{

        tbody.innerHTML += `

<tr>

<td>${item.inventoryID}</td>

<td>

<div class="d-flex align-items-center">

<div class="product-icon me-2">

<i class="bi bi-snow2"></i>

</div>

<div>

<strong>${item.product}</strong>

</div>

</div>

</td>

<td>${item.factory}</td>

<td>${formatDate(item.productionDate)}</td>

<td>${item.machine}</td>

<td>${item.grid}</td>

<td>${item.produced.toLocaleString()}</td>

<td>${item.available.toLocaleString()}</td>

<td>${item.storage}</td>

<td>${formatDate(item.expiry)}</td>

<td>

${getStatusBadge(item)}

</td>

<td>

<button class="action-btn view-btn"

onclick="viewBatch('${item.inventoryID}')">

<i class="bi bi-eye"></i>

</button>

<button class="action-btn edit-btn">

<i class="bi bi-pencil"></i>

</button>

</td>

</tr>

`;

    });

}

/*==========================================================
    STATUS
==========================================================*/

function getStatusBadge(item){

    const today = new Date();

    const expiry = new Date(item.expiry);

    const days = Math.ceil(

        (expiry - today)

        /

        (1000*60*60*24)

    );

    if(days<=0){

        return `<span class="badge-status status-expired">

Expired

</span>`;

    }

    if(days<=2){

        return `<span class="badge-status status-warning">

Near Expiry

</span>`;

    }

    if(item.available < item.produced){

        return `<span class="badge-status status-released">

Released

</span>`;

    }

    return `<span class="badge-status status-fresh">

Fresh

</span>`;

}

/*==========================================================
    VIEW
==========================================================*/

function viewBatch(id){

    const batch = inventoryData.find(

        item=>item.inventoryID===id

    );

    alert(

`Inventory ID : ${batch.inventoryID}

Product : ${batch.product}

Factory : ${batch.factory}

Machine : ${batch.machine}

Grid : ${batch.grid}

Produced : ${batch.produced}

Available : ${batch.available}

Storage : ${batch.storage}

Expiry : ${formatDate(batch.expiry)}`

);

}

/*==========================================================
    DATE FORMAT
==========================================================*/

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleDateString(

        "en-US",

        {

            month:"short",

            day:"numeric",

            year:"numeric"

        }

    );

}


/*==========================================================
 FrostFlow Inventory Module
 inventory.js - Part 2A (Append after Part 1 or merge)
==========================================================*/

let filteredInventory = [...inventoryData];
let inventoryChart = null;

/*==========================================================
 INITIALIZATION
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeInventoryModule();

});

function initializeInventoryModule(){

    bindEvents();

    initializeChart();

    renderRecentMovements();

    updateAIRecommendation();

}

/*==========================================================
 EVENTS
==========================================================*/

function bindEvents(){

    const txt=document.getElementById("txtSearchProduct");
    const fac=document.getElementById("cmbFactory");
    const mac=document.getElementById("cmbMachine");
    const sts=document.getElementById("cmbStatus");
    const ref=document.getElementById("btnRefresh");

    if(txt) txt.addEventListener("keyup",filterInventory);
    if(fac) fac.addEventListener("change",filterInventory);
    if(mac) mac.addEventListener("change",filterInventory);
    if(sts) sts.addEventListener("change",filterInventory);
    if(ref) ref.addEventListener("click",refreshInventory);

}

/*==========================================================
 FILTER
==========================================================*/

function filterInventory(){

    const keyword=document.getElementById("txtSearchProduct").value.toLowerCase();
    const factory=document.getElementById("cmbFactory").value;
    const machine=document.getElementById("cmbMachine").value;
    const status=document.getElementById("cmbStatus").value;

    filteredInventory=inventoryData.filter(item=>{

        let ok=true;

        if(keyword!=="")
            ok = ok && item.product.toLowerCase().includes(keyword);

        if(factory!=="All Factory")
            ok = ok && item.factory===factory;

        if(machine!=="Machine")
            ok = ok && item.machine===machine;

        if(status!=="Status")
            ok = ok && getStatusText(item)===status;

        return ok;

    });

    renderInventoryTable(filteredInventory);
    updateChart(filteredInventory);
    updateAIRecommendation(filteredInventory);

}

/*==========================================================
 STATUS
==========================================================*/

function getStatusText(item){

    const today=new Date();
    const expiry=new Date(item.expiry);

    const days=Math.ceil((expiry-today)/(1000*60*60*24));

    if(days<=0) return "Expired";
    if(days<=2) return "Near Expiry";
    if(item.available<item.produced) return "Released";

    return "Fresh";

}

/*==========================================================
 REFRESH
==========================================================*/

function refreshInventory(){

    document.getElementById("txtSearchProduct").value="";
    document.getElementById("cmbFactory").selectedIndex=0;
    document.getElementById("cmbMachine").selectedIndex=0;
    document.getElementById("cmbStatus").selectedIndex=0;

    filteredInventory=[...inventoryData];

    renderInventoryTable(filteredInventory);
    updateChart(filteredInventory);
    updateAIRecommendation(filteredInventory);

}

/*==========================================================
 CHART
==========================================================*/

function initializeChart(){

    const canvas=document.getElementById("chartInventoryDistribution");
    if(!canvas) return;

    inventoryChart=new Chart(canvas,{

        type:"doughnut",

        data:{
            labels:["Tube Ice","Cube Ice","Block Ice"],
            datasets:[{
                data:[0,0,0]
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    position:"bottom"
                }
            }
        }

    });

    updateChart(inventoryData);

}

function updateChart(data){

    if(!inventoryChart) return;

    let tube=0,cube=0,block=0;

    data.forEach(item=>{

        switch(item.product){

            case "Tube Ice":
                tube+=item.available;
                break;

            case "Cube Ice":
                cube+=item.available;
                break;

            case "Block Ice":
                block+=item.available;
                break;

        }

    });

    inventoryChart.data.datasets[0].data=[tube,cube,block];
    inventoryChart.update();

}

/*==========================================================
 RECENT MOVEMENT
==========================================================*/

function renderRecentMovements(){

    const tbody=document.getElementById("tblStockMovement");
    if(!tbody) return;

    const rows=[

        ["08:10 AM","Stock In","Tube Ice","+500","Warehouse A"],

        ["09:25 AM","Release","Tube Ice","-120","Sales"],

        ["10:40 AM","Adjustment","+20","Supervisor"],

        ["11:05 AM","Transfer","Tube Ice","-300","Factory B"]

    ];

    tbody.innerHTML="";

    rows.forEach(r=>{

        tbody.innerHTML+=`
        <tr>
            <td>${r[0]}</td>
            <td>${r[1]}</td>
            <td>${r[2]}</td>
            <td>${r[3]}</td>
            <td>${r[4]}</td>
        </tr>`;

    });

}

/*==========================================================
 AI RECOMMENDATION
==========================================================*/

function updateAIRecommendation(data=inventoryData){

    const ai=document.getElementById("txtAIRecommendation");
    const forecast=document.getElementById("lblForecast");

    if(!ai) return;

    const stock=data.reduce((t,x)=>t+x.available,0);

    if(stock<2000){

        ai.innerHTML="Current inventory is below the preferred safety level. Increase production in the next production cycle.";
        forecast.innerHTML="+18%";

    }else if(stock<4000){

        ai.innerHTML="Inventory level is healthy. Continue monitoring demand before increasing production.";
        forecast.innerHTML="+10%";

    }else{

        ai.innerHTML="Inventory level is sufficient. Prioritize sales and deliveries before scheduling additional production.";
        forecast.innerHTML="+5%";

    }

}

/*==========================================================
 PLACEHOLDERS
==========================================================*/

["btnExportPDF","btnExportExcel","btnNewBatch","btnTransferStock","btnStockAdjustment"].forEach(id=>{

    const btn=document.getElementById(id);

    if(btn){

        btn.addEventListener("click",()=>{

            alert(id + " feature will be connected to the database in the next phase.");

        });

    }

});



/*==========================================================
 FrostFlow Inventory Module
 inventory.js - Part 2B
 Append after Part 2A
==========================================================*/

/*==========================================================
 BATCH DETAILS MODAL
==========================================================*/

function viewBatch(id){

    const batch = inventoryData.find(x=>x.inventoryID===id);

    if(!batch) return;

    const body=document.getElementById("modalBatchContent");

    if(body){

        body.innerHTML=`
        <div class="row">

            <div class="col-md-6">
                <p><strong>Inventory ID</strong><br>${batch.inventoryID}</p>
                <p><strong>Product</strong><br>${batch.product}</p>
                <p><strong>Factory</strong><br>${batch.factory}</p>
                <p><strong>Machine</strong><br>${batch.machine}</p>
            </div>

            <div class="col-md-6">
                <p><strong>Grid</strong><br>${batch.grid}</p>
                <p><strong>Produced</strong><br>${batch.produced.toLocaleString()}</p>
                <p><strong>Available</strong><br>${batch.available.toLocaleString()}</p>
                <p><strong>Storage</strong><br>${batch.storage}</p>
            </div>

        </div>

        <hr>

        <p><strong>Production Date:</strong> ${formatDate(batch.productionDate)}</p>
        <p><strong>Expiry Date:</strong> ${formatDate(batch.expiry)}</p>
        <p><strong>Status:</strong> ${getStatusBadge(batch)}
        </p>`;
    }

    const modal=new bootstrap.Modal(document.getElementById("modalBatchDetails"));
    modal.show();

}

/*==========================================================
 KPI REFRESH
==========================================================*/

function refreshKPI(){

    let produced=0;
    let available=0;
    let damaged=0;

    filteredInventory.forEach(item=>{
        produced+=item.produced;
        available+=item.available;
        damaged+=item.damaged;
    });

    const set=(id,val)=>{
        const e=document.getElementById(id);
        if(e) e.textContent=val.toLocaleString();
    };

    set("lblTotalProduction",produced);
    set("lblTotalStock",available);
    set("lblDamaged",damaged);
    set("lblBatchCount",filteredInventory.length);

}

/*==========================================================
 SIMPLE TOAST
==========================================================*/

function showToast(message){

    const toast=document.createElement("div");

    toast.className="alert alert-success position-fixed";

    toast.style.top="20px";
    toast.style.right="20px";
    toast.style.zIndex="9999";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },2500);

}

/*==========================================================
 CRUD PLACEHOLDERS
==========================================================*/

document.getElementById("btnNewBatch")?.addEventListener("click",()=>{

    showToast("New Batch dialog will be connected to the database.");

});

document.getElementById("btnStockAdjustment")?.addEventListener("click",()=>{

    showToast("Stock Adjustment feature coming soon.");

});

document.getElementById("btnTransferStock")?.addEventListener("click",()=>{

    showToast("Transfer Stock feature coming soon.");

});

document.getElementById("btnExportPDF")?.addEventListener("click",()=>{

    showToast("Generating PDF report...");

});

document.getElementById("btnExportExcel")?.addEventListener("click",()=>{

    showToast("Generating Excel report...");

});

/*==========================================================
 LIVE CLOCK (OPTIONAL)
==========================================================*/

setInterval(()=>{

    refreshKPI();

},10000);

/*==========================================================
 DEMO INVENTORY CHANGES
==========================================================*/

setInterval(()=>{

    if(inventoryData.length===0) return;

    const i=Math.floor(Math.random()*inventoryData.length);

    if(inventoryData[i].available>0){

        inventoryData[i].available--;

    }

    filteredInventory=[...inventoryData];

    renderInventoryTable(filteredInventory);

    updateChart(filteredInventory);

    refreshKPI();

    updateAIRecommendation(filteredInventory);

},15000);

/*==========================================================
 ROW HIGHLIGHT
==========================================================*/

document.addEventListener("click",e=>{

    const row=e.target.closest("tbody tr");

    if(!row) return;

    document.querySelectorAll("#tblInventory tr").forEach(r=>r.classList.remove("table-primary"));

    row.classList.add("table-primary");

});

/*==========================================================
 INITIAL REFRESH
==========================================================*/

refreshKPI();
updateAIRecommendation(filteredInventory);
updateChart(filteredInventory);
