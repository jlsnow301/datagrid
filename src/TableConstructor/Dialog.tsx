import { Button, Dialog, DialogTitle } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useState } from "react";

import type { DynamicDialogProps, RowData } from "./types";
import { toTitleCase } from "./strings";
import { DynamicForm } from "./Form";
import { DynamicWizard } from "./Wizard";

type DialogMode = "edit" | "wizard";

/**
 * ## DynamicDialog
 * Parent component for the form and wizard dialogs. This component is used to
 * create a dialog to edit a row in the table. The dialog will be pre-populated
 * with the data from the rowm or use a template.
 */
export function DynamicDialog({
  editing,
  formContent,
  label,
  modalIsOpen,
  onClose,
  onDelete,
  onSubmit,
  options,
  templates,
}: DynamicDialogProps) {
  const [content, setContent] = useState<RowData>(formContent);
  const [dialogMode, setDialogMode] = useState<DialogMode>("edit");
  const hasTemplates = (templates && templates?.length > 0) || false;

  let dialogTitle;
  if (dialogMode === "edit") {
    dialogTitle = `${editing ? "Edit" : "New"} ${
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
  function handleSetTemplate(selected: RowData) {
    setContent(selected);
    setDialogMode("edit");
  }

  return (
    <Dialog
      aria-labelledby="recommendations-dialog"
      maxWidth="md"
      onClose={onClose}
      open={modalIsOpen}
    >
      <DialogTitle
        id="recommendations-dlg-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {dialogTitle}
        {hasTemplates && (
          <Button
            onClick={handleChangeMode}
            sx={{ paddingLeft: "0.5rem" }}
            variant="contained"
          >
            <SwapHorizIcon sx={{ marginRight: "0.5rem" }} /> Switch to{" "}
            {dialogMode === "edit" ? "wizard" : "edit"}
          </Button>
        )}
      </DialogTitle>
      {dialogMode === "edit" ? (
        <DynamicForm
          {...{
            content,
            editing,
            onClose,
            onDelete,
            onSubmit,
            options,
          }}
        />
      ) : (
        <DynamicWizard
          {...{
            onClose,
            onSetTemplate: handleSetTemplate,
            templates,
          }}
        />
      )}
    </Dialog>
  );
}
