// tests/__helpers.ts

import { ServerInfo } from "apollo-server";
import getPort, { makeRange } from 'get-port';
import { GraphQLClient } from "graphql-request";
import { graphql15InterfaceConfig } from "nexus/dist/utils";
import { server } from "../api/server";

type TestContext = {
    client: GraphQLClient;
};

export function createTestContext(): TestContext {
    let ctx = {} as TestContext;
    const graphqlCtx = graphqlTestContext();

    beforeEach(async () => {
        const client = await graphqlCtx.before();
        Object.assign(ctx, {
            client,
        });
    });

    afterEach(async () => {
        await graphqlCtx.after();
    });

    return ctx;
}

function graphqlTestContext() {
    let serverInstance: ServerInfo | null = null;

    return {
        async before() {
            const port = await getPort({ port: makeRange(4000, 6000) });
            serverInstance = await server.listen({ port });

            return new GraphQLClient(`http://localhost:${port}`);
        },
        async after() {
            serverInstance?.server.close();
        },
    };
}