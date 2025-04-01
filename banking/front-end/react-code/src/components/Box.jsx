import React from "react";

const leftBarsData = [
  { height: "271px", top: "313px" },
  { height: "165px", top: "419px" },
  { height: "424px", top: "160px" },
  { height: "504px", top: "80px" },
  { height: "584px", top: "0px" },
  { height: "465px", top: "119px" },
  { height: "347px", top: "237px" },
];

const rightBarsData = [
  { height: "228px", top: "265px" },
  { height: "206px", top: "287px" },
  { height: "358px", top: "135px" },
  { height: "426px", top: "67px" },
  { height: "493px", top: "0px" },
  { height: "393px", top: "100px" },
  { height: "293px", top: "200px" },
];

const Box = () => {
  return (
    <div>
      <div className="fixed w-full h-[610px] top-0 left-0">
        {/* Left bars group */}
        <div className="absolute blur-[25px] mix-blend-screen border-hidden">
          {leftBarsData.map((bar, index) => (
            <div
              key={`left-bar-${index}`}
              className="absolute w-[60px] bg-primary opacity-20"
              style={{
                height: bar.height,
                top: bar.top,
                left: `${index * 125}px`,
              }}
            />
          ))}
        </div>

        {/* Right bars group */}
        <div className="absolute w-[712px] h-[493px] top-[117px] right-0 blur-[25px] mix-blend-screen">
          {rightBarsData.map((bar, index) => (
            <div
              key={`right-bar-${index}`}
              className="absolute w-[53px] bg-primary opacity-20"
              style={{
                height: bar.height,
                top: bar.top,
                left: `${index * 110}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Box;
