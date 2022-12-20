import { makeStyles } from "@mui/material/styles";

export const tableStyles = makeStyles(() => ({
  cell: {
    fontSize: "1rem",
    overflow: "hidden",
    padding: "0.5rem 0.5rem 0.5rem 1rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cellHeader: {
    backgroundColor: "#D1EAEE",
    borderBottom: "2px solid #2a1b3d",
    fontSize: "1rem",
    fontWeight: "bold",
    paddingBottom: "0.3rem",
    paddingTop: " 0.3rem",
    textTransform: "uppercase",
  },
  darkRow: {
    background: "#eeeeee",
  },
  grayHeader: {
    backgroundColor: "#bbbbbb",
    borderBottom: "thin solid black",
    color: "black",
  },
  largeCell: {
    width: "33rem",
  },
  lightRow: {
    background: "#ffffff",
  },
  mediumCell: {
    width: "20rem",
  },
  selected: {
    background: "#2a1b3d",
  },
  tableContainer: {
    border: "1px solid lightgrey",
    height: "100%",
    marginBottom: "1rem",
    overflowX: "auto",
    overflowY: "auto",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#2a1b3d",
    },
  },
}));
