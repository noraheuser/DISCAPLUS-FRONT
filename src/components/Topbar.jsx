import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

const Topbar = () => {
  const { logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Trámites
        </Typography>
        <Typography variant="body1" sx={{ mr: 2 }}>
          admin
        </Typography>
        <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>A</Avatar>
        <IconButton color="inherit" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
