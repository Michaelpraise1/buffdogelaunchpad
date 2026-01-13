import React, { useState } from 'react';
import { Header } from '../components/navigation/Header';

interface StakingData {
    userStake: {
        amount: number;
        symbol: string;
        isConnected: boolean;
    };
    rewards: {
        fees: number;
        airdrops: number;
    };
    globalStats: {
        totalValueLocked: number;
        totalStaked: number;
        coreStakeholders: number;
        coreStaked: number;
    };
}

const Staking: React.FC = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [topValue, setTopValue] = useState('all-time');
    const [unclaimed, setUnclaimed] = useState('current');

    const stakingData: StakingData = {
        userStake: {
            amount: 0,
            symbol: 'BUFFDOGE',
            isConnected: isWalletConnected
        },
        rewards: {
            fees: 0,
            airdrops: 0
        },
        globalStats: {
            totalValueLocked: 1987190,
            totalStaked: 781994542,
            coreStakeholders: 1016,
            coreStaked: 45699
        }
    };

    const handleConnect = () => {
        setIsWalletConnected(true);
    };

    const handleStake = () => {
        console.log('Staking BUFFDOGE tokens');
    };

    const handleLearnMore = () => {
        console.log('Learn more about staking');
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    return (
        <div className="min-h-screen home-bg pt-[100px] pb-8">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header Section - Full Width */}
                <div className="mb-6">
                    <h1 className="text-white text-4xl lg:text-5xl font-semibold mb-3">
                        BUFFDOGE Staking
                    </h1>
                    <div className="bg-[#331B41] rounded-2xl p-5 max-w-2xl">
                        <p className="text-purple-200 text-lg mb-1">
                            Earn An Airdrop On Every Graduation + Ongoing Trading Fees
                        </p>
                        <p className="text-yellow-400 text-lg font-semibold">
                            With BUFFDOGE
                        </p>
                    </div>
                </div>

                {/* Buff Doge Image - Positioned in top right */}
                <div className="absolute top-[60px] right-[50px] hidden xl:block z-10">
                    <img
                        src="/images/l.png"
                        alt="Buff Doge"
                        className="w-48 h-48 object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/doge-placeholder.png";
                        }}
                    />
                </div>

                {/* Main Grid - Exact alignment as marked */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    {/* Left Column - Your Stake (Spans 4 columns) */}
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl p-5 h-full">
                            <h3 className="text-white text-lg font-semibold mb-5">Your Stake</h3>

                            <div className="rounded-xl p-5 bg-[#331B41] border border-[#7D45C3]/30">
                                <div className="text-gray-400 text-sm mb-4">Your Staked BUFFDOGE</div>

                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                                        <img
                                            src="/logo.png"
                                            alt="BUFFDOGE"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-white text-2xl font-bold">
                                            {isWalletConnected ? `${stakingData.userStake.amount}` : '???'}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            $0.00
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            {stakingData.userStake.symbol} • In Wallet: ???
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={isWalletConnected ? handleStake : handleConnect}
                                    className="w-full bg-[#7D45C3] text-sm cursor-pointer hover:bg-[#8845d8] text-white py-3 rounded-full font-semibold transition-all"
                                >
                                    Connect
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Staking Rewards (Spans 8 columns) */}
                    <div className="lg:col-span-8">
                        <div className="rounded-2xl p-5">
                            <h3 className="text-white text-lg font-semibold mb-5">Your Staking Rewards</h3>

                            {/* Fees Section */}
                            <div className="mb-5 bg-[#331B41] border border-[#7D45C3]/30 px-4 py-4 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-400 text-sm">Fees ⓘ</span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className='flex items-center gap-[13px]'>
                                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                            <span className="text-black text-sm font-bold">S</span>
                                        </div>
                                        <div>
                                            <div className="text-white text-xl font-bold">
                                                {isWalletConnected ? `${stakingData.rewards.fees} SOL` : '??? SOL'}
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                Airdrop Value ($???)
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                Claimable To Date ??? SOL ($???)
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleConnect}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all"
                                    >
                                        Connect
                                    </button>
                                </div>
                            </div>

                            {/* Airdrops Section */}
                            <div className="mb-5 bg-[#331B41] border border-[#7D45C3]/30 px-4 py-4 rounded-xl">
                                <span className="text-gray-400 text-sm mb-3 block">Airdrops ⓘ</span>

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                        <span className="text-black text-sm font-bold">S</span>
                                    </div>
                                    <div>
                                        <div className="text-white text-xl font-bold">
                                            {isWalletConnected ? `${stakingData.rewards.airdrops} SOL` : '??? SOL'}
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            Current Airdrop Claimable Value ($???)
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            Lifetime Peak Airdrop Value 0 Sol (—)
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown Filters */}
                                <div className="flex gap-4 mb-6">
                                    <div className="relative">
                                        <select
                                            value={topValue}
                                            onChange={(e) => setTopValue(e.target.value)}
                                            className="bg-[#3D2B57] text-white px-4 py-2 rounded-lg text-sm border border-gray-600 appearance-none pr-8"
                                        >
                                            <option value="all-time">Top Value ⌄</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={unclaimed}
                                            onChange={(e) => setUnclaimed(e.target.value)}
                                            className="bg-[#3D2B57] text-white px-4 py-2 rounded-lg text-sm border border-gray-600 appearance-none pr-8"
                                        >
                                            <option value="current">Unclaimed ⌄</option>
                                            <option value="claimed">Claimed</option>
                                            <option value="all">All</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Empty State */}
                                <div className="text-center py-8 border-t border-gray-600">
                                    <img src="/images/no.png" alt="nothing" className='mb-3 w-[100px] mx-auto' />
                                    <h4 className="text-white text-lg font-semibold mb-2">Nothing Here...</h4>
                                    <p className="text-gray-400 text-sm">
                                        Stake <span className="text-yellow-400">BUFFDOGE</span> To Get Airdrops, Dummy
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA Card */}
                        <div className="mx-5 bg-gradient-to-r from-purple-800/70 to-purple-900/70 rounded-2xl p-4 border border-purple-600/20 mb-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                        <img
                                            src="/logo.png"
                                            alt="BUFFDOGE"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-yellow-400 text-sm font-semibold">
                                            Earn An Airdrop On Every Graduation +
                                        </div>
                                        <div className="text-white text-sm">
                                            Ongoing Trading Fees With BUFFDOGE
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={handleStake}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-lg font-semibold text-xs transition-all"
                                    >
                                        Get BUFFDOGE
                                    </button>
                                    <button
                                        onClick={handleLearnMore}
                                        className="bg-transparent border border-gray-600 hover:border-gray-500 text-white px-4 py-1.5 rounded-lg font-semibold text-xs transition-all"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Global Stats Card */}
                        <div className="p-5">
                            <h3 className="text-white text-lg font-semibold mb-5">Global Stats</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 staking-grad rounded-2xl p-4">
                                {/* Top Left */}
                                <div className="rounded-xl p-4">
                                    <div className="text-purple-300 text-xs mb-1">24h</div>
                                    <div className="text-white text-2xl font-bold mb-1">
                                        ${formatNumber(stakingData.globalStats.totalValueLocked)}
                                    </div>
                                    <div className="text-gray-300 text-xs">
                                        Fees Earned by BUFFDOGE Stakers
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        (1,967,536 Sol)
                                    </div>
                                </div>

                                {/* Top Right */}
                                <div className="rounded-xl p-4">
                                    <div className="text-white text-2xl font-bold mb-1">
                                        ${formatNumber(stakingData.globalStats.totalStaked)}
                                    </div>
                                    <div className="text-gray-300 text-xs">
                                        Total SOL Of All Cults Airdrops So
                                    </div>
                                </div>

                                {/* Bottom Left */}
                                <div className="rounded-xl p-4">
                                    <div className="text-white text-2xl font-bold mb-1">
                                        {formatNumber(stakingData.globalStats.coreStakeholders)}
                                    </div>
                                    <div className="text-gray-300 text-xs">
                                        Cults Graduated
                                    </div>
                                </div>

                                {/* Bottom Right */}
                                <div className="rounded-xl p-4">
                                    <div className="text-white text-2xl font-bold mb-1">
                                        {formatNumber(stakingData.globalStats.coreStaked)}
                                    </div>
                                    <div className="text-gray-300 text-xs">
                                        Cults Created
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Staking;
