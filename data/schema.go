package data

import (
	"log"

	// internal
	"github.com/jaredonline/etsy-inventory/database"

	// external
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/relay"
	"gopkg.in/gorp.v1"
)

var (
	User   *graphql.Object
	Item   *graphql.Object
	query  *graphql.Object
	Schema graphql.Schema

	dbMap *gorp.DbMap

	err error
)

func init() {
	dbMap, err = database.InitDB("development")
	if err != nil {
		log.Fatal("[FATAL] could not initialize db: ", err)
	}

	User = graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id": relay.GlobalIDField("User", nil),
			"email": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	Item = graphql.NewObject(graphql.ObjectConfig{
		Name: "Item",
		Fields: graphql.Fields{
			"id": relay.GlobalIDField("Item", nil),
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"purchase_price_cents": &graphql.Field{
				Type: graphql.Int,
			},
			"sale_price_cents": &graphql.Field{
				Type: graphql.Int,
			},
		},
	})

	User.AddFieldConfig("items", &graphql.Field{
		Type: graphql.NewList(Item),
		Resolve: func(p graphql.ResolveParams) interface{} {
			return database.GetAllItems(dbMap)
		},
	})

	query = graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"me": &graphql.Field{
				Type: User,
				Resolve: func(p graphql.ResolveParams) interface{} {
					return database.GetUser(dbMap, 1)
				},
			},
		},
	})

	/**
	 * This is the type that will be the root of our mutations,
	 * and the entry point into performing writes in our schema.
	 */
	//	mutationType := graphql.NewObject(graphql.ObjectConfig{
	//		Name: "Mutation",
	//		Fields: graphql.Fields{
	//			// Add you own mutations here
	//		},
	//	})

	/**
	* Finally, we construct our schema (whose starting query type is the query
	* type we defined above) and export it.
	 */
	Schema, err = graphql.NewSchema(graphql.SchemaConfig{
		Query: query,
	})
	if err != nil {
		panic(err)
	}

}