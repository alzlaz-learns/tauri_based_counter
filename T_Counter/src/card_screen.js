
const { invoke } = window.__TAURI__.tauri;

let addPlayerMessage;

let getPlayerName;




/*
  TODO:
   add remove function to remove parent div from screen and to remove counter struct from score card struct based on posID. -done
   add function to handle incrementing and decrementing a counter struct that exists based on divs hidden posID.
   remove test functions
   check for unwanted behaviors.
   add documentation
   beautify things:
    counter divs (card_screen.css)
*/

async function add_player() {
  /*
  TODO:
    look into window.localStorage to handle positional arguements
    connect display value to struct content.
    connect extract input function to replace getPlayerName.value to have a generic "player" name instead of an empty string.
  */
    let size = await invoke("add_player", {name: getPlayerName.value});
    
   //dynamically add div class counter
    //parent counter div
    const counterDiv = document.createElement("div");
    counterDiv.className = `counter`;
    counterDiv.id = `counter-${size-1}`;
    counterDiv.setAttribute("name", `counter-${size-1}`);

    //child hidden input 
    const inputType = document.createElement("input");
    inputType.id = `posID`;
    inputType.setAttribute("type", "hidden");
    inputType.setAttribute("name", "posID");
    inputType.setAttribute("value", `${size-1}`);
    counterDiv.appendChild(inputType);

    //child removeButton element
    const buttonRemove = document.createElement("button");
    buttonRemove.className = "removePlayer-buton";
    buttonRemove.id = `removePlayer-buton-${size-1}`;
    buttonRemove.textContent = 'x';
    counterDiv.append(buttonRemove);

    //child playerName text
    const playerName = document.createElement("h1");
    playerName.className = 'playerName';
    playerName.textContent = getPlayerName.value;
    counterDiv.appendChild(playerName);

    //child counter-display element
    const counterDisplay = document.createElement("h1");
    counterDisplay.id = `counter-display`;
    counterDisplay.textContent = await invoke("get_score", {pos:size - 1});
    counterDiv.appendChild(counterDisplay);

    //child minus button element
    const buttonMinus = document.createElement("button");
    buttonMinus.className = `minus`;
    buttonMinus.id = `minus-${size-1}`;
    buttonMinus.textContent = "-";
    counterDiv.appendChild(buttonMinus);

    //child plus button element
    const buttonPlus = document.createElement("button");
    buttonPlus.className = `plus`;
    buttonPlus.id = `plus-${size-1}`;
    buttonPlus.textContent = "+";
    counterDiv.appendChild(buttonPlus);

    //add all counter children to parent div that exist on html page
    const containerDiv = document.getElementById("container");
    containerDiv.appendChild(counterDiv);
    

    //https://carlanderson.xyz/adding-event-listeners-to-dynamic-content-with-event-delegation/

    
    const removeButton =  document.querySelector(`#removePlayer-buton-${size-1}`);
    const plusButton = document.querySelector(`#plus-${size-1}`);
    const minusButton = document.querySelector(`#minus-${size-1}`);
    //https://medium.com/@bigcatplichta/javascript-use-bind-to-dynamically-add-and-remove-event-listeners-d6b443877a73
    class removePlayerClass {
      constructor(arg) {
        this.boundEventHandler = this.eventHandler.bind(this, arg)
        removeButton.addEventListener('click', this.boundEventHandler);
      }
      eventHandler(arg) {
        remove_player(arg);
        }
      removeListener() {
          button.removeEventListener('click', this.boundEventHandler);
        }
    }

    
    class plusScoreClass {
      constructor(arg) {
        this.boundEventHandler = this.eventHandler.bind(this, arg)
        plusButton.addEventListener('click', this.boundEventHandler);
      }
      eventHandler(arg) {
        plus(arg);
      }
      removeListener() {
        //considering adding this to removeButton class maybe
        plusButton.removeEventListener('click', this.boundEventHandler);
      }
    }

    class minuScoreClass {
      constructor(arg) {
        this.boundEventHandler = this.eventHandler.bind(this, arg)
        minusButton.addEventListener('click', this.boundEventHandler);
      }
      eventHandler(arg) {
        minus(arg);
      }
      removeListener() {
        //considering adding this to removeButton class maybe
        minusButton.removeEventListener('click', this.boundEventHandler);
      }
    }

    new plusScoreClass(plusButton);
    new minuScoreClass(minusButton);
    let removePlayerButtonC = new removePlayerClass(removeButton);
    if (removeButton.onClick === (`#removePlayer-buton-${size-1}`)){
      removePlayerButtonC.removeEventListener;
    }
  }

  async function plus(arg){
    let posID;
    if (arg.id) {
      
      let buttonElement = document.getElementById(arg.id);
      // console.log(buttonElement.id);
      let counter = buttonElement.parentNode;
      
      posID = counter.querySelector('input[type=hidden]').value;
      await invoke("increment", {pos: Number(posID)});
      
      let cDisplay = counter.querySelector(`#counter-display`);

      cDisplay.textContent = await invoke("get_score", {pos:Number(posID)});
    }
  }
  async function minus(arg){
    let posID;
    if (arg.id) {
      
      let buttonElement = document.getElementById(arg.id);
      let counter = buttonElement.parentNode;
      
      posID = counter.querySelector('input[type=hidden]').value;
      await invoke("decrement", {pos: Number(posID)});
      
      let cDisplay = counter.querySelector(`#counter-display`);

      cDisplay.textContent = await invoke("get_score", {pos:Number(posID)});
    }
  }


  async function remove_player(e){
    
    //https://stackoverflow.com/questions/45377605/unable-to-get-hidden-field-value-using-parent-s-class-name

    //https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button

    //dynamically remove div class counter
    let posID;
    if (e.id) {
      console.log(e.id);
      let buttonElement = document.getElementById(e.id);
      
      let counterNode = buttonElement.parentNode
      
      let containerNode = counterNode.parentNode;
      

      posID = counterNode.querySelector('input[type=hidden]').value;
      containerNode.removeChild(counterNode);
      await invoke("remove_player", {pos: Number(posID)});

      
    }
    
    const collectionOfCounters = document.getElementsByClassName("counter");
    

    for(let i = posID; i < collectionOfCounters.length; i++){
      collectionOfCounters[i].id = `counter-${i}`; //update counter id when a counter is removed.
      collectionOfCounters[i].setAttribute("name", `counter-${i}`);//<-------
      collectionOfCounters[i].children[1].id = `removePlayer-buton-${i}`; //update button id value when a counter is removed.
      collectionOfCounters[i].children[0].value = i; //update hidden input value when a counter is removed.

    }
    console.log(collectionOfCounters);
    
    
  }


