import SmallTokenCard from "../cards/SmallTokenCard";

// Sample token data - replace with your actual token data
const SAMPLE_TOKENS = [
  {
    id: 1,
    name: "BUFFDOGE",
    action: "buy",
    amount: "0.001 SOL",
    hash: "HbGE...Jmqz",
    avatar: "/images/PINK.png", // Replace with actual image
    bgColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
  {
    id: 2,
    name: "fentanyl",
    action: "sell",
    amount: "0.82 SOL",
    hash: "HVtK...qP7K",
    avatar: "/images/YEL.png",
    bgColor: "bg-gradient-to-r from-purple-600 to-blue-700",
  },
  {
    id: 3,
    name: "BUFFDOGEI",
    action: "sell",
    amount: "0.004 SOL",
    hash: "HVtK...qP7K",
    avatar: "/images/PINK.png",
    bgColor: "bg-gradient-to-r from-pink-400 to-red-500",
  },
  {
    id: 4,
    name: "BUFFDOGEa",
    action: "buy",
    amount: "0.06 SOL",
    hash: "HzVD...FECK",
    avatar: "/images/YEL.png",
    bgColor: "bg-gradient-to-r from-yellow-300 to-yellow-600",
  },
  {
    id: 5,
    name: "BUFFDOGEI",
    action: "buy",
    amount: "1.184 SOL",
    hash: "9MsN...67ps",
    avatar: "/images/PINK.png",
    bgColor: "bg-gradient-to-r from-pink-500 to-purple-600",
  },
];

const Activities = () => {
  return (
    <div className="w-full mt-[40px] mb-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-4 lg:px-6">
        {SAMPLE_TOKENS.map((token) => (
          <SmallTokenCard key={token.id} token={token} />
        ))}
        {/* Duplicate for infinite effect if needed */}
        {SAMPLE_TOKENS.map((token) => (
          <SmallTokenCard key={`duplicate-${token.id}`} token={token} />
        ))}
      </div>
    </div>
  );
};

export default Activities;
