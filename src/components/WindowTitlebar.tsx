import { platform } from "@tauri-apps/plugin-os";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { isTauriApp } from "../util";

export default function WindowTitlebar() {
  if (!isTauriApp()) {
    return null;
  }
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const appWindow = getCurrentWindow();
  const platformName = platform();

  useEffect(() => {
    if (!appWindow || !platformName) return;

    const updateMaximizedState = async () => {
      const maximized =
        platformName === "macos"
          ? await appWindow.isFullscreen()
          : await appWindow.isMaximized();
      setIsMaximized(maximized);
    };

    const debouncedUpdateMaximizedState = debounce(updateMaximizedState, 100); // 100ms debounce

    const unlisten = appWindow.onResized(() => {
      debouncedUpdateMaximizedState();
    });

    // Initial check
    updateMaximizedState();

    return () => {
      unlisten.then((unlistenFn) => unlistenFn());
      debouncedUpdateMaximizedState.cancel();
    };
  }, []);

  return (
    <>
      {platformName === "windows" && (
        <div
          className={
            isMaximized
              ? "relative w-full h-[25px]"
              : "relative w-full h-[32px]"
          }
        >
          <div className="w-full h-full *:my-auto flex flex-row justify-between">
            <div className="relative flex flex-row flex-grow *:my-auto h-full">
              <div
                data-tauri-drag-region
                className="absolute w-full h-full"
              ></div>
            </div>
            <div className="flex flex-row w-max h-full *:h-full *:transition-colors *:duration-200">
              <button
                onClick={() => {
                  appWindow.minimize();
                }}
                className="hover:bg-neutral-500/25 h-full"
              >
                <img
                  className="dark:invert"
                  src="/windows-minimize.svg"
                  alt="minimize"
                />
              </button>
              <button
                onClick={() => {
                  appWindow.toggleMaximize();
                }}
                className="hover:bg-neutral-500/25 h-full"
              >
                <img
                  className="dark:invert"
                  src={
                    isMaximized
                      ? "/windows-restore-maximize.svg"
                      : "/windows-maximize.svg"
                  }
                  alt="maximize/restore"
                />
              </button>
              <button
                onClick={() => {
                  appWindow.close();
                }}
                className="hover:bg-[#C42B1C] h-full group"
              >
                <img
                  className="dark:invert group-hover:invert"
                  src="/windows-close.svg"
                  alt="close"
                />
              </button>
            </div>
          </div>
        </div>
      )}
      {platformName === "macos" && !isMaximized && (
        <div data-tauri-drag-region className="relative w-full h-[32px]"></div>
      )}
    </>
  );
}
