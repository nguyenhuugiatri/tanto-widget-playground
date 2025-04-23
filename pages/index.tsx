import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  getDefaultConfig,
  TantoConnectButton,
  TantoProvider
} from '@sky-mavis/tanto-widget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useAccount, useSignMessage, WagmiProvider } from 'wagmi';

const config = getDefaultConfig();

const queryClient = new QueryClient();
const TantoWidgetExample: FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TantoProvider theme="dark">
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              <header className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  Tanto Widget Demo
                </h1>
                <p className="text-gray-300">
                  Connect your wallet and sign a message
                </p>
              </header>

              <div className="flex justify-center mb-8">
                <TantoConnectButton />
              </div>

              <MessageSigner />
            </div>
          </div>
        </TantoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function MessageSigner() {
  const [message, setMessage] = useState('Hello, Web3 World!');
  const [signature, setSignature] = useState('');
  const { isConnected } = useAccount();
  const { signMessage, isPending } = useSignMessage({
    mutation:{
        onSuccess(data) {
          setSignature(data);
        },
    }
  });

  const handleSign = () => {
    signMessage({ message });
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Sign Message</CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet first to sign a message
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Sign Message</CardTitle>
        <CardDescription className="text-gray-400">
          Enter a message to sign with your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-md font-medium text-gray-300 block mb-1"
          >
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to sign"
            className="bg-gray-700 border-gray-600 placeholder:text-gray-500"
          />
        </div>

        <Button
          onClick={handleSign}
          disabled={isPending || !message.trim()}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          {isPending ? 'Signing...' : 'Sign Message'}
        </Button>

        {signature && (
          <div className="space-y-2 pt-4">
            <Separator className="bg-gray-700" />
            <label className="text-md font-medium text-gray-300 block mb-1">
              Signature
            </label>
            <div className="p-3 bg-gray-900 rounded-md border border-gray-700 overflow-x-auto">
              <p className="text-sm text-gray-300 font-mono break-all">
                {signature}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TantoWidgetExample;
