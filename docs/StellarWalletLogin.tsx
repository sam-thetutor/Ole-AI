import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Copy, LogOut } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';

const StellarWalletLogin: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { publicKey, connect, disconnect } = useWalletStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Shorten address for display
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {!publicKey ? (
        <button
          onClick={handleConnect}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow"
        >
          <Wallet className="h-5 w-5" />
          <span>Connect Wallet</span>
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow border border-slate-700"
          >
            <Wallet className="h-5 w-5 text-blue-400" />
            <span className="font-mono text-sm">{shortenAddress(publicKey)}</span>
            <svg
              className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-gray-700 break-all">{shortenAddress(publicKey)}</span>
                  <button
                    onClick={() => copyToClipboard(publicKey)}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors rounded-b-lg"
              >
                <LogOut className="h-4 w-4" /> Disconnect
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StellarWalletLogin;