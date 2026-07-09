/*==================================================
    FrostFlow Dashboard
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    generateProductionGrid(80);

    initializeChart();

    updateStatistics();

    startSimulation();

});

/*==================================================
    GRID SETTINGS
==================================================*/

const GRID_COUNT = 80;

const STATUS = {

    STANDBY: "standby",

    PROCESSING: "processing",

    COMPLETED: "completed",

    ERROR: "error"

};

let gridData = [];

/*==================================================
    CREATE GRID
==================================================*/

function generateProductionGrid(total){

    const container = document.getElementById("productionGrid");

    container.innerHTML = "";

    gridData = [];

    for(let i=1;i<=total;i++){

        let state;

        // Demo Distribution

        if(i<=5){

            state = STATUS.COMPLETED;

        }
        else if(i<=15){

            state = STATUS.PROCESSING;

        }
        else{

            state = STATUS.STANDBY;

        }

        gridData.push(state);

        const cell = document.createElement("div");

        cell.className = `ice-grid ${state}`;

        cell.innerHTML = i;

        cell.dataset.index = i;

        cell.onclick = ()=>showGridInformation(i);

        container.appendChild(cell);

    }

}

/*==================================================
    GRID POPUP
==================================================*/

function showGridInformation(number){

    const status = gridData[number-1];

    alert(

`Grid No : ${number}

Status : ${status}

Machine : Ice Machine 1

Batch : B-${1000+number}

Estimated Finish : 2 Hours`

);

}

/*==================================================
    UPDATE COUNTERS
==================================================*/

function updateStatistics(){

    let completed = 0;

    let processing = 0;

    let standby = 0;

    let error = 0;

    gridData.forEach(item=>{

        switch(item){

            case STATUS.COMPLETED:

                completed++;

                break;

            case STATUS.PROCESSING:

                processing++;

                break;

            case STATUS.STANDBY:

                standby++;

                break;

            case STATUS.ERROR:

                error++;

                break;

        }

    });

    const badges = document.querySelectorAll(".badge");

    if(badges.length>=3){

        badges[0].innerHTML = `Completed : ${completed}`;

        badges[1].innerHTML = `Processing : ${processing}`;

        badges[2].innerHTML = `Standby : ${standby}`;

    }

}

/*==================================================
    SIMULATION
==================================================*/

function startSimulation(){

    setInterval(()=>{

        const processing = [];

        gridData.forEach((item,index)=>{

            if(item===STATUS.PROCESSING){

                processing.push(index);

            }

        });

        if(processing.length>0){

            const selected = processing[Math.floor(Math.random()*processing.length)];

            gridData[selected]=STATUS.COMPLETED;

        }

        const standby = [];

        gridData.forEach((item,index)=>{

            if(item===STATUS.STANDBY){

                standby.push(index);

            }

        });

        if(standby.length>0){

            const selected = standby[Math.floor(Math.random()*standby.length)];

            gridData[selected]=STATUS.PROCESSING;

        }

        redrawGrid();

        updateStatistics();

    },5000);

}

/*==================================================
    REDRAW GRID
==================================================*/

function redrawGrid(){

    const grids = document.querySelectorAll(".ice-grid");

    grids.forEach((item,index)=>{

        item.className = `ice-grid ${gridData[index]}`;

    });

}

/*==================================================
    SALES CHART
==================================================*/

function initializeChart(){

    const ctx = document.getElementById("salesChart");

    if(!ctx) return;

    new Chart(ctx,{

        type:"line",

        data:{

            labels:[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets:[{

                label:"Sales",

                data:[
                    250,
                    320,
                    290,
                    400,
                    460,
                    510,
                    480
                ],

                borderColor:"#2196F3",

                backgroundColor:"rgba(33,150,243,.15)",

                fill:true,

                tension:.4

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}

/*==================================================
    FACTORY SELECTOR
==================================================*/

const factory = document.querySelector(".form-select");

if(factory){

factory.addEventListener("change",()=>{

    alert(

"Factory changed to : "

+factory.value

);

});

}

/*==================================================
    AI MESSAGE (DEMO)
==================================================*/

const messages=[

"Demand expected to increase tomorrow.",

"Machine 2 requires maintenance.",

"Tube Ice sales are trending upward.",

"Low inventory detected for Cube Ice.",

"Factory A achieved 95% efficiency."

];

setInterval(()=>{

    const ai=document.querySelector(".card p");

    if(ai){

        ai.innerHTML=

messages[Math.floor(Math.random()*messages.length)];

    }

},8000);