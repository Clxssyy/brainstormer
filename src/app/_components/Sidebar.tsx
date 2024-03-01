"use client";

import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
import SidebarDropdown from "./SidebarDropdown";
import { useState } from "react";
import { FaBrain, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <nav
      className={`${hidden ? "w-14" : "w-1/6"} custom-scroll flex flex-col place-items-center overflow-x-hidden  overflow-y-scroll text-nowrap bg-neutral-900 text-white shadow-lg`}
    >
      <div
        className={`${hidden ? "" : "w-full justify-between"} flex p-2 pr-0`}
      >
        {hidden ? (
          <button onClick={() => setHidden(!hidden)}>
            <TbArrowBarRight className="h-6 w-6" />
          </button>
        ) : (
          <>
            <h1 className="text-2xl font-bold">For You</h1>
            <button onClick={() => setHidden(!hidden)}>
              <TbArrowBarLeft className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {hidden ? (
        <div className="flex flex-col gap-2 p-2 pr-0">
          <FaBrain className="h-6 w-6" />
        </div>
      ) : (
        <SidebarDropdown title="Brainstorms"></SidebarDropdown>
      )}
      {hidden ? (
        <div className="flex flex-col gap-2 p-2 pr-0">
          <FaUser className="h-6 w-6" />
        </div>
      ) : (
        <SidebarDropdown title="Following"></SidebarDropdown>
      )}
    </nav>
  );
};

export default Sidebar;
