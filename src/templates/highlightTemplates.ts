
export const createHighlightTemplate = (
    database_id: string,
    id: string,
    book: string,
    content: string,
    timestamp: string,
    location?: { start: number; end?: number },
    page?: { start: number; end?: number },
    note?: { content: string; timestamp?: string },
    noteId?: string
  ): any => {
    const contentArray = content.match(/.{1,2000}/g) || [content]; // decompose content to blocks of max size 2000
    
    const highlightTemplate =  {
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
                        content: contentArray[0].substring(0, 50),
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
            NoteId: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: (noteId? noteId: ''),
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
                        {
                           type: "quote",
                           quote: {
                                rich_text: contentArray.map((c) => {return {type: "text", text: { content: c}}})
                           }
                        },
                        {
                            type: "paragraph",
                            paragraph: {
                              rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: `${timestamp} | Location: `,
                                    }
                                },
                                { 
                                    type: "text",
                                    text: {
                                        content: `${location ? (location.end ? `${location.start}-${location.end}` : `${location.start}`) : 'N/A'}`,
                                    },
                                },
                                {
                                    type: "text",
                                    text: {
                                        content: `${page.start ? ` | Page: ${page.end ? `${page.start}-${page.end}` : `${page.start}`}` : ''}`,
                                    }
                                },
                            ],
                          }
                        },
                        {
                            type: "divider",
                            divider: {}
                        },
                        {
                            type: "heading_3",
                            heading_3: {
                                rich_text: [
                                    {
                                        type: "text",
                                        text: {
                                            content: "Notes",
                                        }
                                    }
                                ],
                                // is_toggleable: true,
                            },
                        },
                        
                    ]
                }
            },
        ]
    };

    if(note){
        const newChildren = createNoteTemplate(note)
          
        highlightTemplate.children[0]['synced_block']["children"].push(...newChildren);
          
    }

    return highlightTemplate
};

export const createNoteTemplate = (
    note?: { content: string; timestamp?: string },
  ): any => {
    const noteContentArray = note.content.match(/.{1,2000}/g) || [note.content];

    return [
        {
          type: "paragraph",
          paragraph: {
            rich_text: noteContentArray.map((c) => ({ type: "text", text: { content: c } })),
          },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `${note.timestamp}`,
                },
              },
            ],
          },
        },
        {
            type: "divider",
            divider: {}
          }
    ];
}