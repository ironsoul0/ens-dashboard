import { client, QUERY_BY_ENS_NAME } from "api";
import { chainReadProvider } from "config";
import { utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { extractENSInfoFromRegistrationFragment } from "services";

import { useDebounce } from "./useDebounce";

enum LookupStatusError {
  INVALID_DOMAIN = "Input does not look like ENS domain nor ETH address",
  NOT_FOUND_ENS = "Given ENS domain is not registered",
  NOT_FOUND_ETH_ADDRESS = "Given ETH address could not be reversely looked up",
}

export enum LookupStatusType {
  Empty,
  Loading,
  Error,
  Success,
}

type ENSInfo = {
  registrant: string;
  assignedETHAddress: string;
  registrationDate: Date;
  expiryDate: Date;
  domain: string;
};

type LookupStatus =
  | { type: LookupStatusType.Empty }
  | { type: LookupStatusType.Loading }
  | { type: LookupStatusType.Error; error?: string }
  | { type: LookupStatusType.Success; info: ENSInfo };

type UseLookupService = {
  lookupTarget: string;
  setLookupTarget: (newValue: string) => void;
  status: LookupStatus;
};

const endsWithETH = (domain: string): boolean => {
  return domain.substring(domain.length - 4) === ".eth";
};

export const useLookupService = (): UseLookupService => {
  const [target, setTarget] = useState("");
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>({
    type: LookupStatusType.Empty,
  });
  const debouncedTarget = useDebounce(target);

  const directLookup = useCallback(
    async (target: string, progress: { active: boolean }) => {
      const {
        data: { registrations },
      } = await client.query({
        query: QUERY_BY_ENS_NAME,
        variables: { name: target },
      });

      if (registrations.length === 0) {
        progress.active &&
          setLookupStatus({
            type: LookupStatusType.Error,
            error: LookupStatusError.NOT_FOUND_ENS,
          });
      } else {
        progress.active &&
          setLookupStatus({
            type: LookupStatusType.Success,
            info: await extractENSInfoFromRegistrationFragment(
              registrations[0]
            ),
          });
      }
    },
    []
  );

  const reverseLookup = useCallback(
    async (target: string, progress: { active: boolean }) => {
      const ensDomain = await chainReadProvider.lookupAddress(target);
      if (!ensDomain) {
        return (
          progress.active &&
          setLookupStatus({
            type: LookupStatusType.Error,
            error: LookupStatusError.NOT_FOUND_ETH_ADDRESS,
          })
        );
      }

      const {
        data: { registrations },
      } = await client.query({
        query: QUERY_BY_ENS_NAME,
        variables: { name: ensDomain },
      });

      progress.active &&
        setLookupStatus({
          type: LookupStatusType.Success,
          info: await extractENSInfoFromRegistrationFragment(registrations[0]),
        });
    },
    []
  );

  useEffect(() => {
    const progress = { active: true };

    if (!debouncedTarget.length) {
      setLookupStatus({ type: LookupStatusType.Empty });
    } else {
      setLookupStatus({ type: LookupStatusType.Loading });
      if (!endsWithETH(debouncedTarget) && !utils.isAddress(debouncedTarget)) {
        setLookupStatus({
          type: LookupStatusType.Error,
          error: LookupStatusError.INVALID_DOMAIN,
        });
      } else {
        if (endsWithETH(debouncedTarget)) {
          directLookup(debouncedTarget, progress);
        } else {
          reverseLookup(debouncedTarget, progress);
        }
      }
    }

    return () => {
      progress.active = false;
    };
  }, [debouncedTarget, directLookup, reverseLookup]);

  return {
    lookupTarget: target,
    setLookupTarget: setTarget,
    status: lookupStatus,
  };
};
