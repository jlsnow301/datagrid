import { PageConstructor } from "./PageConstructor";
import data from "./data.json";

export const App = () => {
  // Let's make a one line page creator!

  return (
    <div className="h-96 bg-slate-600">
      <PageConstructor data={data} />
    </div>
  );
};
