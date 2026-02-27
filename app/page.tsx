import Image from "next/image";

export default function Home() {
  return (
    <div className="relative h-screen w-screen flex justify-center items-center overflow-hidden">
      
      {/* Dark overlay for opacity effect */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Skull */}
      <div className="h-[130vh]">
        <Image
          src="/skull.png"
          alt="Skull"
          width={2000}
          height={3000}
          className="h-full w-auto object-contain"
          priority
        />
      </div>

      {/* Rotating Gear */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "56%",
          marginLeft: "-110px",
          marginTop: "-110px",
          zIndex: 5,
        }}
      >
        <img
          src="/gear.png"
          alt="Gear"
          width={150}
          height={150}
          className="spin-gear"
        />
      </div>

      {/* Welcome Text */}
      <div
        style={{ zIndex: 30 }}
        className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-2"
      >
        <p className="text-white/50 tracking-[0.4em] text-xs uppercase">
          you have entered
        </p>
        <h1
          className="text-white font-bold uppercase tracking-widest text-center"
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            textShadow: "0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.1)",
            letterSpacing: "0.15em",
          }}
        >
          Welcome to my Mind
        </h1>
        <div className="w-24 h-[1px] bg-white/30 mt-1" />
      </div>

    </div>
  );
}