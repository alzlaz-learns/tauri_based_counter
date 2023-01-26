#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::sync::Mutex;
use tauri::{State};
extern crate counter_components;


use counter_components::score_card_struct::ScoreCard;

#[derive(Debug)]
struct SCard(Mutex<Option<ScoreCard>>);

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn entering(window: tauri::Window, _app_handle: tauri::AppHandle) -> String{
    format!("Entering to scorecard page from onclick: {}", window.label())
}

#[tauri::command]
fn test_display(state: State<SCard>) -> String {
    let sc = state.0.lock().unwrap();
    println!("{:?}", sc);
    format!("The struct: {:?}", sc)
}

#[tauri::command]
fn get_score(state: State<SCard>, pos:usize) -> String{
    let mut sc = state.0.lock().unwrap();
    match &mut *sc {
        Some(x) => {
            let c = x.player_list.get_mut(pos).unwrap();
            
            // println!("{:?}", c.count);
            c.count.to_string()
        },
        None => "E".to_string(),
    }
}

#[tauri::command]
fn increment(state: State<SCard>, pos:usize){
    let mut sc = state.0.lock().unwrap();
    
    match &mut *sc {
        Some(x) => {
            let c = x.player_list.get_mut(pos).unwrap();
            c.increment()
        },
        None => {},
    }
}

#[tauri::command]
fn decrement(state: State<SCard>, pos:usize){
    let mut sc = state.0.lock().unwrap();
    match &mut *sc {
        Some(x) => {
            let c = x.player_list.get_mut(pos).unwrap();
            c.decrement()
        },
        None => {},
    }
}
 

#[tauri::command]
fn add_player(state: State<SCard>, name: &str) -> usize{
    //https://stackoverflow.com/questions/62248219/rust-accessing-option-from-mutex
    let mut sc = state.0.lock().unwrap();
    
    match &mut *sc {
        Some(x) => {
            x.add(name);
            x.player_list.len()
        },
        None => 0,
    }
}

#[tauri::command]
fn remove_player(state: State<SCard>, pos:usize) -> usize {
    let mut sc = state.0.lock().unwrap();

    match &mut *sc {
        Some(x) => {
            x.remove(pos);
            x.player_list.len()
        },
        None => 0,
    }
}

#[tauri::command]
fn create_card(state:State<SCard>){
    *state.0.lock().unwrap() = Some(ScoreCard::default());
}

#[tauri::command]
fn remove_s_card(state:State<SCard>){
    *state.0.lock().unwrap() = None;
}

fn main() {
    tauri::Builder::default()
    .manage(SCard(Default::default()))
    .invoke_handler(tauri::generate_handler![
        test_display,
        entering, 
        add_player,
        remove_player,
        create_card, 
        remove_s_card,
        get_score,
        increment,
        decrement,
        ]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

}

/*
    (possibly) useful links:
        Cargo:
            https://doc.rust-lang.org/cargo/index.html
            https://readlnh.github.io/2020/09/22/Rust/local_unpublished_crate_in_Rust/ (local dependencies)
        Rust:
            https://doc.rust-lang.org/rust-by-example/index.html
            https://doc.rust-lang.org/book/
        Tauri API:
            https://docs.rs/tauri/1.2.3/tauri/
        state management:
            https://rfdonnelly.github.io/posts/tauri-async-rust-process/
            https://gist.github.com/captainhusaynpenguin/5bdb6fcb141628b6865619bcd1c827fd
            https://github.com/tauri-apps/tauri/blob/dev/examples/state/main.rs
            https://medium.com/@marm.nakamura/trying-to-the-tauri-gui-on-rust-4-state-management-on-the-rust-side-8899bda08936
            https://reactjsexample.com/tauri-demo-app-using-rust-and-react/
        Mutex:
            https://users.rust-lang.org/t/accessing-option-from-mutex/8370/3
        reference to my text_based_counter to see how working usage of structs:
            https://github.com/alzlaz-learns/text_based_counter

*/