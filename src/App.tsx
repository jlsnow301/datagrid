import { TableConstructor } from "./TableConstructor";
import data from "./data.json";
import mockData from "./MOCK_DATA.json";
import { RowData } from "./TableConstructor/types";
import riskData from "./riskData.json";

export const App = () => {
  function onSave(data: RowData) {
    console.log(data);
    if (!Object.values(data)[0]) {
      console.log("New row");
      return;
    }
    console.log("Edited row", data);
  }

  const displayColumns = [
    "RiskID",
    "FocusArea",
    "Title",
    "AssetCategory",
    "Platform",
    "FunctionCode",
    "Status",
    "Severity",
  ];

  return (
    <div className="h-96 bg-slate-600" style={{ width: "75rem" }}>
      <TableConstructor
        editable
        data={riskData}
        onSave={onSave}
        displayColumns={displayColumns}
      />
    </div>
  );
};
