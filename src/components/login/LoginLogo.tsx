import Image from 'next/image';

const LoginLogo = () => {
  return (
    <div className="mx-auto flex h-[50px] w-[50px] items-center justify-center rounded-[19px] bg-white shadow-[0_14px_30px_rgba(27,48,97,0.12)]">
      <Image
        src="/logo.png"
        alt="V Tasker logo"
        width={50}
        height={50}
        priority
        unoptimized
        className="h-[50px] w-[50px] object-contain"
      />
    </div>
  );
};

export default LoginLogo;
