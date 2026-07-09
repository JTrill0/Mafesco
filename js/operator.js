/*=========================================================
 FrostFlow Operator Terminal
 operator.js - Part A
=========================================================*/

let selectedGrid = null;
let gridModal = null;

document.addEventListener("DOMContentLoaded", () => {

    initializeOperator();

});

function initializeOperator(){

    gridModal = new bootstrap.Modal(
        document.getElementById("gridModal")
    );

    bindEvents();

    generateGrid();

}

function bindEvents(){

    document.getElementById("btnSaveGrid")
        ?.addEventListener("click", saveGridStatus);

    document.getElementById("btnDaily")
        ?.addEventListener("click", generateDailyReport);

    document.getElementById("btnWeekly")
        ?.addEventListener("click", generateWeeklyReport);

    document.getElementById("btnMonthly")
        ?.addEventListener("click", generateMonthlyReport);

}

function generateGrid(){

    const container =
        document.getElementById("gridContainer");

    if(!container) return;

    container.innerHTML = "";

    const rows = 4;
    const cols = 20;

    for(let row=0; row<rows; row++){

        for(let col=0; col<cols; col++){

            const number = (col * rows) + row + 1;

            const grid = document.createElement("div");

            grid.className =
                "grid-box grid-standby";

            grid.dataset.grid = number;

            grid.dataset.status = "Standby";

            grid.innerHTML = number;

            grid.addEventListener("click",function(){

                openGrid(grid);

            });

            container.appendChild(grid);

        }

    }

}

function openGrid(grid){

    selectedGrid = grid;

    document.getElementById("gridNumber").value =
        grid.dataset.grid;

    document.getElementById("gridStatus").value =
        grid.dataset.status;

    document.getElementById("gridRemarks").value = "";

    gridModal.show();

}

/*=========================================================
 FrostFlow Operator Terminal
 operator.js - Part B
=========================================================*/

/*=========================================================
 SAVE GRID STATUS
=========================================================*/

function saveGridStatus(){

    if(selectedGrid == null) return;

    const status =
        document.getElementById("gridStatus").value;

    const remarks =
        document.getElementById("gridRemarks").value;

    selectedGrid.dataset.status = status;

    updateGridColor(selectedGrid, status);

    addActivityLog(
        selectedGrid.dataset.grid,
        status,
        remarks
    );

    updateKPIs();

    gridModal.hide();

}

/*=========================================================
 UPDATE GRID COLOR
=========================================================*/

function updateGridColor(grid, status){

    grid.classList.remove(
        "grid-standby",
        "grid-processing",
        "grid-complete",
        "grid-error"
    );

    switch(status){

        case "Standby":

            grid.classList.add("grid-standby");

        break;

        case "Processing":

            grid.classList.add("grid-processing");

        break;

        case "Completed":

            grid.classList.add("grid-complete");

        break;

        case "Error":

            grid.classList.add("grid-error");

        break;

    }

}

/*=========================================================
 UPDATE KPI COUNTERS
=========================================================*/

function updateKPIs(){

    const grids =
        document.querySelectorAll(".grid-box");

    let standby = 0;
    let processing = 0;
    let completed = 0;
    let error = 0;

    grids.forEach(grid=>{

        switch(grid.dataset.status){

            case "Standby":

                standby++;

            break;

            case "Processing":

                processing++;

            break;

            case "Completed":

                completed++;

            break;

            case "Error":

                error++;

            break;

        }

    });

    document.getElementById("lblStandby").innerHTML =
        standby;

    document.getElementById("lblProcessing").innerHTML =
        processing;

    document.getElementById("lblCompleted").innerHTML =
        completed;

    document.getElementById("lblError").innerHTML =
        error;

}

/*=========================================================
 ADD ACTIVITY LOG
=========================================================*/

function addActivityLog(grid,status,remarks){

    const table =
        document.getElementById("activityTable");

    if(!table) return;

    const row =
        table.insertRow(0);

    const time =
        new Date().toLocaleTimeString();

    row.innerHTML = `

    <tr>

        <td>${time}</td>

        <td>${grid}</td>

        <td>

            <span class="badge ${badgeColor(status)}">

                ${status}

            </span>

        </td>

        <td>${remarks || "-"}</td>

    </tr>

    `;

}

/*=========================================================
 BADGE COLOR
=========================================================*/

function badgeColor(status){

    switch(status){

        case "Completed":

            return "bg-primary";

        case "Processing":

            return "bg-warning text-dark";

        case "Error":

            return "bg-danger";

        default:

            return "bg-secondary";

    }

}

/*=========================================================
 FrostFlow Operator Terminal
 operator.js - Part C
=========================================================*/

/*=========================================================
 DAILY REPORT
=========================================================*/

function generateDailyReport(){

    alert(
        "Daily Production Report\n\n" +
        "This feature will generate today's production report."
    );

}

/*=========================================================
 WEEKLY REPORT
=========================================================*/

function generateWeeklyReport(){

    alert(
        "Weekly Production Report\n\n" +
        "This feature will generate this week's production report."
    );

}

/*=========================================================
 MONTHLY REPORT
=========================================================*/

function generateMonthlyReport(){

    alert(
        "Monthly Production Report\n\n" +
        "This feature will generate this month's production report."
    );

}

/*=========================================================
 RESET ALL GRIDS
=========================================================*/

function resetProduction(){

    if(!confirm("Reset all production grids?"))
        return;

    document.querySelectorAll(".grid-box").forEach(grid=>{

        grid.dataset.status="Standby";

        grid.className="grid-box grid-standby";

    });

    document.getElementById("activityTable").innerHTML="";

    updateKPIs();

    alert("Production grid has been reset.");

}

/*=========================================================
 EXPORT REPORT
=========================================================*/

function exportProductionReport(){

    alert(
        "Export to Excel/PDF will be available in the next version."
    );

}

/*=========================================================
 PRINT REPORT
=========================================================*/

function printProductionReport(){

    window.print();

}

/*=========================================================
 DASHBOARD SYNCHRONIZATION
=========================================================*/

function syncDashboard(){

    console.log(
        "Synchronizing production statistics with Supervisor Dashboard..."
    );

}

/*=========================================================
 INVENTORY SYNCHRONIZATION
=========================================================*/

function syncInventory(){

    console.log(
        "Updating inventory based on completed production..."
    );

}

/*=========================================================
 AI ANALYTICS SYNCHRONIZATION
=========================================================*/

function syncAnalytics(){

    console.log(
        "Sending production data to AI Analytics..."
    );

}

/*=========================================================
 FUTURE AI HOOKS
=========================================================*/

function predictMachineFailure(){

    console.log(
        "AI Predictive Maintenance Module"
    );

}

function analyzeOperatorPerformance(){

    console.log(
        "AI Operator Performance Analysis"
    );

}

function forecastProductionDemand(){

    console.log(
        "AI Production Forecast"
    );

}

/*=========================================================
 INITIALIZE FUTURE MODULES
=========================================================*/

function initializeFutureModules(){

    syncDashboard();

    syncInventory();

    syncAnalytics();

}

initializeFutureModules();

