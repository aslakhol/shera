import Dropdown from "./Dropdown";
import HomeLink from "./HomeLink";

type NavBarProps = {};

const NavBar = (props: NavBarProps) => {
  const {} = props;

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <HomeLink />
        </div>
        <div className="flex-none">
          <Dropdown />
        </div>
      </div>
    </>
  );
};

export default NavBar;
