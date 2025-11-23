import { createTheme, ThemeOptions } from "@mui/material/styles";

let ThemeProps: ThemeOptions = {
  palette: {
    primary: {
      main: "#309F33",
    },
    secondary: {
      main: "#309F33",
    }
  }
};

let commonTheme = createTheme(ThemeProps);

export default commonTheme;
