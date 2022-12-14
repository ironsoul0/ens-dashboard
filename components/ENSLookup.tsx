import { Spinner } from "components";
import { LookupStatusType, useLookupService } from "hooks";
import { trimString } from "services";

export const ENSLookup: React.FC = () => {
  const { lookupTarget, setLookupTarget, status } = useLookupService();

  return (
    <div className="mt-3">
      <div className="mb-2 bg-gray-400 rounded-sm bg-opacity-20 h-0.5" />
      <h2 className="mb-3 text-2xl font-bold">ENS Lookup</h2>
      <input
        type="text"
        name="domain"
        className="w-full px-3 py-1 mb-3 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="vitalik.eth"
        value={lookupTarget}
        onChange={(e) => setLookupTarget(e.target.value)}
      />
      {status.type === LookupStatusType.Empty && (
        <p className="text-gray-600">Please type in ENS name or ETH address</p>
      )}
      {status.type === LookupStatusType.Loading && (
        <Spinner className="w-6 h-6" />
      )}
      {status.type === LookupStatusType.Error && (
        <p className="font-medium text-red-500">{status.error}</p>
      )}
      {status.type === LookupStatusType.Success && (
        <div className="overflow-scroll">
          <div
            className="flex overflow-scroll font-medium"
            style={{ minWidth: 720 }}
          >
            <p className="flex-1">Domain</p>
            <p className="flex-1">Registrant</p>
            <p className="flex-1">ETH address</p>
            <p className="flex-1">Register date</p>
            <p className="flex-1">Expiry date</p>
          </div>
          <div className="flex overflow-scroll" style={{ minWidth: 720 }}>
            <p className="flex-1">{status.info.domain}</p>
            <p className="flex-1">{trimString(status.info.registrant)}</p>
            <p className="flex-1">
              {trimString(status.info.assignedETHAddress) || "N/A"}
            </p>
            <p className="flex-1">
              {status.info.registrationDate.toDateString()}
            </p>
            <p className="flex-1">{status.info.expiryDate.toDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
