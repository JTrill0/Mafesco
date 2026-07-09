
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
