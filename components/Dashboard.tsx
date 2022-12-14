import { ENSLookup, ENSRegistrations, ForkMe } from "components";

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-4xl px-3 py-5 mx-auto">
      <ForkMe />
      <ENSLookup />
      <ENSRegistrations />
    </div>
  );
};
