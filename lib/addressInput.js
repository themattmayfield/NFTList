import { useCallback, useEffect, useRef, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { getEllipsisTxt } from "lib/formatters";
import Blockie from "components/Blockie";
import { CustomAddress } from "components/PageUtils";
import { SearchIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
// import { SearchOutlined } from "@ant-design/icons";

function AddressInput(props) {
  const input = useRef(null);
  const { web3 } = useMoralis();
  const [address, setAddress] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [isDomain, setIsDomain] = useState(false);
  const {
    resolve: { resolveDomain },
  } = useMoralisWeb3Api();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (validatedAddress) props.onChange(isDomain ? validatedAddress : address);
  }, [props, validatedAddress, isDomain, address]);

  const updateAddress = useCallback(
    async (value) => {
      setAddress(value);
      if (isSupportedDomain(value)) {
        const processPromise = function (promise) {
          promise
            .then((addr) => {
              setValidatedAddress(addr);
              setIsDomain(true);
            })
            .catch(() => {
              setValidatedAddress("");
            });
        };
        if (value.endsWith(".eth")) {
          processPromise(web3.eth.ens.getAddress(value));
        } else {
          processPromise(
            resolveDomain({
              domain: value,
            }).then((r) => r.address)
          );
        }
      } else if (value.length === 42) {
        setValidatedAddress(getEllipsisTxt(value, 10));
        setIsDomain(false);
      } else {
        setValidatedAddress("");
        setIsDomain(false);
      }
    },
    [resolveDomain, web3.eth.ens]
  );

  return (
    <>
      <p>111111111111111111111111111111111111111111</p>
      <CustomAddress
        ref={input}
        placeholder={props.placeholder ? props.placeholder : "Public address"}
        htmlFor="addWallet"
        label="Add Wallet"
        type="text"
        name="addWallet"
        id="addWallet"
        prefix={
          isDomain || address.length === 42 ? (
            <Blockie
              address={(isDomain ? validatedAddress : address).toLowerCase()}
              size={8}
              scale={3}
            />
          ) : (
            <SearchIcon className="w-5 h-5 text-gray-400" />
          )
        }
        suffix={validatedAddress && <XIcon className="w-5 h-5 text-red-600" />}
        autoFocus={props.autoFocus}
        value={
          isDomain
            ? `${address} (${getEllipsisTxt(validatedAddress)})`
            : validatedAddress || address
        }
        onChange={(e) => {
          updateAddress(e.target.value);
        }}
        disabled={validatedAddress}
      />
    </>
  );
}

function isSupportedDomain(domain) {
  return [
    ".eth",
    ".crypto",
    ".coin",
    ".wallet",
    ".bitcoin",
    ".x",
    ".888",
    ".nft",
    ".dao",
    ".blockchain",
  ].some((tld) => domain.endsWith(tld));
}

export default AddressInput;
