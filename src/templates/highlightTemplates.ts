
export const createHighlightTemplate = (database_id: string, id: string, book: string): any => {
    return {
        parent: {
            database_id: database_id
        },
        icon: {
            type: "emoji",
            emoji: "✍🏻"
        },
        properties: {
            Name: {
                title: [
                    {
                        type: 'text',
                        text: {
                        content: id,
                        },
                    },
                ],
            },
            Books: {
                relation: [
                    {
                        id: book
                    },
                ],
            },
            Id: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: id,
                        },
                    },
                ],
            },
            Status: {
                select: {
                    name: "Unprocessed"
                }
            }
        },
        children: []
    };
};