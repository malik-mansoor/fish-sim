import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import React from "react";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
