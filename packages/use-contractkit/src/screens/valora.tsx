import React, { useCallback, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { SwitchNetworkButton } from '../components/SwitchNetworkButton';
import { UnsupportedChainIdError, ValoraConnector } from '../connectors';

import { Connector } from '../types';
import { useContractKitInternal } from '../use-contractkit';

interface Props {
  onSubmit: (connector: Connector) => void;
}

export const Valora: React.FC<Props> = ({ onSubmit }: Props) => {
  const {
    network,
    initConnector,
    initError: error,
    dapp,
  } = useContractKitInternal();

  const initialiseConnection = useCallback(async () => {
    const connector = new ValoraConnector(network, dapp.name);
    try {
      await initConnector(connector);
      onSubmit(connector);
    } catch (e) {
      console.error(e);
    }
  }, [initConnector, network, onSubmit, dapp.name]);

  useEffect(() => {
    void initialiseConnection();
  }, [initialiseConnection]);

  if (error?.name === UnsupportedChainIdError.NAME) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-flex-col">
        <p className="tw-text-red-500 tw-pb-4">
          Please connect to the Celo network to continue.
        </p>
        <SwitchNetworkButton chainId={network.chainId} />
      </div>
    );
  }

  return (
    <div className="tw-flex tw-items-center tw-justify-center">
      {error ? (
        <p className="tw-text-red-500 tw-pb-4">{error.message}</p>
      ) : (
        <Loader type="TailSpin" color="white" height="36px" width="36px" />
      )}
    </div>
  );
};
