import "./styles/global.css";
import "./lib/dayjs";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";

export function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Header />
          <SummaryTable />
        </div>
      </div>
    </>
  );
}
