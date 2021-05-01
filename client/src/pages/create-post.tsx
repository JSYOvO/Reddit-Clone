import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {
                    const { error } = await createPost({
                        input: values,
                    });
                    if (
                        error?.message.includes("Not anthenticated")
                    ) {
                        router.push("/login");
                    } else {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="Title"
                        />
                        <Box marginTop="4">
                            <InputField
                                textarea
                                name="text"
                                placeholder="text..."
                                label="Body"
                            />
                        </Box>

                        <Button
                            marginTop="4"
                            type="submit"
                            color="teal"
                            isLoading={isSubmitting}
                        >
                            create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
