import { TableConstructor } from "./TableConstructor";
import data from "./data.json";
import mockData from "./MOCK_DATA.json";

export const App = () => {
  return (
    <div className="h-96 bg-slate-600" style={{ width: "75rem" }}>
      <TableConstructor
        editable
        data={data}
        optionalKeys={["first_name"]}
        // selections={{ age: [15, 33, 46] }}
      />
    </div>
  );
};
