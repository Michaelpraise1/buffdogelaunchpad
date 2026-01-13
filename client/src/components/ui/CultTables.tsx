const ROWS = [
  // Demo rows as per your image
  {
    rank: "#004",
    name: "IT3B",
    subtitle: "Red Uncle",
    avatar: "/images/PINK.png",
    creator: "HQbW...8P7J",
    creatorAvatar: "/images/YEL.png",
    followers: "n/a",
    mcap: "$401,413",
    mcapChange: "-0.34%",
    mcapColor: "text-red-400",
    timeAgo: "26d 10h ago",
    buy: true,
  },
  {
    rank: "#005",
    name: "BUFFDOGEA",
    subtitle: "BUFFDOGEA",
    avatar: "/images/PINK.png",
    creator: "@SrPetersETH",
    creatorVerified: true,
    creatorAvatar: "/images/YEL.png",
    followers: "145669",
    mcap: "$258,249",
    mcapChange: "-6.87%",
    mcapColor: "text-red-400",
    timeAgo: "3mos 2d 23h ago",
    buy: true,
  },
  {
    rank: "#006",
    name: "DONTBUY",
    subtitle: "NoBuy",
    avatar: "/images/PINK.png",
    creator: "@sibeleth",
    creatorVerified: true,
    creatorAvatar: "/images/YEL.png",
    followers: "177105",
    mcap: "$169,086",
    mcapChange: "+0%",
    mcapColor: "text-green-400",
    timeAgo: "3mos 8d 7h ago",
    buy: true,
  },
  {
    rank: "#007",
    name: "FARM2",
    subtitle: "Some Airdrop Farm2",
    avatar: "/images/PINK.png",
    creator: "@shawmakesmagic",
    creatorVerified: true,
    creatorAvatar: "/images/YEL.png",
    followers: "156600",
    mcap: "$89,449",
    mcapChange: "+1.97%",
    mcapColor: "text-green-400",
    timeAgo: "3mos 2d 13h ago",
    buy: true,
  },
];

const CultsTable = () => (
  <div className="w-full bg-[#271431] rounded-2xl p-4 pt-6 pb-4 mt-0 overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="text-gray-400 text-xs font-medium border-b border-gray-600/20">
          <th className="text-left py-3 px-2 min-w-[120px]">Token</th>
          <th className="text-left py-3 px-2 min-w-[180px]">Created By</th>
          <th className="text-left py-3 px-2 min-w-[80px]">Followers</th>
          <th className="text-left py-3 px-2 min-w-[100px]">Mcap</th>
          <th className="text-left py-3 px-2 min-w-[70px]">Buy</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row, _idx) => (
          <tr
            key={row.rank}
            className="border-b border-[#40305b]/20 last:border-none hover:bg-purple-900/10 transition-colors"
          >
            {/* Token Column */}
            <td className="py-4 px-2">
              <div className="flex items-center gap-3">
                <span className="text-purple-300 font-semibold text-lg font-mono w-8 flex-shrink-0 rotate-90">
                  {row.rank}
                </span>
                <img
                  src={row.avatar}
                  alt={row.name}
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <div className="text-white font-bold text-sm truncate">
                    {row.name}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {row.subtitle}
                  </div>
                </div>
              </div>
            </td>

            {/* Created By Column */}
            <td className="py-4 px-2">
              <div className="flex items-center gap-2">
                <img
                  src={row.creatorAvatar}
                  alt={row.creator}
                  className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                />
                <div className="min-w-0 flex items-center gap-1">
                  <span className="text-white text-sm font-medium truncate font-mono">
                    {row.creator}
                  </span>
                  {row.creatorVerified && (
                    <span className="text-blue-400 text-xs flex-shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap ml-1">
                  {row.timeAgo}
                </span>
              </div>
            </td>

            {/* Followers Column */}
            <td className="py-4 px-2">
              <span className="text-gray-300 text-sm">{row.followers}</span>
            </td>

            {/* Mcap Column */}
            <td className="py-4 px-2">
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">{row.mcap}</span>
                <span className={`${row.mcapColor} text-xs font-medium`}>
                  {row.mcapChange}
                </span>
              </div>
            </td>

            {/* Buy Column */}
            <td className="py-4 px-2">
              <button className="bg-[#7D45C3] hover:bg-[#8845d8] transition-all text-white py-1.5 px-4 rounded-full font-semibold text-sm whitespace-nowrap">
                buy
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CultsTable;
