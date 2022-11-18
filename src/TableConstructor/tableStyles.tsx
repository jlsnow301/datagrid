import { makeStyles } from "@mui/material/styles";

export const tableStyles = makeStyles(() => ({
  cellHeader: {
    backgroundColor: "violet",
    borderBottom: "2px solid " + "violet",
    fontSize: "1rem",
    fontWeight: "bold",
    paddingTop: " 0.3rem",
    paddingBottom: "0.3rem",
    textAlign: "right",
    textTransform: "uppercase",
  },
  grayHeader: {
    backgroundColor: "#bbbbbb",
    borderBottom: "thin solid black",
    color: "black",
  },
  cell: {
    fontSize: "1rem",
    overflow: "hidden",
    padding: "0.5rem 0.5rem 0.5rem 1rem",
    textOverflow: "ellipsis",
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  lightRow: {
    background: "#ffffff",
  },
  darkRow: {
    background: "#eeeeee",
  },
  selected: {
    background: "pink",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "pink",
    },
  },
  tableContainer: {
    border: "1px solid lightgrey",
    marginBottom: "1rem",
    height: "100%",
    overflowY: "auto",
    overflowX: "auto",
  },
}));
