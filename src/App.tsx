import { TableConstructor } from "./TableConstructor";
import data from "./data.json";
import mockData from "./MOCK_DATA.json";
import { RowData } from "./TableConstructor/types";
export const App = () => {
  function onSave(data: RowData) {
    if (!Object.values(data)[0]) {
      console.log("New row");
      return;
    }
    console.log("Edited row");
  }

  return (
    <div className="h-96 bg-slate-600" style={{ width: "75rem" }}>
      <TableConstructor editable data={data} onSave={onSave} />
    </div>
  );
};
