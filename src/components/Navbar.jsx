function Navbar(props) {
    return (
        <nav className="flex justify-center items-center my-5 mx-auto bg-[#f8f8f8] w-130 p-3 rounded-full
        shadow-[inset_0px_30px_60px_-12px_rgba(50,50,93,0.05),_inset_0px_18px_36px_-18px_rgba(0,0,0,0.1)]">
            <ul className="flex gap-10 text-[#fefae0] text-[0.8rem]
            [&>li]:bg-[#606c38] [&>li]:px-10 [&>li]:leading-10 [&>li]:rounded-2xl
            [&>li]:cursor-pointer tracking-widest">
                <li onClick={props.handleSignupClick}>SIGN UP</li>
                <li onClick={props.handleLoginClick}>LOG IN</li>
            </ul>
        </nav>
    )
}

export default Navbar