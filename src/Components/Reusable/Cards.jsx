import React from "react";
import { Card, CardActionArea, CardContent, Typography, Badge, Stack, useMediaQuery, Box } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cards = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");

  return (
    <Card className="parentSidebar__card slide-in-top" sx={{ transition: ".25s ease-in-out" }}>
      <CardActionArea
        onClick={() => navigate(`${data.path}`)}
        sx={{
          height: "100%",
          ".MuiCardActionArea-focusHighlight": {
            background: "transparent",
          },
        }}
      >
        <CardContent className="parentSidebar__content">
          <Stack gap={3}>
            {!isSmallScreen && (
              <Stack className="parentSidebar__icon">
                <Badge color="error" badgeContent={data?.notification}>
                  {data.icon}
                </Badge>
              </Stack>
            )}
            <Stack flexDirection={isSmallScreen ? "row" : "column"} gap={isSmallScreen ? 2 : 0.4}>
              {isSmallScreen && <Stack className="parentSidebar__icon">{data.icon}</Stack>}
              <Stack>
                <Typography component="div" fontWeight="bold" color="secondary">
                  {data.label}
                </Typography>
                {isSmallScreen && (
                  <Typography variant="span" color="text.secondary" fontSize="12px">
                    {data.description}
                  </Typography>
                )}
              </Stack>
              {!isSmallScreen && (
                <Typography variant="body2" color="text.secondary" fontSize="12px">
                  {data.description}
                </Typography>
              )}
            </Stack>
          </Stack>
          {!isSmallScreen && (
            <Box
              sx={{
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "secondary.main",
                color: "white",
                ":hover": {
                  backgroundColor: "secondary.dark",
                },
              }}
            >
              <ArrowForward />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Cards;
