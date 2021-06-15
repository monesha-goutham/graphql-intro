var express = require("express");
// var expressGraphql = require("express-graphql");
const { graphqlHTTP } = require("express-graphql");
var app = express();
var {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = require("graphql");
const { argsToArgsConfig } = require("graphql/type/definition");

// app.get("/", (req, res) => {
// 	res.send("hello world");
// });

const authors = [
	{ id: 1, name: "J. K. Rowling" },
	{ id: 2, name: "J. R. R. Tolkien" },
	{ id: 3, name: "Brent Weeks" },
];

const books = [
	{ id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
	{ id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
	{ id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
	{ id: 4, name: "The Fellowship of the Ring", authorId: 2 },
	{ id: 5, name: "The Two Towers", authorId: 2 },
	{ id: 6, name: "The Return of the King", authorId: 2 },
	{ id: 7, name: "The Way of Shadows", authorId: 3 },
	{ id: 8, name: "Beyond the Shadows", authorId: 3 },
];

// var schema = new GraphQLSchema({
// 	query: new GraphQLObjectType({
// 		name: "HelloWorld",
// 		fields: () => ({
// 			message: { type: GraphQLString, resolve: () => "hellow world" },
// 		}),
// 	}),
// });

var AuthorType = new GraphQLObjectType({
	name: "Author",
	description: "returns the author of the specific book",
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt) },
		name: { type: GraphQLNonNull(GraphQLString) },
		books: {
			type: new GraphQLList(BookType),
			resolve: (author) => {
				return books.filter((book) => book.authorId == author.id);
			},
		},
	}),
});

var BookType = new GraphQLObjectType({
	name: "BookQuery",
	description: "returns the list of books written by an author",
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt) },
		name: { type: GraphQLNonNull(GraphQLString) },
		authorId: { type: GraphQLNonNull(GraphQLInt) },
		author: {
			type: AuthorType,
			resolve: (book) => {
				return authors.find((author) => author.id == book.authorId);
			},
		},
	}),
});

var RootQueryType = new GraphQLObjectType({
	name: "Query",
	description: "the is the root of the queries",

	fields: () => ({
		book: {
			type: BookType,
			description: "returns a single book",
			args: {
				id: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				return books.find((book) => book.id == args.id);
			},
		},

		author: {
			type: AuthorType,
			description: "returns a single author",
			args: {
				id: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				return authors.find((author) => author.id === args.id);
			},
		},
		books: {
			type: new GraphQLList(BookType),
			description: "list of all books",
			resolve: () => books,
		},

		authors: {
			type: new GraphQLList(AuthorType),
			description: "list of all authors",
			resolve: () => authors,
		},
	}),
});

const RootMutationtype = new GraphQLObjectType({
	name: "RootMutation",
	description: "mutates the data",
	fields: () => ({
		addBook: {
			type: BookType,
			args: {
				name: { type: GraphQLString },
				authorId: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				const book = {
					id: books.length + 1,
					name: args.name,
					authorId: args.authorId,
				};
				books.push(book);
				return book;
			},
		},
	}),
});

var schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationtype,
});
app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		graphiql: true,
	})
);

app.listen("5000", () => {
	console.log("server is running");
});
