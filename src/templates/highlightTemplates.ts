
export const createHighlightTemplate = (
    database_id: string,
    id: string,
    book: string,
    content: string,
    timestamp: string,
    location?: { start: number; end?: number },
    page?: { start: number; end?: number },
    note?: { content: string; timestamp?: string },
    NoteId?: string
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
            NotesIds: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: (NoteId? NoteId: ''),
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
                            //...other keys excluded
                            "type": "divider",
                            //...other keys excluded
                            "divider": {}
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
        const noteContentArray = note.content.match(/.{1,2000}/g) || [note.content];

        const newChildren = [
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
                      content: `${timestamp}`,
                    },
                  },
                ],
              },
            },
            {
                "type": "divider",
                "divider": {}
              }
          ];
          
          highlightTemplate.children[0]['synced_block']["children"].push(...newChildren);
          
    }

    return highlightTemplate
};