
/*==========================================================
 FrostFlow Production Module
 production.js - PART A
==========================================================*/

const MACHINE_ROWS = 4;
const MACHINE_COLS = 20;

const GridStatus = {
    STANDBY:"standby",
    PROCESSING:"processing",
    COMPLETED:"completed",
    MAINTENANCE:"error"
};

const machines=[
{
    id:"A",
    name:"Machine A",
    operator:"Juan Dela Cruz",
    batch:"B2026-001",
    efficiency:96,
    grids:[]
}
];

let productionChart=null;

/*==========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initializeProduction();

});

/*==========================================================*/

function initializeProduction(){

    createMachineGrids();

    renderGrid();

    updateDashboard();

    initializeChart();

    bindControls();

}

/*==========================================================*/

function createMachineGrids(){

    machines.forEach(machine=>{

        machine.grids=[];

        for(let row=0;row<MACHINE_ROWS;row++){

            for(let col=0;col<MACHINE_COLS;col++){

                const no=row+1+(col*MACHINE_ROWS);

                let status=GridStatus.STANDBY;

                if(no<=10) status=GridStatus.COMPLETED;
                else if(no<=22) status=GridStatus.PROCESSING;

                machine.grids.push({

                    id:no,
                    status:status,
                    started:"08:00 AM",
                    expected:"11:00 AM"

                });

            }

        }

    });

}

/*==========================================================*/

function renderGrid(){

    const container=document.getElementById("productionGrid");

    if(!container) return;

    container.innerHTML="";

    machines[0].grids.forEach(grid=>{

        const div=document.createElement("div");

        div.className="ice-cell "+grid.status;

        div.innerHTML=grid.id;

        div.onclick=()=>showGridDetails(grid);

        container.appendChild(div);

    });

}

/*==========================================================*/

function showGridDetails(grid){

    const body=document.getElementById("modalGridContent");

    body.innerHTML=`

    <table class="table">

    <tr><th>Grid</th><td>${grid.id}</td></tr>
    <tr><th>Status</th><td>${grid.status}</td></tr>
    <tr><th>Machine</th><td>${machines[0].name}</td></tr>
    <tr><th>Batch</th><td>${machines[0].batch}</td></tr>
    <tr><th>Operator</th><td>${machines[0].operator}</td></tr>
    <tr><th>Started</th><td>${grid.started}</td></tr>
    <tr><th>Expected Finish</th><td>${grid.expected}</td></tr>

    </table>
    `;

    new bootstrap.Modal(document.getElementById("modalGrid")).show();

}

/*==========================================================*/

function updateDashboard(){

    const grids=machines[0].grids;

    const completed=grids.filter(x=>x.status===GridStatus.COMPLETED).length;
    const processing=grids.filter(x=>x.status===GridStatus.PROCESSING).length;
    const standby=grids.filter(x=>x.status===GridStatus.STANDBY).length;

    setValue("lblCompleted",completed);
    setValue("lblProcessing",processing);
    setValue("lblStandby",standby);
    setValue("lblEfficiency",machines[0].efficiency+"%");

    const percent=Math.round(completed/grids.length*100);

    const bar=document.getElementById("productionProgress");

    if(bar){

        bar.style.width=percent+"%";
        bar.innerHTML=percent+"%";

    }

}

/*==========================================================*/

