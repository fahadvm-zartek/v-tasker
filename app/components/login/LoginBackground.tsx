import React from 'react';

type LoginBackgroundProps = {
  children: React.ReactNode;
};

const LoginBackground = ({ children }: LoginBackgroundProps) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7f5] px-5 py-10 text-[#1B3061]">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-[13vw] -top-[28vh] h-[76vh] w-[35vw] min-w-[250px] rotate-[-15deg] rounded-[999px] bg-[#1B3061] opacity-[0.94]" />
        <div className="absolute left-[10vw] top-[-25vh] h-[80vh] w-[35vw] min-w-[280px] rotate-[12deg] rounded-[999px] bg-white/90" />
        <div className="absolute left-[-10vw] top-[54vh] h-[42vh] w-[70vw] rotate-[14deg] rounded-[999px] bg-[#1B3061] opacity-[0.88]" />
        <div className="absolute -bottom-[24vh] right-[-10vw] h-[70vh] w-[40vw] min-w-[300px] rotate-[-22deg] rounded-[999px] bg-[#1B3061] opacity-[0.92]" />
        <div className="absolute left-[19vw] top-[31vh] h-[48vh] w-[42vw] rotate-[-16deg] rounded-[999px] bg-[#E68A2E] opacity-[0.72] mix-blend-multiply" />
        <div className="absolute bottom-[3vh] right-[8vw] h-[47vh] w-[42vw] rotate-[-6deg] rounded-[999px] bg-[#E68A2E] opacity-[0.68] mix-blend-multiply" />
        <div className="absolute left-[34vw] top-[20vh] h-[31vh] w-[52vw] rotate-[18deg] rounded-[999px] bg-[#e9e6df]/80 mix-blend-multiply" />
        <div className="absolute bottom-[-18vh] left-[10vw] h-[50vh] w-[58vw] rotate-[13deg] rounded-[999px] bg-white/74 blur-[18px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.82),transparent_28%),radial-gradient(circle_at_5%_92%,rgba(255,255,255,0.88),transparent_26%)]" />
      </div>

      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  );
};

export default LoginBackground;
