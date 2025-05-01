function LoginButton({ children }) {
  return (
    <button className="w-[180px] h-[47px] bg-black text-white rounded-[10px] text-2xl mt-8 hover:bg-black/90">
      {children}
    </button>
  );
}

export default LoginButton;
