import { Button, Dialog, DialogTitle } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useState } from "react";
import { DynamicDialogProps, RowData } from "./types";
import { toTitleCase } from "../strings";
import { DynamicForm } from "./Form";
import { DynamicWizard } from "./Wizard";

/**
 * ## DynamicDialog
 * Parent component for the form and wizard dialogs. This component is used to
 * create a dialog to edit a row in the table. The dialog will be pre-populated
 * with the data from the rowm or use a template.
 */
export function DynamicDialog(props: DynamicDialogProps) {
  const {
    editing,
    formContent,
    label,
    modalIsOpen,
    onClose,
    onDelete,
    onSubmit,
    options,
    templates,
  } = props;
  const [content, setContent] = useState<RowData>(formContent);
  const [dialogMode, setDialogMode] = useState<"edit" | "wizard">("edit");
  const hasTemplates = (templates && templates?.length > 0) || false;

  let dialogTitle;
  if (dialogMode === "edit") {
    dialogTitle = `${editing ? "Edit" : "Insert"} ${
      (label && toTitleCase(label)) || "Data"
    }`;
  } else if (dialogMode === "wizard") {
    dialogTitle = "Template Wizard";
  }

  /** Toggle dialog between edit and wizard modes */
  function handleChangeMode() {
    setDialogMode(dialogMode === "edit" ? "wizard" : "edit");
  }

  /** Wizard uses this to apply the template. */
  function onSetTemplate(selected: RowData) {
    setContent(selected);
    setDialogMode("edit");
  }

  return (
    <Dialog
      maxWidth="md"
      open={modalIsOpen}
      onClose={onClose}
      aria-labelledby="recommendations-dialog"
    >
      <DialogTitle
        id="recommendations-dlg-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {dialogTitle}
        <Button
          disabled={!hasTemplates}
          onClick={handleChangeMode}
          sx={{ paddingLeft: "0.5rem" }}
          variant="contained"
        >
          <SwapHorizIcon sx={{ marginRight: "0.5rem" }} /> Switch to{" "}
          {dialogMode === "edit" ? "wizard" : "edit"}
        </Button>
      </DialogTitle>
      {dialogMode === "edit" ? (
        <DynamicForm
          {...{
            content,
            editing,
            options,
            onClose,
            onDelete,
            onSubmit,
          }}
        />
      ) : (
        <DynamicWizard
          {...{
            onSetTemplate,
            onClose,
            templates,
          }}
        />
      )}
    </Dialog>
  );
}
