import { FaBrain, FaHeart } from "react-icons/fa";

interface SidebarDropdownProps {
  title: string;
  children?: React.ReactNode;
  hidden: boolean;
}

const SidebarDropdown = ({ title, children, hidden }: SidebarDropdownProps) => {
  return (
    <div className="flex flex-col">
      <header className="mx-4 flex h-8 place-items-center overflow-hidden">
        {
          {
            following: (
              <FaHeart className={`h-6 w-6 ${hidden ? "" : "hidden"}`} />
            ),
            brainstorms: (
              <FaBrain className={`h-6 w-6 ${hidden ? "" : "hidden"}`} />
            ),
          }[title.toLowerCase()]
        }
        <h3 className={`text-lg font-semibold ${hidden ? "hidden" : ""}`}>
          {title}
        </h3>
      </header>
      <section>{children}</section>
    </div>
  );
};

export default SidebarDropdown;
