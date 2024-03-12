const { primary } = useAppSelector((state) => state.configuration.settings.colorScheme);

const location = useLocation();
let count = location.pathname.split("/").slice(1).length - 1;

return (
  <Box sx={{ background: bgColor, padding: "24px 24px 0 24px" }} className="breadcrumbs">
    <Breadcrumbs
      sx={{
        "ol li a": {
          textDecoration: "none",
          color: gray,
        },
        "ol li a:hover": {
          color: primary,
        },
      }}
    >
      {location.pathname
        .split("/")
        .slice(1)
        ?.map((item, i) => {
          const name = item.split("-").join(" ");
          let link = "";
          const initial = location.pathname.split("/").slice(1);
          const final = initial.reverse().slice(count);
          final.reverse()?.map((str) => (link = link + `/${str}`));
          count--;
          return (
            <Link to={link} key={i}>
              <Typography
                sx={{
                  textTransform: "capitalize",
                  color: location.pathname === link || location.pathname === "/" ? primary : "",
                }}
              >
                {name}
              </Typography>
            </Link>
          );
        })}
    </Breadcrumbs>
  </Box>
);
