import { Box, Divider, dividerClasses, Drawer, drawerClasses, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AccountCard from "./AccountCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
  
const drawerWidth = 300;
  
const wrapperStyle = {
    width: drawerWidth,
    flexShrink: 0,
  
    [`& .${drawerClasses.paper}`]: {
      width: drawerWidth,
      backgroundColor: "#061e40",
      color: "white",
      boxSizing: "border-box",
  
      svg: {
        color: "white",
      },
    },
  
    [`& .${dividerClasses.root}`]: {
      borderColor: "white",
    },
};
  
const imageWrapperStyle = {
    width: "120px",
    height: "34px",
    margin: "8px 0 16px",
  
    img: {
      width: "100%",
      height: "100%",
    },
};
  
const containerStyle = {
    padding: "20px 20px 12px",
};
  
const listItemStyle = {
    height: "58px",
    padding: "0 16px",
};
  
const listItemTextStyle = {
    margin: 0,
  
    span: {
      fontSize: "14px",
    },
};
  
const list = [
    {
      icon: <DynamicFeedIcon />,
      label: "Blockchain",
      section: "blockChain",
    },
    {
      icon: <ArrowCircleUpIcon/>,
      label: "Send",
      section: "send",
    },
    {
      icon: <HowToRegIcon/>,
      label: "Validators",
      section: "validators",
    },
    {
      icon: <CurrencyExchangeIcon/>,
      label: "System Hack",
      section: "systemHack",
    },
    {
      icon: <DashboardIcon/>,
      label: "Dashboard",
      section: "main",
    },
    {
      icon: <BusinessCenterIcon/>,
      label: "Transactions",
      section: "transactions",
    },
];
  
export default function DashboardSidebar() {
  const {handleClearWallet} = useContext(MainContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(
    location.pathname.split("/").pop(),
  );

  const handleClickListItem = section => {
    const urlSegments = location.pathname.split("/");
    const lastSegment = urlSegments.pop();

    if (lastSegment === section) {
      return;
    }

    setCurrentSection(section);
    urlSegments.push(section);
    navigate(urlSegments.join("/"));
  };

  const handleLogout = () => {
    handleClearWallet();
  }

  return (
      <Drawer sx={wrapperStyle} variant="permanent" anchor="left">

        <Box sx={containerStyle}>
          <Box sx={imageWrapperStyle}>
            <img src="/images/home/logo-mew.svg" />
          </Box>
          <AccountCard />
        </Box>

        <List>
          {list.map(item => (
            <ListItemButton
              onClick={() => handleClickListItem(item.section)}
              selected={currentSection === item.section}
              sx={listItemStyle}
              key={item.label}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText sx={listItemTextStyle} primary={item.label} />
            </ListItemButton>
            
          ))}
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={handleLogout} sx={listItemStyle}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText sx={listItemTextStyle} primary="Logout" />
          </ListItemButton>
        </List>
        
      </Drawer>
  );
}