import React from "react";
import ReactDOM from "react-dom/client";
import ContentSlice from "./components/ContentSlice";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(<ContentSlice />);
