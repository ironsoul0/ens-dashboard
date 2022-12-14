import { NetworkStatus, useQuery } from "@apollo/client";
import { QUERY_REGISTRATIONS, TRegistrationFragment } from "api";
import { useInterval } from "hooks";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ENSInfo, extractENSInfoFromRegistrationFragment } from "services";

type UseENSPagination = {
  loadingInformation: boolean;
  pollingFirstPage: boolean;
  resolvedDomains: ENSInfo[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export const PAGE_SIZE = 10;
const POLLING_INTERVAL_MS = 10 * 1000;

export const useENSPagination = (): UseENSPagination => {
  const [page, setPage] = useState(0);
  const [pollingFirstPage, setPollingFirstPage] = useState(false);
  const [fetchingDomains, setFetchingDomains] = useState(false);
  const firstDataFetch = useRef(true);
  const { data, networkStatus, fetchMore } = useQuery(QUERY_REGISTRATIONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: PAGE_SIZE,
      skip: 0,
    },
  });
  const [resolvedDomains, setResolvedDomains] = useState<ENSInfo[]>([]);

  const addToResolvedDomains = useCallback(
    async (registrations: TRegistrationFragment[], polling?: boolean) => {
      setFetchingDomains(true);

      const ensInfo = await Promise.all(
        registrations.map((registration) =>
          extractENSInfoFromRegistrationFragment(registration)
        )
      );

      setResolvedDomains((domains) =>
        polling ? [...ensInfo] : [...domains, ...ensInfo]
      );
      setFetchingDomains(false);
      setPollingFirstPage(false);
    },
    []
  );

  const refetchPageInformation = useCallback(
    async (page: number) => {
      if (page > 0) {
        if (data.registrations.length < (page + 1) * PAGE_SIZE) {
          fetchMore({
            variables: { skip: page * PAGE_SIZE },
            updateQuery: (prevResponse, { fetchMoreResult }) => {
              addToResolvedDomains(fetchMoreResult.registrations);

              return {
                registrations: [
                  ...prevResponse.registrations,
                  ...fetchMoreResult.registrations,
                ],
              };
            },
          });
        }
      }
    },
    [addToResolvedDomains, data, fetchMore]
  );

  const loadingInformation = useMemo(
    () => fetchingDomains || networkStatus === NetworkStatus.fetchMore || !data,
    [data, fetchingDomains, networkStatus]
  );

  useInterval(() => {
    if (page === 0 && !firstDataFetch.current) {
      setPollingFirstPage(true);

      fetchMore({
        variables: { skip: 0 },
        updateQuery: (prevMoreResult, { fetchMoreResult }) => {
          if (
            prevMoreResult.registrations[0].domain.name ===
            fetchMoreResult.registrations[0].domain.name
          ) {
            setPollingFirstPage(false);
            return prevMoreResult;
          }

          addToResolvedDomains(fetchMoreResult.registrations, true);

          return {
            registrations: [...fetchMoreResult.registrations],
          };
        },
      });
    }
  }, POLLING_INTERVAL_MS);

  useEffect(() => {
    refetchPageInformation(page);
  }, [page, refetchPageInformation]);

  useEffect(() => {
    if (firstDataFetch.current && data) {
      firstDataFetch.current = false;
      addToResolvedDomains(data.registrations);
    }
  }, [data, addToResolvedDomains]);

  return {
    loadingInformation,
    pollingFirstPage,
    resolvedDomains,
    page,
    setPage,
  };
};
