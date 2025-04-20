import {
  getDefaultConfig,
  TantoConnectButton,
  TantoProvider,
} from '@sky-mavis/tanto-widget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';
import { useAccount, WagmiProvider } from 'wagmi';

const config = getDefaultConfig();

const queryClient = new QueryClient();
const WagmiExample: FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TantoProvider theme="dark">
          <Account />
        </TantoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const Account = () => {
  const { address, isConnected } = useAccount();

  return (
    <div
      className={'w-full min-h-screen flex items-center flex-col gap-4 p-10'}
    >
      <TantoConnectButton />

      {isConnected && <p>{address}</p>}
    </div>
  );
};

export default WagmiExample;
