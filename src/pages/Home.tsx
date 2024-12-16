import React, { useState } from 'react'
import { TitleBar, SideBar, Stack, TopBar } from "CDS"
import { Outlet, useNavigate } from 'react-router-dom';

const exampleSideBar = [
  {
    id: 1,
    color: "",
    bgColor: "",
    label: "Process",
    childMenus: [
      {
        id: 1,
        onClick: () => { },
        color: "",
        bgColor: "",
        label: "Final Mixer Process",
        icon: undefined,
        hoverIcon: undefined,
        activeIcon: undefined,
        isActive: false,
      },
      {
        id: 2,
        onClick: () => { },
        color: "",
        bgColor: "",
        label: "Extruder",
        icon: undefined,
        hoverIcon: undefined,
        activeIcon: undefined,
        isActive: false,
      },
    ],
  },
];

const Home = () => {
  const [sideBarState, setSideBarState] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSideBarToggle = () => {
    setSideBarState((prev: any) => !prev);
  }

  const handleSideBarClose = () => {
    setSideBarState(false);
  }
  return (
    <React.Fragment>
      <TitleBar
        version={"MES x.0"}
        notification
        info
        settings
      />
      <div style={{ marginTop: "5vh", width: "100vw", display: 'flex', flexDirection: "row" }}>
        <Stack><SideBar onClick={handleSideBarToggle} onClose={handleSideBarClose} open={sideBarState} menus={exampleSideBar} /><TopBar open={sideBarState} /></Stack>
        <Outlet />
      </div>
    </React.Fragment>
  )
}

export default Home
