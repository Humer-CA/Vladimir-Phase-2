import React from "react";
import { Card, CardActionArea, CardContent, Typography, IconButton, Badge, Stack, useMediaQuery } from "@mui/material";
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
          {!isSmallScreen && (
            <Badge color="error" badgeContent={data?.notification}>
              <IconButton className="parentSidebar__icon">{data.icon}</IconButton>
            </Badge>
          )}
          <Stack flexDirection="column" gap={0.2} alignItems="flex-start">
            <Stack flexDirection="row" alignItems="center" gap={2}>
              {isSmallScreen && <IconButton className="parentSidebar__icon">{data.icon}</IconButton>}
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
            </Stack>
            {!isSmallScreen && (
              <Typography variant="body2" color="text.secondary" fontSize="12px">
                {data.description}
              </Typography>
            )}
          </Stack>

          {!isSmallScreen && (
            <IconButton
              size="small"
              sx={{
                alignSelf: "flex-end",
                ":hover": {
                  backgroundColor: "secondary.main",
                  color: "white",
                },
                backgroundColor: "secondary.main",
                color: "white",
              }}
            >
              <ArrowForward />
            </IconButton>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Cards;
