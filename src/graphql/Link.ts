import { arg, extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    name: "Link", // 1 
    definition(t) {  // 2
        t.nonNull.int("id"); // 3 
        t.nonNull.string("description"); // 4
        t.nonNull.string("url"); // 5 
        t.nullable.string('APIMessage')
    },
});


let links: NexusGenObjects["Link"][] = [   // 1
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

export const LinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   // 3
            type: "Link",

            resolve(parent, args, context, info) {    // 4
                return links;
            },
        });
        t.nonNull.field('link', {
            type: 'Link',
            args: {
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {
                return links.filter(link => link.id === args.id)[0]
            }
        })
    },
});

export const LinkMutation = extendType({  // 1
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {  // 2
            type: "Link",
            args: {   // 3
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            resolve(parent, args, context) {
                const { description, url } = args;  // 4

                let idCount = links.length + 1;  // 5
                const link = {
                    id: idCount,
                    description: description,
                    url: url,
                };
                links.push(link);
                return link;
            },
        });
        t.nonNull.field('updateLink', {
            type: 'Link',
            args: {
                id: nonNull(intArg()),
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {
                let link = links.find(link => link.id === args.id);
                if (link) {
                    link.id = args.id
                    link.description = args.description
                    link.url = args.url
                    return link
                }
                else {
                    let link1: NexusGenObjects["Link"] =  // 1
                    {
                        id: -1,
                        url: "",
                        description: "",
                        APIMessage: "Error not found"
                    }
                    return link1
                }

            }

        });
        t.nonNull.field('deleteLink',{
            type: 'Link',
            args: {
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info){
                let index:number = links.findIndex(link => link.id === args.id)
                if(index>=0)
                {
                    let link = links[index]
                    link.APIMessage = "Removed"
                    links.splice(index,1)
                    return link
                }
                else{
                    let link1: NexusGenObjects["Link"] =  // 1
                    {
                        id: -1,
                        url: "",
                        description: "",
                        APIMessage: "Error not found"
                    }
                    return link1
                }
                
            }
        })
    },
});
