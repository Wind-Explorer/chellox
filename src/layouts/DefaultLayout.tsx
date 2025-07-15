import { Outlet } from "react-router-dom";
import WindowTitlebar from "../components/WindowTitlebar";
import { AnimatePresence } from "framer-motion";
import AnimatedRoute from "../components/AnimatedRoute";
import { Divider } from "@heroui/react";

export default function DefaultLayout() {
  return (
    <div className="relative flex flex-col justify-between">
      <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
        <div className="z-50 relative">
          <div
            data-tauri-drag-region
            className="absolute inset-0 size-full flex flex-row justify-center items-center"
          >
            <p
              data-tauri-drag-region
              className="text-xs opacity-70 font-bold cursor-default"
            >
              CHELLOX
            </p>
          </div>
          <WindowTitlebar />
        </div>
        <Divider />
        <div className="relative flex-grow min-h-full h-full max-h-full overflow-auto">
          <AnimatePresence mode="wait">
            <AnimatedRoute>
              <Outlet />
            </AnimatedRoute>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
