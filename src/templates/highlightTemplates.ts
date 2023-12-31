
export const createHighlightTemplate = (
    database_id: string,
    id: string,
    book: string,
    content: string,
    timestamp: string,
    location?: { start: number; end?: number },
    page?: { start: number; end?: number },
    notes?: { content: string; timestamp?: string }[],
    NotesIds?: string
  ): any => {
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
                        content: content.substring(0, 10),
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
            },
            NotesIds: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: (NotesIds? NotesIds: ''),
                        },
                    },
                ],
            },
        },
        children: [
            {
                type: "synced_block",
                synced_block: {
                    synced_from: null,
                    children: [
                        ...createNotesTemplate(notes),
                        {
                           type: "quote",
                           quote: {
                                rich_text: [{
                                    type: "text",
                                    text: {
                                        content: content,
                                    },
                            }],
                           }
                        },
                        {
                            type: "paragraph",
                            paragraph: {
                              rich_text: [{
                                type: "text",
                                text: {
                                    content: `${timestamp} | Location: ${location ? (location.end ? `${location.start}-${location.end}` : `${location.start}`) : 'N/A'}${page ? ` | Page: ${page.end ? `${page.start}-${page.end}` : `${page.start}`}` : ''}`,
                                }
                              }],
                          }
                        }
                    ]
                }
            },
        ]
    };
};


export const createNotesTemplate = (
    notes?: { content: string; timestamp?: string }[]
  ): any[] => {
    return (notes || []).map((note, index) => ({
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `${index + 1}. ${note.content} (${note.timestamp || 'No timestamp'})`,
            },
          },
        ],
      },
    }));
  };  