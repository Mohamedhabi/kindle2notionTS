
export const createBookTemplate = (database_id: string, title: string, author: string): any => {
    return {
        parent: {
            database_id: database_id
        },
        icon: {
            type: "emoji",
            emoji: "📘"
        },
        properties: {
            Title: {
                title: [
                {
                    type: 'text',
                    text: {
                    content: title,
                    },
                },
                ],
            },
            Author: {
                rich_text: [
                {
                    type: "text",
                    text: {
                    content: author,
                    },
                },
                ],
            },
        },
        children: createBookPageContentTemplate()
    };
};

export const createBookPageContentTemplate = (): any => {
    return [
        {
            type: "heading_1",
            heading_1: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: "🚀 The Book in 3 Sentences",
                        }
                    }
                ],
                is_toggleable: true,
                children: [
                    {
                        type: "numbered_list_item",
                        numbered_list_item: {
                        rich_text: [
                            {
                            type: "text",
                            text: {
                                content: "",
                            }
                            }
                        ],
                        }
                    },
                ]
            },
        },
        {
            type: "heading_1",
            heading_1: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: "🎨 Impressions",
                        }
                    }
                ],
                is_toggleable: true,
                children: [
                    {
                        type: "paragraph",
                        paragraph: {
                        rich_text: [
                            {
                            type: "text",
                            text: {
                                content: "How I Discovered it",
                            }
                            }
                        ],
                        }
                    },
                    {
                        type: "paragraph",
                        paragraph: {
                        rich_text: [
                            {
                            type: "text",
                            text: {
                                content: "Who Should Read it?",
                            }
                            }
                        ],
                        }
                    },
                ]
            },
        },
        {
            type: "heading_1",
            heading_1: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: "🛸 How the Book Changed Me",
                        }
                    }
                ],
                is_toggleable: true,
                children: [
                    {
                        type: "callout",
                        callout: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: "How my life /behaviour /thoughts /ideas have changed as a result of reading this book",
                                    }
                                }
                            ],
                            color: "gray_background"
                        }
                    },
                    {
                        type: "bulleted_list_item",
                        bulleted_list_item: {
                            rich_text: [
                                {
                                type: "text",
                                text: {
                                    content: "",
                                }
                                }
                            ]
                        }
                    }
                ]
            },
        },
        {
            type: "heading_1",
            heading_1: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: "✍🏻 My Top 3 Quotes",
                        }
                    }
                ],
                is_toggleable: true,
                children: [
                    {
                        type: "numbered_list_item",
                        numbered_list_item: {
                        rich_text: [
                            {
                            type: "text",
                            text: {
                                content: "",
                            }
                            }
                        ],
                        }
                    },
                ]
            },
        },
        {
            type: "heading_1",
            heading_1: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: "📜 All highlights",
                        }
                    }
                ],
                is_toggleable: true,
            },
        },
    ]
}