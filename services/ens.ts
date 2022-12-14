import { TRegistrationFragment } from "api";
import { chainReadProvider } from "config";

const MS_IN_SECONDS = 1000;

export type ENSInfo = {
  registrant: string;
  assignedETHAddress: string;
  registrationDate: Date;
  expiryDate: Date;
  domain: string;
};

export const extractENSInfoFromRegistrationFragment = async (
  registration: TRegistrationFragment,
  address?: string
): Promise<ENSInfo> => {
  const reversedRegistrant = await chainReadProvider.lookupAddress(
    registration.registrant.id
  );

  return {
    registrant: reversedRegistrant || registration.registrant.id,
    assignedETHAddress:
      address || registration.domain.resolvedAddress?.id || "",
    expiryDate: new Date(registration.expiryDate * MS_IN_SECONDS),
    registrationDate: new Date(registration.registrationDate * MS_IN_SECONDS),
    domain: registration.domain.name,
  };
};
