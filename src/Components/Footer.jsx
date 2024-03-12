import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import "../Style/footer.scss";
import { SignalWifiOff, SignalWifiStatusbar4Bar } from "@mui/icons-material";

const Footer = () => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
  }, []);

  return (
    <Box className="footer">
      <p className="footer__label">Status:</p>
      {online ? (
        <Typography
          className="footer__status"
          color="primary"
          sx={{ fontSize: "14px" }}>
          <SignalWifiStatusbar4Bar sx={{ fontSize: "18px" }} color="primary" />
          ONLINE
        </Typography>
      ) : (
        <Typography
          className="footer__status"
          color="secondary"
          sx={{ fontSize: "14px" }}>
          <SignalWifiOff sx={{ fontSize: "18px" }} color="secondary" /> OFFLINE
        </Typography>
      )}
    </Box>
  );
};

export default Footer;
