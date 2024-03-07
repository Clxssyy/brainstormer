interface SidebarDropdownProps {
  title: string;
  children?: JSX.Element[];
}

const SidebarDropdown = ({ title, children }: SidebarDropdownProps) => {
  return (
    <div className="flex w-full flex-col">
      <h3 className="px-2 text-lg font-semibold">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default SidebarDropdown;
