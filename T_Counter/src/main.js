const { invoke } = window.__TAURI__.tauri;

async function enter_score_card(){
  invoke('create_card',).then((res) => console.log(`name: ${res.name}, list: ${res.player_list} `)).catch((e) => console.error(e));
  location.replace("card_screen.html");
  
}

async function test_mutex(){
  invoke('test_display')
    .then((res) => console.log(`${res}`)).catch((e) => console.error(e));
  }

window.addEventListener("DOMContentLoaded", () => {

  document
    //test
    .querySelector("#newCard-button")
    .addEventListener("click", () => enter_score_card());

  //test to see contents of the score card struct state 
  document
    .querySelector("#testMutex-button")
    .addEventListener("click", () => test_mutex());

});
