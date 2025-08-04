import { customThemeToken } from '@/components/custom-theme';
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
import { cn } from '@/lib/utils';
import {
  darkTheme,
  getDefaultConfig,
  lightTheme,
  TantoConnectButton,
  TantoProvider,
  useAuthEffect,
} from '@sky-mavis/tanto-widget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, useState } from 'react';
import {
  useAccount,
  useAccountEffect,
  useSignMessage,
  WagmiProvider,
} from 'wagmi';
import { jwtDecode } from 'jwt-decode';

const config = getDefaultConfig({
  ssr: true,
  keylessWalletConfig: {
    clientId: 'dbe1e3ff-e145-422f-84c4-e0beb4972f69',
    waypointOrigin: 'https://id.skymavis.one',
  },
  coinbaseWalletConfig: {
    enable: true,
  },
});

const queryClient = new QueryClient();

const themes = [
  { label: 'Dark Theme', value: 'dark' },
  { label: 'Light Theme', value: 'light' },
  { label: 'Custom Theme', value: 'custom' },
] as const;

const themeBackgroundClass: Record<'dark' | 'light' | 'custom', string> = {
  dark: 'bg-gradient-to-b from-gray-900 to-gray-800',
  light: 'bg-gradient-to-b from-white to-gray-100 text-gray-900',
  custom: 'bg-gradient-to-b from-[#ffecd2] to-[#fcb69f] text-gray-900',
};

const themeCardClass: Record<'dark' | 'light' | 'custom', string> = {
  dark: 'bg-gray-800 border-gray-700',
  light: 'bg-white border-gray-200',
  custom: 'bg-[#fffbe6] border-[#fcb69f]',
};

const themeTextClass: Record<'dark' | 'light' | 'custom', string> = {
  dark: 'text-white',
  light: 'text-gray-900',
  custom: 'text-orange-900',
};

const TantoWidgetExample: FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'custom'>('dark');

  function handleThemeChange(value: 'dark' | 'light' | 'custom') {
    setTheme(value);
  }

  const getTheme = () => {
    if (theme === 'custom') return lightTheme(customThemeToken);
    if (theme === 'dark') return darkTheme();
    return lightTheme();
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TantoProvider
          theme={getTheme()}
          config={{
            clientId: 'dbe1e3ff-e145-422f-84c4-e0beb4972f69',
            __internal_baseUrl:
              'https://waypoint-api.skymavis.one/v1/rpc/public',
            createAccountOnConnect: true,
          }}
        >
          <div
            className={cn(
              'min-h-screen text-white p-4 md:p-8 transition-colors duration-300',
              themeBackgroundClass[theme],
              theme === 'light' || theme === 'custom'
                ? 'text-gray-900'
                : 'text-white'
            )}
          >
            <div className="max-w-3xl mx-auto">
              <header className="mb-4 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  Tanto Widget Demo
                </h1>
                <p>Connect your wallet and sign a message</p>
              </header>

              <div className="mb-8 flex w-full justify-center items-center gap-4">
                {[
                  {
                    href: 'https://github.com/nguyenhuugiatri/tanto-widget-playground',
                    label: 'Demo Repository',
                  },
                  {
                    href: 'https://github.com/skymavis/tanto-kit/tree/main/packages/widget',
                    label: 'Source Code Repository',
                  },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 underline"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                      focusable="false"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    {label}
                  </a>
                ))}
              </div>

              <div className="flex justify-center items-center gap-4 max-w-8/12 mx-auto mb-12">
                {themes.map(({ label, value }) => (
                  <Button
                    key={value}
                    variant="secondary"
                    className={cn(
                      'w-1/3',
                      theme === value &&
                        'bg-gradient-to-r from-pink-500 to-indigo-500 text-white'
                    )}
                    onClick={() => handleThemeChange(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center mb-8">
                <TantoConnectButton label="Sign in" />
              </div>

              <div className="flex flex-col gap-2">
                <AuthInfo theme={theme} />
                <MessageSigner theme={theme} />
              </div>
            </div>
          </div>
        </TantoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function AuthInfo({ theme }: { theme: 'dark' | 'light' | 'custom' }) {
  const { isConnected } = useAccount();
  const [token, setToken] = useState('');

  useAccountEffect({
    onDisconnect: () => {
      setToken('');
    },
  });

  useAuthEffect({
    onSuccess: (data) => {
      console.log('data', data);
      setToken(data.token);
    },
    onError: (error) => {
      alert('Authentication failed: ' + JSON.stringify(error, null, 2));
    },
  });

  if (!isConnected || !token) {
    return null;
  }

  const decodedToken = jwtDecode(token);

  return (
    <Card className={themeCardClass[theme]}>
      <CardHeader>
        <CardTitle className={themeTextClass[theme]}>ID Token</CardTitle>
        <CardDescription className={themeTextClass[theme]}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function MessageSigner({ theme }: { theme: 'dark' | 'light' | 'custom' }) {
  const [message, setMessage] = useState('Hello, Web3 World!');
  const [signature, setSignature] = useState('');
  const { isConnected } = useAccount();
  const { signMessage, isPending } = useSignMessage({
    mutation: {
      onMutate() {
        setSignature('');
      },
      onSuccess(data) {
        setSignature(data);
      },
    },
  });

  const handleSign = () => {
    signMessage({ message });
  };

  if (!isConnected) {
    return (
      <Card className={themeCardClass[theme]}>
        <CardHeader>
          <CardTitle className={themeTextClass[theme]}>Sign Message</CardTitle>
          <CardDescription className={themeTextClass[theme]}>
            Connect your wallet first to sign a message
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={themeCardClass[theme]}>
      <CardHeader>
        <CardTitle className={themeTextClass[theme]}>Sign Message</CardTitle>
        <CardDescription className={themeTextClass[theme]}>
          Enter a message to sign with your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="message"
            className={cn(
              'text-md font-medium block mb-1',
              themeTextClass[theme]
            )}
          >
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to sign"
            className={cn(
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 placeholder:text-white'
                : '',
              theme === 'light'
                ? 'bg-gray-100 border-gray-300 placeholder:text-gray-400'
                : '',
              theme === 'custom'
                ? 'bg-[#fffbe6] border-[#fcb69f] placeholder:text-orange-400'
                : ''
            )}
          />
        </div>

        <Button
          onClick={handleSign}
          disabled={isPending || !message.trim()}
          className={cn(
            'w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
          )}
        >
          {isPending ? 'Signing...' : 'Sign Message'}
        </Button>

        {signature && (
          <div className="space-y-2 pt-4">
            <Separator
              className={
                theme === 'dark'
                  ? 'bg-gray-700'
                  : theme === 'light'
                  ? 'bg-gray-200'
                  : 'bg-[#fcb69f]'
              }
            />
            <label
              className={cn(
                'text-md font-medium block mb-1',
                themeTextClass[theme]
              )}
            >
              Signature
            </label>
            <div
              className={cn(
                'p-3 rounded-md border overflow-x-auto',
                themeCardClass[theme]
              )}
            >
              <p
                className={cn(
                  'text-sm font-mono break-all',
                  themeTextClass[theme]
                )}
              >
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