async function go_main() {
    await invoke("remove_s_card", );
    location.replace("index.html");
  }

async function extract_input(){
  let res;
  if (getPlayerName.value === null|| getPlayerName.value  === ""){
    // console.log("player");
    res = "player";
  }
  else{
    console.log(getPlayerName.value);
    let res = getPlayerName.value;
  }
  return res;
}

//test function to see state of the s_card struct.
async function test_mutex(){
  invoke('test_display')
    .then((res) => console.log(`${res}`)).catch((e) => console.error(e));
  }
  

window.addEventListener("DOMContentLoaded", () => {

    //test
    addPlayerMessage = document.querySelector("#add-msg");
    getPlayerName = document.querySelector("#pName-input");

    //test for extracting data from html field
    document
      .querySelector('#addPlayer-button')
      .addEventListener("click", () => extract_input());

    
    document
      .querySelector("#addPlayer-button")
      .addEventListener("click", () => add_player());
  
    document
      .querySelector("#goMain-button")
      .addEventListener("click", () => go_main());


    //test to see contents of the score card struct state 
    document
      .querySelector("#testMutex-button")
      .addEventListener("click", () => test_mutex());

  });
  

  /*
  (possibly) useful links:
    html: 
      https://stackoverflow.com/questions/14709637/update-hidden-input-field-value-with-another-input-field-value
    javascript:
      //https://stackoverflow.com/questions/45377605/unable-to-get-hidden-field-value-using-parent-s-class-name
      //https://stackoverflow.com/questions/45377605/unable-to-get-hidden-field-value-using-parent-s-class-name
      //https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
    dom:
      https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
      event delegation:
        https://carlanderson.xyz/adding-event-listeners-to-dynamic-content-with-event-delegation/

    localstorage: 
      https://stackoverflow.com/questions/30155031/how-to-update-array-with-same-key-in-session-storage
      https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
      https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
*/