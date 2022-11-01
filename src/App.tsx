import { PageConstructor } from "./Constructor";
import data from "./data.json";
import mockData from "./MOCK_DATA.json";

export const App = () => {
  return (
    <div className="h-96 bg-slate-600" style={{ width: "75rem" }}>
      <PageConstructor data={data} />
      {/* <PageConstructor
        data={data}
        labelOverride={{ first_name: "Nick Name" }}
      /> */}
      {/* <PageConstructor data={data} editable /> */}
      {/* <PageConstructor data={mockData} /> */}
    </div>
  );
};
