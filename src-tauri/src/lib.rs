use std::{
    fs::File,
    io::{BufRead, BufReader, BufWriter},
};

use tail::BackwardsReader;

#[tauri::command]
#[specta::specta]
fn read_file(path: String, tail_lines: Option<u32>) -> Result<Vec<String>, String> {
    if path.starts_with("http") {
        return fetch_http_lines(&path);
    }
    match tail_lines {
        Some(n) => backwardsreader_last_lines(&path, n as usize).map_err(|e| e.to_string()),
        None => read_all_lines(&path).map_err(|e| e.to_string()),
    }
}

fn fetch_http_lines(url: &str) -> Result<Vec<String>, String> {
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;
    let body = response.text().map_err(|e| e.to_string())?;
    Ok(body.lines().map(|s| s.to_string()).collect())
}

fn read_all_lines(path: &str) -> std::io::Result<Vec<String>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    reader.lines().collect::<Result<Vec<_>, _>>()
}

fn backwardsreader_last_lines(path: &str, num_lines: usize) -> std::io::Result<Vec<String>> {
    let file = File::open(path)?;
    let mut reader = BufReader::new(file);
    let mut backwards = BackwardsReader::new(num_lines, &mut reader);

    let mut buffer = BufWriter::new(Vec::new());
    backwards.read_all(&mut buffer);

    let content = String::from_utf8_lossy(&buffer.get_ref());
    Ok(content.lines().map(|s| s.to_string()).collect())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new()
        .commands(tauri_specta::collect_commands![read_file,]);
    #[cfg(debug_assertions)]
    builder
        .export(
            specta_typescript::Typescript::default(),
            "../src/bindings.ts",
        )
        .expect("Failed to export typescript bindings");
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(builder.invoke_handler())
        .on_window_event(|_, event| match event {
            tauri::WindowEvent::Resized(_) => {
                std::thread::sleep(std::time::Duration::from_millis(2));
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/*
### Annotations:
#[tauri::command]
#[specta::specta]
fn hello_world() -> () {}
*/
