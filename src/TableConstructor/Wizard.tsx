import {
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import { DynamicWizardProps, RowData } from "./types";
import { getDisplayName } from "./helpers";

/**
 * ## DynamicWizard
 * Going for best component names 2022 here.
 *
 * DynamicWizard is a templating component that takes an array of objects and
 * allows the user to select which template to apply.
 *
 * If a onSetTemplate function is provided, it will be called when the wizard is submitted.
 * The settemplate function will be passed an object with the values from the form.
 *
 * Ideally this is used in conjunction with the DynamicDialog component, which will take the object
 * and populate the form values with it.
 */
export function DynamicWizard(props: DynamicWizardProps) {
  const { onClose, onSetTemplate, templates } = props;
  const [selected, setSelected] = useState<RowData | undefined>();

  /** Selects a template from the dropdown. */
  const handleSelect: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const found = templates?.find(
      (item) => Object.values(item)[1] === event.target.value
    ) as RowData;
    if (found) {
      setSelected(found);
    }
  };

  /** Sets the content for the editor. */
  const handleSetClick = () => {
    if (!selected) {
      return;
    }
    const newItem = { ...selected };
    delete Object.keys(newItem)[0]; // Remove the ID portion.
    onSetTemplate(newItem);
  };

  return (
    <>
      <DialogContent sx={{ width: "55rem" }}>
        <TextField
          fullWidth
          id="selected"
          label="Template"
          onChange={handleSelect}
          select
          sx={{ mt: "0.5rem" }}
          value={getDisplayName(selected)}
        >
          {templates?.map((item, index) => {
            const name = getDisplayName(item);
            return (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            );
          })}
        </TextField>
        {!selected ? (
          <Typography
            color="gray"
            textAlign="center"
            variant="subtitle1"
            gutterBottom
          >
            Select a template to view its values.
          </Typography>
        ) : (
          <TemplateInfo {...{ selected }} />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
        <Button
          color="primary"
          disabled={!selected}
          onClick={handleSetClick}
          variant="contained"
        >
          Apply Template
        </Button>
      </DialogActions>
    </>
  );
}

/** Displays the available info for a selected item */
const TemplateInfo = (props: { selected: RowData }) => {
  const { selected } = props;

  return (
    <TableContainer sx={{ border: "thin solid lightgray", maxHeight: "20rem" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(selected)?.map(([key, value], index) => (
            <TableRow key={index}>
              <TableCell>{key}</TableCell>
              <TableCell>{value?.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
