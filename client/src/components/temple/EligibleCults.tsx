import React from "react";

const ELIGIBLE_CULTS = [
  {
    cult: "FUMBLE",
    name: "Fucked Up My Bag Lost Everything",
    avatar: "/images/PINK.png",
    creator: "H3qx...7imc",
    creatorAvatar: "/images/YEL.png",
    currentMcap: "$3,186,942",
    athMcap: "$19,411,438",
    timeAgo: "30d 9h ago",
  },
  {
    cult: "FUMBLE",
    name: "Fucked Up My Bag Lost Everything",
    avatar: "/images/PINK.png",
    creator: "H3qx...7imc",
    creatorAvatar: "/images/YEL.png",
    currentMcap: "$3,186,942",
    athMcap: "$19,411,438",
    timeAgo: "30d 9h ago",
  },
  {
    cult: "FUMBLE",
    name: "Fucked Up My Bag Lost Everything",
    avatar: "/images/PINK.png",
    creator: "H3qx...7imc",
    creatorAvatar: "/images/YEL.png",
    currentMcap: "$3,186,942",
    athMcap: "$19,411,438",
    timeAgo: "30d 9h ago",
  },
];

const EligibleCults: React.FC = () => {
  return (
    <div className="bg-[#271431] rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-6">
        Eligible Cults Launched This Period
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-xs font-medium border-b border-gray-600/20">
              <th className="text-left py-3 px-2">Cult</th>
              <th className="text-left py-3 px-2">Created By</th>
              <th className="text-left py-3 px-2">Current Mcap</th>
              <th className="text-left py-3 px-2">ATH Mcap</th>
              <th className="text-right py-3 px-2">Buy</th>
            </tr>
          </thead>
          <tbody>
            {ELIGIBLE_CULTS.map((cult, index) => (
              <tr key={index}>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={cult.avatar}
                      alt={cult.cult}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-bold text-sm">
                        {cult.cult}
                      </div>
                      <div className="text-gray-400 text-xs">{cult.name}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={cult.creatorAvatar}
                      alt={cult.creator}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-white text-sm font-mono">
                      {cult.creator}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {cult.timeAgo}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <span className="text-white font-bold text-sm">
                    {cult.currentMcap}
                  </span>
                </td>

                <td className="py-4 px-2">
                  <span className="text-white font-bold text-sm">
                    {cult.athMcap}
                  </span>
                </td>

                <td className="py-4 px-2 text-right">
                  <button className="bg-[#7D45C3] hover:bg-[#8845d8] text-white px-4 py-1.5 rounded-full font-semibold text-sm transition-all">
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EligibleCults;
