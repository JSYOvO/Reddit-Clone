import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage = () => {
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token:
                            typeof router.query.token === "string"
                                ? router.query.token
                                : "",
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        //worked
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError ? (
                            <Flex mt="5px">
                                <Box mr={2} style={{ color: "red" }}>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgot-password">
                                    <Link ml="auto">
                                        Click here to get new token
                                    </Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button
                            marginTop="4"
                            type="submit"
                            color="teal"
                            isLoading={isSubmitting}
                        >
                            change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(
    ChangePassword as any
);
