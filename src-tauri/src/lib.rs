use std::{
    collections::VecDeque,
    fs::{self, File},
    io::{BufRead, BufReader},
};

#[tauri::command]
#[specta::specta]
fn read_file_by_path(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
fn read_last_lines(path: String, num_lines: u32) -> Result<Vec<String>, String> {
    bufreader_last_lines(&path, num_lines as usize).map_err(|e| e.to_string())
}

fn bufreader_last_lines(path: &str, num_lines: usize) -> std::io::Result<Vec<String>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let mut lines = VecDeque::with_capacity(num_lines);

    for line in reader.lines() {
        let line = line?;
        if lines.len() == num_lines {
            lines.pop_front();
        }
        lines.push_back(line);
    }

    Ok(lines.into_iter().collect())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        tauri_specta::Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![
            read_file_by_path,
            read_last_lines
        ]);
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
