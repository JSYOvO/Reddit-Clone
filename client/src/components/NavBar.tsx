import { Button } from "@chakra-ui/button";
import { Box, Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBar {}

const NavBar: React.FC<NavBar> = ({}) => {
    const [{ data, fetching }] = useMeQuery();
    let body = null;

    if (fetching) {
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>register</Link>
                </NextLink>
            </>
        );
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button variant="link">logout</Button>
            </Flex>
        );
    }

    return (
        <Flex bg="tomato" p={4}>
            <Box ml={"auto"}>{body}</Box>
        </Flex>
    );
};

export default NavBar;
