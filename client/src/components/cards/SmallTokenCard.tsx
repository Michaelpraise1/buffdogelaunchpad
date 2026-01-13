const SmallTokenCard = ({ token }: any) => (
  <div className="border-[0.4px] border-[#9B8AFB] flex-shrink-0 w-[220px] lg:w-[250px] h-[85px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
    <div
      className={`slider-bg h-full flex items-center justify-between   relative`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-[85px] h-[85px]   backdrop-blur-sm  overflow-hidden flex items-center justify-center">
          <img
            src={token.avatar || "/logo.png"}
            alt={token.name}
            className="w-full object-cover  "
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.png";
            }}
          />
        </div>

        <div className="flex flex-col">
          <h3 className="text-white font-bold text-[14px] lg:text-[16px] uppercase tracking-wide">
            {token.name}
          </h3>
          <p className="text-[#9B8AFB] text-[12px] lg:text-[13px] font-bold">
            {token.action} {token.amount}
          </p>
          <p className="text-[#9DA4AE] text-[11px] lg:text-[12px] font-light rounded-lg backdrop-blur-sm">
            {token.hash}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SmallTokenCard;
