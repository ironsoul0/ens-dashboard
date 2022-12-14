import { Spinner } from "components";
import { PAGE_SIZE, useENSPagination } from "hooks";
import { trimString } from "services";

export const ENSRegistrations: React.FC = () => {
  const {
    loadingInformation,
    pollingFirstPage,
    resolvedDomains,
    page,
    setPage,
  } = useENSPagination();

  return (
    <div className="mt-20">
      <div className="mb-2 bg-gray-400 rounded-sm bg-opacity-20 h-0.5" />
      <h2 className="mb-3 text-2xl font-bold">ENS Registrations</h2>

      <div>
        <div className="overflow-scroll">
          <div className="flex font-medium" style={{ minWidth: 720 }}>
            <p className="flex-1">Domain</p>
            <p className="flex-1">Registrant</p>
            <p className="flex-1">ETH address</p>
            <p className="flex-1">Register date</p>
            <p className="flex-1">Expiry date</p>
          </div>
          {loadingInformation && !pollingFirstPage ? (
            <Spinner className="w-6 h-6 mt-2" />
          ) : (
            resolvedDomains
              .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
              .map((domainInfo, i) => (
                <div key={i} className="flex my-2" style={{ minWidth: 720 }}>
                  <p className="flex-1">{trimString(domainInfo.domain)}</p>
                  <p className="flex-1">{trimString(domainInfo.registrant)}</p>
                  <p className="flex-1">
                    {trimString(domainInfo.assignedETHAddress) || "N/A"}
                  </p>
                  <p className="flex-1">
                    {domainInfo.registrationDate.toDateString()}
                  </p>
                  <p className="flex-1">
                    {domainInfo.expiryDate.toDateString()}
                  </p>
                </div>
              ))
          )}
        </div>
        <p className="mt-2 mb-4 font-medium">
          Page: {page + 1} {pollingFirstPage && "(Polling..)"}
        </p>
        <div className="flex">
          <button
            className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-all disabled:bg-gray-400"
            disabled={page === 0 || loadingInformation}
            onClick={() => setPage((page) => page - 1)}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 ml-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-all disabled:bg-gray-400"
            onClick={() => setPage((page) => page + 1)}
            disabled={loadingInformation}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
