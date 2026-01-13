import TopCultCards from "../components/cards/TopCultCard";
import { Header } from "../components/navigation/Header";
import CultsTable from "../components/ui/CultTables";

const Leaderboard = () => {
  return (
    <div className="min-h-screen w-full home-bg  pb-7 px-4 ">
      <Header />
      <div className="max-w-[1200px] mx-auto flex flex-col gap-7 pt-[30px]">
        <div className="w-full top-cult-grad rounded-2xl p-7  flex flex-col md:flex-row items-start md:items-center justify-between gap-7 shadow-md mb-0 relative">
          <div>
            <p className="golden-text text-sm mb-2 font-medium">leaderboard</p>
            <h1 className="text-white text-3xl lg:text-4xl font-bold mb-1">
              Top Cults
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2" />
              <span className="text-gray-300 text-[16px]">
                only cults launched by x accounts
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 right-7 hidden md:block">
            <img
              src="/images/l.png"
              alt="Buff Doge"
              className="w-[145px] h-auto object-contain"
            />
          </div>
        </div>
        <TopCultCards />
        <CultsTable />
      </div>
    </div>
  );
};

export default Leaderboard;
