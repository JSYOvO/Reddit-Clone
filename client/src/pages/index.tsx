import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Layout from "../components/Layout";
import NextLink from "next/link";
import {
    Box,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useState } from "react";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 10,
        cursor: null as null | string,
    });

    const [{ data, fetching }] = usePostsQuery({
        variables: variables,
    });

    if (!fetching && !data) {
        return <div>You got some trouble...</div>;
    }

    return (
        <Layout>
            <Flex align="center" my={10}>
                <Heading>Reddit Clone</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">create post</Link>
                </NextLink>
            </Flex>

            {!data && fetching ? (
                <div>Loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) => (
                        <Box
                            key={p.id}
                            p={5}
                            shadow={"md"}
                            borderWidth={"1px"}
                        >
                            <Heading fontSize={"xl"}>
                                {p.title}
                            </Heading>
                            <Text mt={4}>{p.textSnippet}</Text>
                        </Box>
                    ))}
                </Stack>
            )}
            {data && data.posts.hasMore ? (
                <Flex>
                    <Button
                        onClick={() => {
                            setVariables({
                                limit: variables.limit,
                                cursor:
                                    data.posts.posts[
                                        data.posts.posts.length - 1
                                    ].createdAt,
                            });
                        }}
                        isLoading={fetching}
                        m={"auto"}
                        my={8}
                    >
                        Load More
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
