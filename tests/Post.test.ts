// tests/Post.test.ts

import { createTestContext } from "./__helpers";

const ctx = createTestContext();

it('ensures that a draft can be created and published', async () => {
    //Create a new draft
    const draftResult = await ctx.client.request(`
    mutation {
        createDraft(title: "Nextus", body: "blah blah blah") {
            id
            title
            body
            published
        }
    }
    `)
    // Snapshot
    expect(draftResult).toMatchInlineSnapshot(`
Object {
  "createDraft": Object {
    "body": "blah blah blah",
    "id": 1,
    "published": false,
    "title": "Nextus",
  },
}
`);

    // Publish
    const publishResult = await ctx.client.request(`
    mutation publishDraft($draftId: Int!) {
        publish(draftId: $draftId) {
            id
            title
            body
            published
        }
    }
    `,
        { draftId: draftResult.createDraft.id }
    )

    // Snapshot
    expect(publishResult).toMatchInlineSnapshot(`
Object {
  "publish": Object {
    "body": "blah blah blah",
    "id": 1,
    "published": true,
    "title": "Nextus",
  },
}
`);
})