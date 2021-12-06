const balanceEl =document.querySelector(".balance .value");
const incomeTotalEl=document.querySelector(".income-total");
const outcomeTotalEl=document.querySelector(".outcome-total");
const expenseBtn=document.querySelector(".tab1");
const incomeBtn=document.querySelector(".tab2");
const allBtn=document.querySelector(".tab3");
const expenseEl=document.querySelector("#expense");
const incomeEl=document.querySelector("#income");
const allEl=document.querySelector("#all");
const incomeList=document.querySelector("#income .list");
const expenseList=document.querySelector("#expense .list");
const allList=document.querySelector("#all .list");
const addIncome=document.querySelector(".add-income");
const addExpense=document.querySelector(".add-expense");
const incomeTitle=document.querySelector("#income-title-input");
const incomeAmount=document.querySelector("#income-amount-input");
const expenseTitle=document.querySelector("#expense-title-input");
const expenseAmount=document.querySelector("#expense-amount-input");
// VARIABLES
let ENTRY_LIST, income =0, outcome=0, balance=0;
//check loaded data
ENTRY_LIST=JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();
// event listners
expenseBtn.addEventListener('click', function(){
    active(expenseBtn);
    inactive([incomeBtn,allBtn]);
    show(expenseEl);
    hide([incomeEl,allEl]);
})
incomeBtn.addEventListener('click', function(){
    active(incomeBtn);
    inactive([expenseBtn,allBtn]);
    show(incomeEl);
    hide([expenseEl,allEl]);
})
allBtn.addEventListener('click', function(){
    active(allBtn);
    inactive([expenseBtn,incomeBtn]);
    show(allEl);
    hide([expenseEl,incomeEl]);
})
addIncome.addEventListener("click",function(){
    if (!incomeTitle.value || !incomeAmount.value) return;
    let income = {
        type: "income",
        title: incomeTitle.value,
        amount: parseFloat(incomeAmount.value),
    }
    ENTRY_LIST.push(income);
    updateUI();
    clearInput([incomeTitle,incomeAmount]);
})
addExpense.addEventListener("click",function(){
   if (!expenseTitle.value || !expenseAmount.value) return;
   let expense = {
       type: "expense",
       title: expenseTitle.value,
       amount: parseFloat(expenseAmount.value),
   }
   ENTRY_LIST.push(expense);
   updateUI();
   clearInput([expenseTitle,expenseAmount]);
})   
incomeList.addEventListener('click',deleteOrEdit);
expenseList.addEventListener('click',deleteOrEdit);
allList.addEventListener('click',deleteOrEdit);
/* functions */
function deleteOrEdit(event){
    const targetBtn=event.target;
    const entry=targetBtn.parentNode;
    if (targetBtn.id=="delete"){
        deleteEntry(entry);
    }
    else if (targetBtn.id=="edit"){
        editEntry(entry);
    }
}
function deleteEntry(entry){
    ENTRY_LIST.splice(entry.id,1);
    updateUI();
}
function editEntry(entry){
  let ENTRY =ENTRY_LIST[entry.id];
  if (ENTRY.type=="income"){
      incomeAmount.value=ENTRY.amount;
      incomeTitle.value=ENTRY.title;
  }
  else if (ENTRY.type=="expense"){
    expenseAmount.value=ENTRY.amount;
    expenseTitle.value=ENTRY.title;
  }
  deleteEntry(entry);
}
function updateUI(){
    income=calculateTotal("income",ENTRY_LIST);
    outcome=calculateTotal("expense",ENTRY_LIST);
    balance =income-outcome;
    incomeTotalEl.innerHTML=`<small>$</small>${income}`;
    outcomeTotalEl.innerHTML=`<small>$</small>${outcome}`;
    if (balance<0){
        balanceEl.innerHTML=`<small>-$</small>${Math.abs(balance)}`;
    }
    else {
        balanceEl.innerHTML=`<small>$</small>${Math.abs(balance)}`;
    }
    clearElement([incomeList,expenseList,allList]);
    ENTRY_LIST.forEach((entry,index) => {
       if (entry.type=="income"){
           showEntry(incomeList,entry.type,entry.title,entry.amount,index);
       }
       else if (entry.type=="expense"){
        showEntry(expenseList,entry.type,entry.title,entry.amount,index);
       }
       showEntry(allList,entry.type,entry.title,entry.amount,index);
    });
    updateChart(income,outcome);
    localStorage.setItem("entry_list",JSON.stringify(ENTRY_LIST));
}
function showEntry(list,type,title,amount,id){
    const entry=`<li id="${id}" class="${type}">
                            <div class="entry">${title}: $ ${amount} </div>
                            <div id="edit"></div>
                            <div id="delete"></div>
                </li>`;
    const position="afterbegin";
    list.insertAdjacentHTML(position,entry);
}
function clearElement(elements){
    elements.forEach(element=> {
        element.innerHTML="";
    });
}
function calculateTotal(type,LIST){
    let total=0;
    LIST.forEach(element => {
        if (element.type==type){
            total+=element.amount;
        }    
    });
    return total;
} 
function clearInput(elements){
    elements.forEach(element => {
        element.value="";
    });
}
function active(element){
    element.classList.add("active");
}
function inactive(elements){
    elements[0].classList.remove("active");
    elements[1].classList.remove("active");
}
function show(element){
    element.classList.remove("hide");
}
function hide(elements){
    elements[0].classList.add("hide");
    elements[1].classList.add("hide");
} 


 
