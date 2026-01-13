const CARDS = [
  {
    rank: "#001",
    name: "KUMA",
    subtitle: "Captain KUMA",
    mcap: "+0.1%",
    mcapColor: "text-green-400",
    vol: "-20.1%",
    volColor: "text-red-400",
    sol: "$6.5582M",
    volSol: "$11,161.31",
    avatar: "/images/PINK.png",
    creator: "6Lur...rsWe",
    ago: "3mos 3d 11h ago",
  },
  {
    rank: "#002",
    name: "FUMBLE",
    subtitle: "Fucked Up My Bag Lost Everything",
    mcap: "-7.19%",
    mcapColor: "text-red-400",
    vol: "+320.69%",
    volColor: "text-green-400",
    sol: "$3.1916M",
    volSol: "$35,870.80",
    avatar: "/images/YEL.png",
    creator: "H3qx...7imc",
    ago: "30d 9h ago",
  },
  {
    rank: "#003",
    name: "WUFF",
    subtitle: "Wuff",
    mcap: "-19.89%",
    mcapColor: "text-red-400",
    vol: "-94.79%",
    volColor: "text-red-400",
    sol: "$1.8497M",
    volSol: "$66,871.88",
    avatar: "/images/PINK.png",
    creator: "Fkpg...ZmJz",
    ago: "4d 9h ago",
  },
];

const TopCultCards = () => (
  <div className="w-full flex gap-4 flex-col md:flex-row items-center mb-0">
    {CARDS.map((cult, _idx: number) => (
      <div
        key={cult.rank}
        className="rounded-2xl bg-[#271431] p-6 w-full max-w-[400px] shadow-md border-none flex flex-col justify-between"
      >
        <div className="mb-3 flex flex-row justify-between">
          <div>
            <div className="text-gray-300 text-xs">{cult.rank}</div>
            <div className="text-white text-lg font-bold leading-tight">
              {cult.name}
            </div>
            <div className="pt-1 text-gray-300 font-light  text-xs mb-1">
              {cult.subtitle}
            </div>
          </div>
          <div>
            {/* Optional cult image */}
            <img
              src={cult.avatar}
              alt={cult.name}
              className="w-[44px] h-[44px] rounded-full object-cover bg-white/10"
            />
          </div>
        </div>
        <div className="flex flex-row gap-5 text-xs mb-2">
          <span className={cult.mcapColor + " font-bold"}>mc {cult.mcap}</span>
          <span className={cult.volColor + " font-bold"}>
            24h vol {cult.vol}
          </span>
        </div>
        <div className="flex flex-row gap-6 text-white font-bold text-[15px] mb-4">
          <span>{cult.sol}</span>
          <span>{cult.volSol}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={cult.avatar}
              alt="creator"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-400 text-xs font-mono">
              {cult.creator}
            </span>
            <span className="text-gray-400 text-[12px]">{cult.ago}</span>
          </div>
          <button className="bg-[#7D45C3] hover:bg-[#8845d8] transition-all text-white py-2 px-5 rounded-full font-semibold text-sm">
            Buy
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default TopCultCards;