function initializeChart(){

    const canvas=document.getElementById("productionChart");

    if(!canvas) return;

    productionChart=new Chart(canvas,{

        type:"line",

        data:{

            labels:["08","09","10","11","12","13"],

            datasets:[{

                label:"Production",

                data:[420,515,640,690,720,760],

                fill:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/*==========================================================*/

function bindControls(){

    document.getElementById("btnRefresh")?.addEventListener("click",()=>{

        renderGrid();

        updateDashboard();

        toast("Dashboard refreshed.");

    });

    document.getElementById("btnStart")?.addEventListener("click",()=>toast("Production started."));
    document.getElementById("btnPause")?.addEventListener("click",()=>toast("Production paused."));
    document.getElementById("btnComplete")?.addEventListener("click",()=>toast("Batch completed."));

}

function setValue(id,val){

    const e=document.getElementById(id);

    if(e) e.innerHTML=val;

}

function toast(msg){

    const t=document.createElement("div");

    t.className="alert alert-primary position-fixed";

    t.style.top="20px";
    t.style.right="20px";
    t.style.zIndex="9999";

    t.innerHTML=msg;

    document.body.appendChild(t);

    setTimeout(()=>t.remove(),2200);

}


/*==========================================================
 FrostFlow Production Module
 production.js - PART B
 Append after Part A
==========================================================*/

/*==========================================================
 AI ENGINE
==========================================================*/

function updateAIRecommendation(){

    const ai=document.getElementById("txtAIRecommendation");
    if(!ai) return;

    const grids=machines[0].grids;

    const completed=grids.filter(g=>g.status===GridStatus.COMPLETED).length;
    const processing=grids.filter(g=>g.status===GridStatus.PROCESSING).length;
    const standby=grids.filter(g=>g.status===GridStatus.STANDBY).length;

    if(completed>=60){

        ai.innerHTML=
        "<strong>Excellent.</strong> Production is ahead of schedule. Prepare inventory transfer to cold storage and assign the next production batch.";

    }else if(completed>=30){

        ai.innerHTML=
        "Production is progressing normally. Current utilization is within the target range.";

    }else{

        ai.innerHTML=
        "Production output is below the expected level. Consider increasing machine utilization or checking for production delays.";

    }

}

/*==========================================================
 PRODUCTION SIMULATION
==========================================================*/

function startSimulation(){

    setInterval(()=>{

        simulateProductionStep();

    },4000);

}

function simulateProductionStep(){

    const machine=machines[0];

    // Processing -> Completed
    const processing=machine.grids.filter(g=>g.status===GridStatus.PROCESSING);

    if(processing.length){

        const random=processing[Math.floor(Math.random()*processing.length)];

        random.status=GridStatus.COMPLETED;

    }

    // Standby -> Processing
    const standby=machine.grids.filter(g=>g.status===GridStatus.STANDBY);

    if(standby.length){

        const random=standby[Math.floor(Math.random()*standby.length)];

        random.status=GridStatus.PROCESSING;

    }

    renderGrid();

    updateDashboard();

    updateAIRecommendation();

    updateProductionChart();

}

/*==========================================================
 CHART UPDATE
==========================================================*/

function updateProductionChart(){

    if(!productionChart) return;

    const last=productionChart.data.datasets[0].data;

    const next=last[last.length-1]+Math.floor(Math.random()*30);

    last.shift();

    last.push(next);

    productionChart.update();

}

/*==========================================================
 MACHINE EFFICIENCY
==========================================================*/

function calculateEfficiency(){

    const machine=machines[0];

    const complete=machine.grids.filter(g=>g.status===GridStatus.COMPLETED).length;

    machine.efficiency=Math.min(
        100,
        Math.round((complete/machine.grids.length)*100)
    );

    setValue("lblEfficiency",machine.efficiency+"%");

}

/*==========================================================
 COMPLETE BATCH
==========================================================*/

function completeBatch(){

    machines[0].grids.forEach(g=>{

        g.status=GridStatus.COMPLETED;

    });

    renderGrid();

    updateDashboard();

    calculateEfficiency();

    updateAIRecommendation();

    toast("Batch successfully completed.");

}

/*==========================================================
 MACHINE SWITCH
==========================================================*/

document.getElementById("cmbMachine")?.addEventListener("change",()=>{

    toast("Loading machine data...");

    renderGrid();

    updateDashboard();

    updateAIRecommendation();

});

/*==========================================================
 FACTORY SWITCH
==========================================================*/

document.getElementById("cmbFactory")?.addEventListener("change",()=>{

    toast("Factory changed.");

});

/*==========================================================
 BUTTON OVERRIDES
==========================================================*/

document.getElementById("btnComplete")?.addEventListener("click",()=>{

    completeBatch();

});

document.getElementById("btnStart")?.addEventListener("click",()=>{

    toast("Production simulation started.");

    startSimulation();

});

document.getElementById("btnPause")?.addEventListener("click",()=>{

    toast("Simulation paused (demo placeholder).");

});

/*==========================================================
 INVENTORY HANDOFF (Simulation)
==========================================================*/

function transferToInventory(){

    toast("Completed batch transferred to Inventory module.");

}

function saveGridStatus(){

    const status =
        document.getElementById("gridStatus").value;

    currentGrid.classList.remove(
        "grid-processing",
        "grid-complete",
        "grid-error",
        "grid-standby"
    );

    switch(status){

        case "Processing":
            currentGrid.classList.add("grid-processing");
            break;

        case "Completed":
            currentGrid.classList.add("grid-complete");
            break;

        case "Error":
            currentGrid.classList.add("grid-error");
            break;

        default:
            currentGrid.classList.add("grid-standby");

    }

}

/*==========================================================
 PERIODIC INVENTORY CHECK
==========================================================*/

setInterval(()=>{

    const complete=machines[0].grids.filter(g=>g.status===GridStatus.COMPLETED).length;

    if(complete===80){

        transferToInventory();

    }

},6000);

/*==========================================================
 INITIALIZE
==========================================================*/

calculateEfficiency();

updateAIRecommendation();

startSimulation();

