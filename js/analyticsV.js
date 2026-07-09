
/*==========================================================
 FrostFlow Analytics
 analytics.js - Part B
==========================================================*/

function sendPrompt(){

    const txt=document.getElementById("txtPrompt");
    const chat=document.getElementById("chatWindow");

    if(!txt||!chat) return;

    const question=txt.value.trim();
    if(question==="") return;

    chat.innerHTML+=`
    <div class="chat-user">
      <div class="bubble">${question}</div>
    </div>`;

    const answer=generateAIResponse(question);

    setTimeout(()=>{

        chat.innerHTML+=`
        <div class="chat-ai">
          <div class="bubble">${answer}</div>
        </div>`;

        chat.scrollTop=chat.scrollHeight;

    },500);

    txt.value="";

}

function generateAIResponse(q){

    q=q.toLowerCase();

    if(q.includes("produce")||q.includes("production"))
        return "Based on current trends, increase Tube Ice production by approximately 15% tomorrow.";

    if(q.includes("customer"))
        return "ABC Seafood is currently the highest-volume customer based on recent sales.";

    if(q.includes("inventory"))
        return "Inventory health remains at 95%. Plastic bags will require replenishment within three days.";

    if(q.includes("machine"))
        return "Machine B currently has the highest utilization and efficiency.";

    if(q.includes("sales"))
        return "Sales have shown a positive trend throughout the week, driven primarily by Tube Ice demand.";

    return "Based on the available operational data, no significant risks are detected. Continue monitoring production, inventory, and sales.";

}

setInterval(()=>{

    document.getElementById("lblForecast").innerHTML=
    "+"+(10+Math.floor(Math.random()*8))+"%";

    document.getElementById("lblConfidence").innerHTML=
    (95+Math.floor(Math.random()*5))+"%";

},8000);
