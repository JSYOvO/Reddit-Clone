import { dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const, //cookies 에러바로
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    // result: 캐시에 기록되는 전체 API 결과입니다.
                    //         일반적으로 업데이트 프로그램이 연결된 현재 필드 만보고 결합을 피하고 싶지만
                    //         결과의 모든 부분에 액세스 할 수 있다는 점은 주목할 가치가 있습니다.
                    // args: 필드가 호출 된 인수로, 필드가 인수로 호출되지 않은 경우 빈 개체로 대체됩니다.
                    // cache: cache로컬 캐시와 상호 작용할 수 있도록 메서드에 대한 액세스를 제공 하는 인스턴스입니다.
                    //        전체 API는 API 문서에서 찾을 수 있습니다 .
                    //        이 페이지에서는 캐시를 읽고 쓰기 위해 자주 사용합니다.
                    // info: 이 인수는 자주 사용해서는 안되지만 쿼리 문서의 순회에 대한 실행 정보를 포함합니다.
                    //       리졸버를 재사용 가능하게 만들거나 전체 쿼리에 대한 정보를 검색 할 수 있습니다.
                    //       전체 API는 API 문서에서 찾을 수 있습니다 .

                    logout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => ({ me: null })
                        );
                    },

                    login: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user,
                                    };
                                }
                            }
                        );
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.register.user,
                                    };
                                }
                            }
                        );
                    },
                },
            },
        }),
        ssrExchange,
        fetchExchange,
    ],
});

// SSR
// me => browser localhost 3000 접속
// Next.js 서버는 Graphql서버에 요청을 보냄
// => building the HTML
// => 결과를 browser로 보냄
