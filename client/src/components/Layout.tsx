import React from "react";
import NavBar from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface Layout {
    variant: WrapperVariant;
}

const Layout: React.FC<Layout> = ({ children, variant }) => {
    return (
        <>
            <NavBar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};

export default Layout;
